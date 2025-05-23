"use client"

import type React from "react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent} from "@/components/ui/card"
import {Calendar, Github, Linkedin, MapPin} from "lucide-react"
import {toast} from "sonner"
import {z} from "zod"
import {SocialButton} from "@/components/social-button";
import {calendlyLink, githubLink, linkedInLink} from "@/lib/links";

// Define the contact form schema with Zod
const contactFormSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters"}),
    email: z.string().email({message: "Please enter a valid email address"}),
    subject: z.string().min(3, {message: "Subject must be at least 3 characters"}),
    message: z.string().min(10, {message: "Message must be at least 10 characters"}),
})

// Type for our form data based on the schema
type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [submitError, setSubmitError] = useState("")
    const [isRateLimited, setIsRateLimited] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({...prev, [name]: value}))

        // Clear the error for this field when user starts typing again
        if (errors[name as keyof ContactFormData]) {
            setErrors((prev) => ({...prev, [name]: ""}))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError("")
        setErrors({})
        setIsRateLimited(false)

        try {
            // Validate form data against schema
            const validatedData = contactFormSchema.parse(formData)

            // Send email using the API route
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(validatedData),
            })

            const result = await response.json()

            // Check for rate limiting (HTTP 429)
            if (response.status === 429) {
                setIsRateLimited(true)
                toast.error("⏱️ Rate limit reached. Please try again later.", {
                    duration: 6000,
                    style: {backgroundColor: "#FFEDD5", color: "#9A3412"},
                    icon: "⚠️"
                })
                throw new Error("Rate limit reached. Please try again later.")
            }

            if (!response.ok) {
                throw new Error(result.message || "Failed to send email")
            }

            // Reset form on success
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            })

            toast.success("Your message has been sent successfully!")
            setSubmitSuccess(true)
            setTimeout(() => setSubmitSuccess(false), 5000)
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                const fieldErrors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    const path = err.path[0] as keyof ContactFormData
                    fieldErrors[path] = err.message
                })
                setErrors(fieldErrors)
                toast.error("Please fix the errors in the form")
            } else if (!isRateLimited) {
                // Handle server/API errors (except rate limit which is handled above)
                const errorMessage = error instanceof Error ? error.message : "There was an error sending your message"
                setSubmitError(errorMessage)
                toast.error(errorMessage)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Contact Me</h1>

            <div className="max-w-3xl mx-auto mb-12">
                <p className="text-center text-lg">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                    vision.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="md:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-6">Contact Information</h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="text-primary" size={20} />
                                    <div>
                                        <h3 className="font-semibold">Location</h3>
                                        <p className="text-gray-600">Antwerp, Belgium</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="font-semibold mb-4">Connect with me</h3>
                                <div className="flex gap-4">
                                    <SocialButton icon={<Github size={20} />} link={githubLink} />
                                    <SocialButton icon={<Linkedin size={20} />} link={linkedInLink} />
                                    <SocialButton icon={<Calendar size={20} />} link={calendlyLink} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold mb-6">Send Me a Message</h2>

                            {submitSuccess && (
                                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
                                    Your message has been sent successfully! I'll get back to you soon.
                                </div>
                            )}

                            {submitError && !isRateLimited && (
                                <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">{submitError}</div>
                            )}

                            {isRateLimited && (
                                <div className="bg-orange-50 text-orange-800 p-4 rounded-md mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">⚠️</span>
                                        <p>
                                            Rate limit reached. You've submitted too many messages recently.
                                            Please try again later.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                                            Name
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={errors.name ? "border-red-500" : ""}
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={errors.email ? "border-red-500" : ""}
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="subject" className="block text-sm font-medium mb-1">
                                        Subject
                                    </label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={errors.subject ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={errors.message ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isRateLimited}
                                    className="w-full"
                                >
                                    {isSubmitting ? "Sending..." : isRateLimited ? "Rate Limit Reached" : "Send Message"}
                                </Button>

                                {isRateLimited && (
                                    <p className="text-sm text-center text-orange-600 mt-2">
                                        Please try again later
                                    </p>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}