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
                scale: 1.03,
                transition: {duration: 0.2},
            }}
            className={`transform transition-all duration-300 ${className}`}
        >
            {children}
        </motion.div>
    )
}
