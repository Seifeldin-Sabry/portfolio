import Desktop from "@/components/desktop/desktop"
import {getDesktopContent} from "@/lib/desktop-content"

export default function Home() {
    return <Desktop {...getDesktopContent()}/>
}
