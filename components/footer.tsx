import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="https://github.com" className="text-gray-600 hover:text-gray-900">
              <Github size={20} />
            </Link>
            <Link href="https://linkedin.com" className="text-gray-600 hover:text-gray-900">
              <Linkedin size={20} />
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              <Mail size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

