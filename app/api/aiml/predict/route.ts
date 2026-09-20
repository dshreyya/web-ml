import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("AIML proxy error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to connect to Python AIML API.",
      },
      { status: 500 }
    );
  }
}