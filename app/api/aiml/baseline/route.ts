import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetch("http://127.0.0.1:8000/baseline", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      return NextResponse.json(data, {
        status: response.status,
      });
    }

    const responseText = await response.text();

    return NextResponse.json(
      {
        success: false,
        error:
          responseText ||
          "Python AIML baseline API returned an invalid response.",
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("AIML baseline proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to connect to Python AIML baseline API. Make sure the Python API is running on port 8000.",
      },
      { status: 500 }
    );
  }
}
