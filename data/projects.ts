export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github?: string
  liveDemo?: string
  challenges?: string[]
  solutions?: string[]
  features?: string[]
  results?: string[]
}

export const projects: Project[] = [
  {
    id: "airene",
    title: "Air quality Anomaly Detection",
    description:
      "A web application that uses machine learning to detect anomalies in air quality data, providing real-time alerts and visualizations.",
    technologies: ["FastAPI", "Python", "SvelteKit", "Java Spring Boot", "Azure Container Apps", "Azure Functions", "Azure Blob Storage"],
    github: "https://github.com/orgs/Airene-Org/repositories",
    challenges: [
      "Collecting and processing large volumes of air quality data from multiple sources",
      "Implementing real-time anomaly detection algorithms",
      "Creating an intuitive user interface for data visualization",
      "Ensuring scalability and performance of the application",
      "Using messaging queues for data processing",
      "migrating millions of rows of data from one database to another",
    ],
    solutions: [
      "Used Azure Cosmos DB for efficient data storage and retrieval",
        "Implemented machine learning algorithms for anomaly detection using Python",
        "Developed a user-friendly dashboard using SvelteKit for data visualization",
        "Utilized Azure Functions for serverless computing to handle data processing",
        "Used message brokers to transfer data between different components of the application",
        "implemented an ETL script that connects two Azure components and allows them to communicate with almost no cost"
    ],
    features: [
      "Real-time air quality monitoring",
      "Anomaly detection with alerts",
      "Data visualization dashboard",
      "Subscription-based notifications"
    ],
    results: [
      "Users receive anomaly notifications from locations of interest (within a radius they define)",
      "Hourly data collection from multiple sources",
      "Smooth user experience with a responsive web application",
    ],
  },
  {
    id: "whatsapp-clone",
    title: "WhatsApp Clone",
    description:
      "A full-stack web application that replicates the core features of WhatsApp, including real-time messaging, and user authentication. Made with the goal to practice Google cloud networking and security.",
    technologies: ["VueJs", "Node.js", "Express", "Postgres", "Google Cloud Platform"],
    github: "https://github.com/Seifeldin-Sabry/chatapp-infra",
    challenges: [
      "Implementing secure user authentication and authorization",
      "Ensuring real-time messaging functionality",
      "Google cloud networking and security",
    ],
    solutions: [
      "Used JWT for secure user authentication and authorization",
      "Implemented WebSocket for real-time messaging",
      "Utilized Google Cloud services for hosting and security using VPC, IAM, and Cloud SQL",
    ],
    features: [
      "User authentication and profile management",
      "Websocket for real-time messaging",
    ],
  },
  {
    id: "real-estate-scraper",
    title: "Real Estate Scraper",
    description: "A web scraper that collects real estate listings from multiple websites, providing a unified interface for searching and filtering properties.",
    technologies: ["Python", "Selenium", "SQLAlchemy", "FastAPI"],
    github: "https://github.com/Seifeldin-Sabry/real-estate-scraper",
    challenges: [
      "Handling dynamic content loading and pagination",
      "Handling various image formats and sizes",
    ],
    solutions: [
        "Implemented headless browsing with Selenium to navigate dynamic pages",
        "Used SQLAlchemy for efficient database interactions and data storage",
        "Implemented caching for frequently accessed data to reduce load times",
        "Deleting outdated properties from the database to maintain data integrity",
    ],
    features: [
        "Real-time data scraping and updates",
        "Advanced search and filtering options",
        "User authentication and profile management: TBD",
        "Email notifications for new listings: TBD",
        "UI for customising scraping parameters: TBD",
    ],
    results: [
      "A telegram bot that notifies users of new listings",
    ],
  },
  {
    id: "Application-Tracking-Dashboard",
    title: "Application Tracking Dashboard",
    description: "A simple UI to manage employment/educational applications",
    technologies: ["Nextjs", "Supabase"],
    github: "https://github.com/Seifeldin-Sabry/Application-Tracking-Dashboard",
    liveDemo: "https://application-tracking-dashboard.vercel.app",
    challenges: [
      "Mobile UI/UX",
      "Filtering degrees/applications",
    ],
    solutions: [
      "Mobile hook to detect mobile devices",
      "Data tables for interactive and strongly typed data formatting of applications"
    ],
    features: [
      "Track statuses",
      "Authentication: manage your own applications",
      "Filters: by statuses and other criteria"
    ],
  },
  {
    id: "qwirkle",
    title: "Qwirkle",
    description: "A JavaFX-based implementation of the Qwirkle board game, featuring a user-friendly interface and a rule based AI opponent.",
    technologies: ["Java", "PostgreSQL"],
    github: "https://github.com/Seifeldin-Sabry/Connect-4/tree/main",
    liveDemo: "https://connect-4-lovat.vercel.app/",
    challenges: [
      "Persisting game state across sessions",
    ],
    solutions: [
      "Implemented a PostgreSQL database to store game states and user profiles",
    ],
    features: [
      "Save and Load Progress",
      "Leaderboard and user profiles",
    ],
  },
  {
    id: "connect-four",
    title: "Connect Four",
    description: "A CLI-based Connect Four game with a simple AI opponent.",
    technologies: ["Java", "PostgreSQL"],
    github: "https://github.com/Seifeldin-Sabry/Connect-4/tree/main",
    liveDemo: "https://connect-4-lovat.vercel.app/",
    challenges: [
      "Persisting game state across sessions",
    ],
    solutions: [
      "Implemented a PostgreSQL database to store game states and user profiles",
    ],
    features: [
      "Save and Load Progress",
      "Leaderboard and user profiles",
    ],
  },
]

