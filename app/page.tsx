import Desktop from "@/components/desktop/desktop"
import {getSortedBlogPosts} from "@/lib/blogs"
import {getEducation, getExperiences, getProjects} from "@/lib/content"

export default function Home() {
    return (
        <Desktop
            projects={getProjects()}
            experiences={getExperiences()}
            education={getEducation()}
            posts={getSortedBlogPosts()}
        />
    )
}
