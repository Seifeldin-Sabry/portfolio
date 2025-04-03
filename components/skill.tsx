import {Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {Skill} from "@/data/skills";

export function Skill(props: { skill: Skill }) {
    return <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-6 flex flex-col items-center">
            <div className="w-16 h-16 mb-4 relative">
                <Image
                    src={props.skill.icon || "/placeholder.svg?height=64&width=64"}
                    alt={props.skill.name}
                    fill
                    className={cn("object-contain", props.skill.whiteBg ? "bg-white" : "bg-transparent")}
                />
            </div>
            <h3 className="font-semibold text-lg text-center">{props.skill.name}</h3>
        </CardContent>
    </Card>;
}