import Link from "next/link";
import {Github} from "lucide-react";
import {Button} from "@/components/ui/button";
import type React from "react";

export const GithubButton = ({size}) => {
    return (
        <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com/Seifeldin-Sabry">
                <Github size={size} />
            </Link>
        </Button>
    )
}