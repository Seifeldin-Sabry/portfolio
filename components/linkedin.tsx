import Link from "next/link";
import {Linkedin} from "lucide-react";
import {Button} from "@/components/ui/button";
import type React from "react";

export const LinkedinButton = ({size}) => {
    return (
        <Button variant="outline" size="icon" asChild>
            <Link href="https://github.com/Seifeldin-Sabry">
                <Linkedin size={size} />
            </Link>
        </Button>
    )
}