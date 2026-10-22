import Desktop from "@/components/desktop/desktop"
import {getSortedBlogPosts} from "@/lib/blogs"
import {getEducation, getExperiences, getHomelabServices, getProjects} from "@/lib/content"

export default function Home() {
    return (
        <Desktop
            projects={getProjects()}
            homelabServices={getHomelabServices()}
            experiences={getExperiences()}
            education={getEducation()}
            posts={getSortedBlogPosts()}
        />
    )
}
