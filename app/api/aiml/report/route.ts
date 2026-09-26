import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const response = await fetch("http://127.0.0.1:8000/report", {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Baseline report is not available yet.",
        },
        { status: response.status }
      );
    }

    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="BlueCarbon_Baseline_Report.xlsx"',
      },
    });
  } catch (error) {
    console.error("Baseline report download error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to connect to Python AIML API. Make sure the Python API is running on port 8000.",
      },
      { status: 500 }
    );
  }
}