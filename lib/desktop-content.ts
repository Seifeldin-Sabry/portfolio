import type {ContentProps} from "@/components/apps/registry"
import {getSortedBlogPosts} from "@/lib/blogs"
import {getCaseStudies, getEducation, getExperiences, getProjects, getServices} from "@/lib/content"

/** Everything the desktop renders, loaded at build time from the markdown content. */
export function getDesktopContent(): ContentProps {
    return {
        projects: getProjects(),
        experiences: getExperiences(),
        education: getEducation(),
        posts: getSortedBlogPosts(),
        services: getServices(),
        caseStudies: getCaseStudies(),
    }
}
