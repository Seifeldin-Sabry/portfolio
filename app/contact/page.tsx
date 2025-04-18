"use client"

import type React from "react"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Calendar, Clock, Github, Linkedin, Mail, MapPin} from "lucide-react"
import {toast} from "sonner"
import {z} from "zod"
import {SocialButton} from "@/components/social-button"
import {calendlyLink, githubLink, linkedInLink} from "@/lib/links";

// Define the contact form schema with Zod
const contactFormSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters"}),
    email: z.string().email({message: "Please enter a valid email address"}),
    company: z.string().min(1, {message: "Please enter your company name"}),
    role: z.string().min(1, {message: "Please select a role"}),
    projectType: z.string().optional(), // Made project type optional
    message: z.string().min(10, {message: "Message must be at least 10 characters"}),
})

// Type for our form data based on the schema
type ContactFormData = z.infer<typeof contactFormSchema>

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        company: "",
        role: "",
        projectType: "",
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

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({...prev, [name]: value}))

        // Clear the error for this field
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
                    icon: "⚠️",
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
                company: "",
                role: "",
                projectType: "",
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
            <h1 className="text-4xl font-bold mb-8 text-center">Let's Work Together</h1>

            <div className="max-w-3xl mx-auto mb-12">
                <p className="text-center text-lg">Interested in working together? Let me know about your project.</p>
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

                                <div className="flex items-center gap-3">
                                    <Mail className="text-primary" size={20} />
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p className="text-gray-600">your.email@example.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="text-primary" size={20} />
                                    <div>
                                        <h3 className="font-semibold">Availability</h3>
                                        <p className="text-gray-600">Available for projects</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Clock className="text-primary" size={20} />
                                    <div>
                                        <h3 className="font-semibold">Response Time</h3>
                                        <p className="text-gray-600">Within 24 hours</p>
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
                            <h2 className="text-xl font-bold mb-6">Project Inquiry</h2>

                            {submitSuccess && (
                                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6">
                                    Your message has been sent successfully! I'll get back to you within 24 hours.
                                </div>
                            )}

                            {submitError && !isRateLimited && (
                                <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6">{submitError}</div>
                            )}

                            {isRateLimited && (
                                <div className="bg-orange-50 text-orange-800 p-4 rounded-md mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">⚠️</span>
                                        <p>Rate limit reached. You've submitted too many messages recently. Please try
                                           again later.</p>
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
                                    <label htmlFor="company" className="block text-sm font-medium mb-1">
                                        Company
                                    </label>
                                    <Input
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className={errors.company ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium mb-1">
                                            Role Needed
                                        </label>
                                        <Select value={formData.role}
                                                onValueChange={(value) => handleSelectChange("role", value)}
                                        >
                                            <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fullstack">Full-stack Developer</SelectItem>
                                                <SelectItem value="backend">Backend Developer</SelectItem>
                                                <SelectItem value="ai">AI Developer</SelectItem>
                                                <SelectItem value="software">Software Engineer</SelectItem>
                                                <SelectItem value="datascience">Data Scientist</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="projectType" className="block text-sm font-medium mb-1">
                                            Project Type (Optional)
                                        </label>
                                        <Select
                                            value={formData.projectType}
                                            onValueChange={(value) => handleSelectChange("projectType", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select project type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="website">Website</SelectItem>
                                                <SelectItem value="webapp">Web App</SelectItem>
                                                <SelectItem value="ai">AI Project</SelectItem>
                                                <SelectItem value="enterprise">Enterprise Software</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                                        Project Details
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={errors.message ? "border-red-500" : ""}
                                        placeholder="Tell me about your project and how I can help..."
                                        required
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                </div>

                                <Button type="submit" disabled={isSubmitting || isRateLimited} className="w-full">
                                    {isSubmitting ? "Sending..." : isRateLimited ? "Rate Limit Reached" : "Send Message"}
                                </Button>

                                {isRateLimited &&
                                    <p className="text-sm text-center text-orange-600 mt-2">Please try again later</p>}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
