import Link from "next/link";
import {Linkedin} from "lucide-react";
import {Button} from "@/components/ui/button";
import type React from "react";

export const LinkedinButton = ({size}) => {
    return (
        <Button variant="outline" size="icon" asChild>
            <Link target="_blank" href="https://www.linkedin.com/in/seifeldin-sabry-b8a542202/">
                <Linkedin size={size} />
            </Link>
        </Button>
    )
}