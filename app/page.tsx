import ProfileSection from "@/components/profile-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import HomelabSection from "@/components/homelab-section"
import ExperienceSection from "@/components/experience-section"
import BlogSection from "@/components/blog-section"
import {getSortedBlogPosts} from "@/lib/blogs"
import {getEducation, getExperiences, getHomelabServices, getProjects} from "@/lib/content"

export default function Home() {
    const allPosts = getSortedBlogPosts()

    return (
        <div className="flex flex-col min-h-screen">
            <ProfileSection/>
            <SkillsSection/>
            <ProjectsSection projects={getProjects()}/>
            <HomelabSection homelabServices={getHomelabServices()}/>
            <ExperienceSection experiences={getExperiences()} education={getEducation()}/>
            <BlogSection posts={allPosts}/>
        </div>
    )
}
