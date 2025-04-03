export interface Project {
  id: string
  title: string
  description: string
  image?: string
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
    id: "ai-chatbot",
    title: "AI-Powered Chatbot",
    description:
      "A conversational AI chatbot built with Next.js and OpenAI that provides intelligent responses to user queries.",
    image: "/placeholder.svg?height=384&width=768",
    technologies: ["Next.js", "TypeScript", "OpenAI API", "Tailwind CSS", "Vercel AI SDK"],
    github: "https://github.com/yourusername/ai-chatbot",
    liveDemo: "https://ai-chatbot-demo.vercel.app",
    challenges: [
      "Implementing efficient token management to optimize API costs",
      "Creating a responsive and intuitive chat interface",
      "Handling complex conversation contexts and history",
    ],
    solutions: [
      "Developed a streaming response system to improve user experience",
      "Implemented context windowing to maintain conversation history within token limits",
      "Created a flexible prompt template system for different conversation scenarios",
    ],
    features: [
      "Real-time streaming responses",
      "Conversation history management",
      "Customizable AI personality",
      "Mobile-responsive design",
    ],
    results: [
      "Reduced response time by 40% compared to traditional implementations",
      "Achieved 95% user satisfaction rating in testing",
      "Successfully handled complex multi-turn conversations",
    ],
  },
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with product management, cart functionality, and secure checkout.",
    image: "/placeholder.svg?height=384&width=768",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe API", "Redux"],
    github: "https://github.com/yourusername/ecommerce-platform",
    liveDemo: "https://ecommerce-demo.vercel.app",
    challenges: [
      "Building a secure payment processing system",
      "Implementing efficient product search and filtering",
      "Creating a responsive design for all device sizes",
    ],
    solutions: [
      "Integrated Stripe API with custom webhook handling for secure payments",
      "Implemented MongoDB text indexes and aggregation pipeline for fast searches",
      "Used CSS Grid and Flexbox for a fully responsive layout",
    ],
    features: [
      "User authentication and profile management",
      "Product search with filters and sorting",
      "Shopping cart and wishlist functionality",
      "Secure checkout with Stripe",
      "Order history and tracking",
    ],
    results: [
      "Processed over 1,000 test transactions with 100% success rate",
      "Achieved 99.9% uptime during load testing",
      "Reduced page load time by 30% through optimization",
    ],
  },
  {
    id: "image-recognition",
    title: "Image Recognition App",
    description: "A web application that uses machine learning to identify objects and scenes in uploaded images.",
    image: "/placeholder.svg?height=384&width=768",
    technologies: ["React", "TensorFlow.js", "Next.js", "Tailwind CSS"],
    github: "https://github.com/yourusername/image-recognition",
    liveDemo: "https://image-recognition-demo.vercel.app",
    challenges: [
      "Optimizing model size for browser-based inference",
      "Handling various image formats and sizes",
      "Creating an intuitive user interface for results",
    ],
    solutions: [
      "Used TensorFlow.js model optimization techniques to reduce model size",
      "Implemented client-side image processing for format standardization",
      "Designed a visual results display with confidence scores and highlighting",
    ],
    features: [
      "Real-time object detection",
      "Support for multiple image formats",
      "Detailed classification results with confidence scores",
      "Offline functionality with model caching",
    ],
    results: [
      "Achieved 90% accuracy on common object recognition",
      "Reduced model load time by 60% through optimization",
      "Successfully processed images up to 12MP in size",
    ],
  },
  {
    id: "dashboard-analytics",
    title: "Dashboard & Analytics Platform",
    description: "A comprehensive analytics dashboard for businesses to track performance metrics and visualize data.",
    image: "/placeholder.svg?height=384&width=768",
    technologies: ["React", "D3.js", "Node.js", "PostgreSQL", "GraphQL"],
    github: "https://github.com/yourusername/dashboard-analytics",
    liveDemo: "https://dashboard-analytics-demo.vercel.app",
    challenges: [
      "Creating interactive and responsive data visualizations",
      "Handling large datasets efficiently",
      "Implementing real-time data updates",
    ],
    solutions: [
      "Used D3.js with React for optimized SVG-based visualizations",
      "Implemented data aggregation and pagination for large datasets",
      "Created a WebSocket system for real-time metric updates",
    ],
    features: [
      "Customizable dashboard layouts",
      "Interactive charts and graphs",
      "Data export in multiple formats",
      "User role management and permissions",
      "Automated reporting and alerts",
    ],
    results: [
      "Reduced data analysis time by 50% for test users",
      "Successfully visualized datasets with over 100,000 records",
      "Maintained sub-second response times for most operations",
    ],
  },
]

