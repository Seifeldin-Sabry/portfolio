import {ImageResponse} from "next/og"

export const OG_SIZE = {width: 1200, height: 630}

/** Share card in the site's warm-graphite style. Rendered at build time (static export). */
export function ogCard({eyebrow, title, description}: {eyebrow: string; title: string; description: string}) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px 80px",
                    background: "radial-gradient(ellipse 80% 70% at 15% 10%, #4a3220 0%, #1a1613 55%, #120f0d 100%)",
                    color: "#f1ebe3",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{display: "flex", alignItems: "center", gap: 16}}>
                    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                        <div key={c} style={{width: 22, height: 22, borderRadius: 11, background: c}}/>
                    ))}
                    <div style={{marginLeft: 20, fontSize: 28, color: "#e8a35c", letterSpacing: 2, textTransform: "uppercase"}}>{eyebrow}</div>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: 24}}>
                    <div style={{fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2}}>{title}</div>
                    <div style={{fontSize: 34, lineHeight: 1.35, color: "#b9ada0", maxWidth: 980}}>{description}</div>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", fontSize: 28, color: "#b9ada0"}}>
                    <div>Seifeldin Sabry · Software Engineer & Founder</div>
                    <div style={{color: "#f1ebe3"}}>seif-dx.com</div>
                </div>
            </div>
        ),
        OG_SIZE,
    )
}
