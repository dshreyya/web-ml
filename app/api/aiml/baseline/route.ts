import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const AIML_API_URL = "http://127.0.0.1:8000";
const BASELINE_BUCKET = "baseline-reports";
const EXCEL_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function POST(request: Request) {
  try {
    /*
     * ============================================================
     * 1. RECEIVE ZIP FROM FARMER
     * ============================================================
     */
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please upload a ZIP file.",
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * 2. SEND ZIP TO PYTHON AIML API
     * ============================================================
     */
    const response = await fetch(`${AIML_API_URL}/baseline`, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      if (contentType.includes("application/json")) {
        const errorData = await response.json();

        return NextResponse.json(
          {
            success: false,
            error:
              errorData?.error ||
              "Python AIML baseline processing failed.",
          },
          { status: response.status }
        );
      }

      const errorText = await response.text();

      return NextResponse.json(
        {
          success: false,
          error:
            errorText ||
            "Python AIML baseline processing failed.",
        },
        { status: response.status }
      );
    }

    if (!contentType.includes("application/json")) {
      const responseText = await response.text();

      return NextResponse.json(
        {
          success: false,
          error:
            responseText ||
            "Python AIML baseline API returned an invalid response.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || "Baseline analysis failed.",
        },
        { status: 502 }
      );
    }

    /*
     * ============================================================
     * 3. CONNECT TO SUPABASE USING SERVER-ONLY SERVICE ROLE KEY
     * ============================================================
     *
     * This key must NEVER be exposed to the browser.
     * Add SUPABASE_SERVICE_ROLE_KEY to .env.local.
     */
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error(
        "Supabase server configuration is missing. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local."
      );
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    /*
     * ============================================================
     * 4. FETCH GENERATED EXCEL REPORT FROM PYTHON API
     * ============================================================
     *
     * The /baseline endpoint returns the calculated JSON result.
     * The /report endpoint returns the generated Excel file.
     */
    const reportResponse = await fetch(`${AIML_API_URL}/report`, {
      method: "GET",
      cache: "no-store",
    });

    if (!reportResponse.ok) {
      const reportErrorText = await reportResponse.text();

      throw new Error(
        reportErrorText ||
          `Unable to download the generated baseline report from the Python API. Status: ${reportResponse.status}`
      );
    }

    const reportContentType =
      reportResponse.headers.get("content-type") || "";

    if (
      !reportContentType.includes("spreadsheetml") &&
      !reportContentType.includes("application/vnd.ms-excel") &&
      !reportContentType.includes("application/octet-stream")
    ) {
      throw new Error(
        "The Python /report endpoint did not return an Excel file."
      );
    }

    const reportArrayBuffer = await reportResponse.arrayBuffer();
    const reportBuffer = Buffer.from(reportArrayBuffer);

    if (reportBuffer.length === 0) {
      throw new Error("The generated baseline Excel report is empty.");
    }

    /*
     * ============================================================
     * 5. UPLOAD EXCEL TO SUPABASE STORAGE
     * ============================================================
     */
    const timestamp = Date.now();
    const safeFileName = `BlueCarbon_Baseline_Report_${timestamp}.xlsx`;
    const storagePath = `reports/${safeFileName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BASELINE_BUCKET)
      .upload(storagePath, reportBuffer, {
        contentType: EXCEL_CONTENT_TYPE,
        upsert: true,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error(
        "Baseline report Supabase Storage upload error:",
        uploadError
      );

      throw new Error(
        `Baseline report was generated, but the Excel file could not be uploaded to Supabase Storage: ${uploadError.message}`
      );
    }

    /*
     * ============================================================
     * 6. GET PUBLIC SUPABASE STORAGE URL
     * ============================================================
     */
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BASELINE_BUCKET)
      .getPublicUrl(storagePath);

    const baselineUrl = publicUrlData?.publicUrl;

    if (!baselineUrl) {
      throw new Error(
        "Baseline report was uploaded, but its Supabase public URL could not be generated."
      );
    }

    console.log("Baseline report uploaded successfully:", {
      bucket: BASELINE_BUCKET,
      path: storagePath,
      url: baselineUrl,
    });

    /*
     * ============================================================
     * 7. RETURN AI RESULT + SUPABASE BASELINE URL
     * ============================================================
     *
     * The Farmer page should save data.baseline_url into:
     * public.baseline_reports.baseline_url
     */
    return NextResponse.json(
      {
        ...data,
        baseline_url: baselineUrl,
        baseline_storage_bucket: BASELINE_BUCKET,
        baseline_storage_path: storagePath,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AIML baseline proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate and store the baseline report.",
      },
      { status: 500 }
    );
  }
}
