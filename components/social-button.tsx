import Link from "next/link";
import {Button} from "@/components/ui/button";
import type React from "react";

export const SocialButton = ({icon, link}) => {
    return (
        <Button variant="outline" size="icon" asChild>
            <Link target="_blank" href={link}>
                {icon}
            </Link>
        </Button>
    )
}