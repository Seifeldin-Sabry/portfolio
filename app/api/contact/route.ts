// app/api/send-email/route.ts
import {NextResponse} from "next/server"
import {z} from "zod"
import nodemailer from "nodemailer"
import {redis} from "@/lib/redis";

// Define the contact form schema (same as client-side)
const contactFormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(3),
    message: z.string().min(10),
})

const RATE_LIMIT_MAX = 1 // Maximum number of requests
const RATE_LIMIT_WINDOW = 86400

export async function POST(request: Request) {
    try {
        const ip = request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown-ip"

        console.log("IP Address:", ip)

        // Check rate limit
        const rateLimitKey = `rate-limit:contact:${ip}`
        const currentRequests = await redis.get(rateLimitKey) as number || 0

        if (currentRequests >= RATE_LIMIT_MAX) {
            return NextResponse.json(
                {success: false, message: "Too many requests. Please try again later."},
                {status: 429}
            )
        }

        console.log("Current Requests:", currentRequests)

        // Increment request count
        if (currentRequests === 0) {
            // Set initial value with expiration
            await redis.set(rateLimitKey, 1, {ex: RATE_LIMIT_WINDOW})
        } else {
            // Increment existing value
            await redis.incr(rateLimitKey)
        }


        // Parse and validate request body
        const body = await request.json()

        console.log("Request Body:", body)

        const {name, email, subject, message} = contactFormSchema.parse(body)

        // Create Nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        })

        console.log("Transporter Config:", {
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: process.env.EMAIL_SERVER_SECURE === "true" && process.env.ENVIRONMENT === "production",
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        })

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_TO,
            replyTo: email,
            subject: `Contact Form: ${subject}`,
            text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
        }

        console.log("Mail Options:", mailOptions)

        await transporter.sendMail(mailOptions)

        return NextResponse.json({success: true, message: "Email sent successfully"}, {status: 200})
    } catch (error) {
        console.error("Error sending email:", error)

        if (error instanceof z.ZodError) {
            return NextResponse.json({
                success: false,
                message: "Invalid form data",
                errors: error.errors
            }, {status: 400})
        }

        return NextResponse.json({success: false, message: "Failed to send email"}, {status: 500})
    }
}