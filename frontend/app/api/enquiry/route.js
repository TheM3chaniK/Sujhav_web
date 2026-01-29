import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getGoogleAuth } from "@/lib/googleAuth";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();

    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toLocaleString(), body.email, body.message]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enquiry Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

