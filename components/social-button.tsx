'use client';

import Link from "next/link";
import {Button} from "@/components/ui/button";
import type React from "react";

export const SocialButton = ({icon, link}) => {
    const handleClick = (e: React.MouseEvent) => {
        // Ensure the link opens on mobile tap
        e.stopPropagation();
    };

    return (
        <Button
            variant="outline"
            size="icon"
            asChild
        >
            <Link
                target="_blank"
                href={link}
                rel="noopener noreferrer"
                onClick={handleClick}
                className="[&_svg]:!size-6"
                style={{
                    WebkitTapHighlightColor: 'transparent',
                    WebkitTouchCallout: 'none',
                    userSelect: 'none',
                    cursor: 'pointer'
                }}
            >
                {icon}
            </Link>
        </Button>
    )
}