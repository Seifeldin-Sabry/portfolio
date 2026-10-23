import type {ContentProps} from "@/components/apps/registry"
import {getSortedBlogPosts} from "@/lib/blogs"
import {getEducation, getExperiences, getProjects} from "@/lib/content"

/** Everything the desktop renders, loaded at build time from the markdown content. */
export function getDesktopContent(): ContentProps {
    return {
        projects: getProjects(),
        experiences: getExperiences(),
        education: getEducation(),
        posts: getSortedBlogPosts(),
    }
}
