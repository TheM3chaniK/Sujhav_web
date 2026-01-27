"use server"

import { google } from "googleapis"

export async function sendContactEmail(prevState, formData) {
  try {
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")
    const email = formData.get("email")
    const phone = formData.get("phone")
    const courseInterest = formData.get("courseInterest")
    const message = formData.get("message")

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message) {
      return {
        success: false,
        message: "Please fill in all required fields.",
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Please enter a valid email address.",
      }
    }

    // Google Sheets Auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    // Fallback to scholarship sheet if contact-specific one isn't provided
    const spreadsheetId = process.env.GOOGLE_CONTACT_SHEET_ID || process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      return {
        success: false,
        message: "Server configuration error: Sheet ID missing.",
      }
    }

    // Append data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A1", // Assumes Sheet1. User should customize if using a different tab.
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString(), // Timestamp
            firstName,
            lastName,
            email,
            phone,
            courseInterest || "N/A",
            message,
          ],
        ],
      },
    })

    return {
      success: true,
      message: "Thank you for your message! We will get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact Form Error:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}