export interface Education {
    id: string
    school: string
    logo: string
    degree: string
    field: string
    start: string
    end: string
    info: string
    courseWork: string[]
}

export const education: Education[] = [
    {
        id: "bachelor",
        school: "Karel de Grote Hogeschool",
        logo: "/assets/logos/kdg_logo.png",
        degree: "Bachelor of Applied Computer Science",
        field: "Computer Science and AI",
        start: "September 2021",
        end: "June 2024",
        info: "Specialized in Artificial Intelligence and Machine Learning. Graduated with honors. (magna-cum-laude)",
        courseWork: [
            "Data Structures and Algorithms",
            "Machine Learning",
            "Deep Learning",
            "Natural Language Processing",
            "Computer Vision",
            "Software Engineering",
            "Databases",
            "Web Development",
        ],
    }
]