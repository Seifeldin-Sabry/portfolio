"use client"

import CaseStudiesApp from "@/components/apps/case-studies-app"
import ExperienceApp from "@/components/apps/experience-app"
import ProjectsApp from "@/components/apps/projects-app"
import Tabs from "@/components/apps/tabs"
import type {ContentProps} from "@/components/apps/registry"

const TABS = [
    {id: "experience", label: "Experience"},
    {id: "cases", label: "Case studies"},
    {id: "projects", label: "Projects"},
] as const

/** Everything about Seif's work in one window: where, what he shipped, and outcomes. */
export default function WorkApp({content}: {content: ContentProps}) {
    return (
        <Tabs tabs={[...TABS]}>
            {(tab) =>
                tab === "experience" ? (
                    <ExperienceApp experiences={content.experiences} education={content.education}/>
                ) : tab === "cases" ? (
                    <CaseStudiesApp caseStudies={content.caseStudies}/>
                ) : (
                    <ProjectsApp projects={content.projects}/>
                )
            }
        </Tabs>
    )
}
