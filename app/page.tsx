import ProfileSection from "@/components/profile-section"
import ProjectsSection from "@/components/projects-section"
import ExperienceSection from "@/components/experience-section"
import BlogSection from "@/components/blog-section"
import {getSortedBlogPosts} from "@/lib/blogs"

export default function Home() {
    const allPosts = getSortedBlogPosts()

    return (
        <div className="flex flex-col min-h-screen">
            <ProfileSection/>
            
            <div className="max-w-4xl mx-auto w-full px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            <ProjectsSection/>
            
            <div className="max-w-4xl mx-auto w-full px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            <ExperienceSection/>
            
            <div className="max-w-4xl mx-auto w-full px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            <BlogSection posts={allPosts}/>
        </div>
    )
}
