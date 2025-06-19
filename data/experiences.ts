export interface Experience {
  id: string
  role: string
  company: string
  companyLogo?: string
  period: string
  description: string
  achievements?: string[]
  technologies?: string[]
}

export const experiences: Experience[] = [
  {
    id: "ai-engineer-intern",
    role: "Data Science Intern",
    company: "Sparklink",
    companyLogo: "/assets/logos/sparklink_logo.jpg",
    period: "April 2024 - June 2024",
    description:
      "Worked on a client problem that involved analyzing large datasets and building predictive models. " +
        "Lots of data analysis and transformations to clean and prepare the data for modeling." +
        " Built a proof of concept that helped the client's need and pinned down the exact cause of the problem.",
    achievements: [
      "Data analysis and understanding of client’s data problems",
      "Advanced Data cleanup and inferences with context/domain knowledge of the client’s business",
      "Leading meetings with client and data expert to request additional changes to support the data exploration",
      "Data aggregation and advanced techniques to denormalize data for better performance",
      "Built a translation pipeline for translating data from one language to another",
      "Built a sentiment analysis pipeline to understand the client’s customer feedback",
    ],
    technologies: ["Python", "Pandas", "Numpy", "Google Cloud Platform", "MatplotLib"],
  },
  {
    id: "software-engineer-intern",
    role: "Software Engineer Intern",
    company: "Atlas Copco",
    companyLogo: "/assets/logos/atlas_copco_logo.svg",
    period: "Sep 2023 - Oct 2023",
    description:
        "Worked on our team's main project. Designing and restyling UI for more friendly user experience. " +
        "Also worked on the backend to implement new features and fix bugs.",
    achievements: [
      "Fixed Legacy code issues/warnings around the frontend (React) and backend (Django) codebases",
      "Added improvements and new features to improve legacy projects and UI experience",
      "Worked with the testing team to resolve issues with testing pipelines for various features",
      "Reworked a lot of the UI to improve accessibility for different languages and text bugs",
    ],
    technologies: ["Python", "Django", "React", "Redux", "Typescript"],
  },
]

