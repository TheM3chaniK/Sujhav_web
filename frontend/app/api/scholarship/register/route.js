import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
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

        // Validate essential fields
        if (!studentName || !phone || !email || !currentClass) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Google Sheets Auth
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // Append data
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A1', // Assumes data starts at A1 in Sheet1. Column headers should be pre-set.
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    [
                        new Date().toLocaleString(), // Timestamp
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
                    ],
                ],
            },
        });

        return NextResponse.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Scholarship Registration Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save registration', error: error.message },
            { status: 500 }
        );
    }
}
