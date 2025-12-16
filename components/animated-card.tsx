"use client"

import {motion} from "framer-motion"
import type {ReactNode} from "react"

interface AnimatedCardProps {
    children: ReactNode
    className?: string
}

export function AnimatedCard({children, className = ""}: AnimatedCardProps) {
    return (
        <motion.div
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: {duration: 0.3},
            }}
            className={`transform transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    )
}
