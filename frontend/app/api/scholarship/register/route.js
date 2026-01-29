import { google } from "googleapis";
import { NextResponse } from "next/server";
import { getGoogleAuth } from "@/lib/googleAuth";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const {
      studentName,
      parentName,
      phone,
      email,
      currentClass,
      schoolName,
      address,
      preferredDate,
      preferredTimeSlot,
      lastMarks,
      targetCourse,
      additionalNotes,
    } = body;

    if (!studentName || !phone || !email || !currentClass) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString(),
            studentName,
            parentName || "",
            phone,
            email,
            currentClass,
            schoolName || "",
            address || "",
            preferredDate || "",
            preferredTimeSlot || "",
            lastMarks || "",
            targetCourse || "",
            additionalNotes || "",
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Scholarship Registration Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save registration" },
      { status: 500 }
    );
  }
}

