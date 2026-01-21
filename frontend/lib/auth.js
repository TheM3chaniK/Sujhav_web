import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function verifyAuth(request) {
  try {
    // Try to get token from cookie first
    const cookieStore = await cookies()
    let token = cookieStore.get("auth-token")?.value

    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      console.log("No token found")
      return null
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "ba177938")
    console.log(decoded)
    if (!decoded || !decoded.userId) {
      console.log("Invalid token")
      return null
    }

    // Normalize token payload shape: always return an object with `id` representing the user id
    // Some routes previously expected `userId`—we return { id, ...rest } for consistency.
    const { userId, ...rest } = decoded
    return { id: userId, ...rest }
  } catch (error) {
    console.error("Auth verification error:", error)
    return null
  }
}