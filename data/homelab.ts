export interface HomelabService {
    id: string
    title: string
    description: string
    icon: string
    technologies: string[]
    features: string[]
    category: "infrastructure" | "media" | "security" | "backup"
}

export const homelabServices: HomelabService[] = [
    {
        id: "proxmox",
        title: "Proxmox VE",
        description:
            "Type-1 hypervisor running on a 16-core / 30 GB RAM host with 4 TB USB HDD storage. Manages LXC containers and VMs across two bridges: vmbr0 (LAN) and vmbr1 (private NAT 10.10.10.0/24).",
        icon: "🖥️",
        technologies: ["Proxmox VE", "LXC", "KVM", "ZFS", "Debian"],
        features: [
            "LXC containers for AdGuard, Tailscale, PBS",
            "VM 100 Docker host for all service stacks",
            "Dual bridge networking (LAN + private NAT)",
            "DNS forwarding via iptables to AdGuard",
        ],
        category: "infrastructure",
    },
    {
        id: "caddy-crowdsec",
        title: "Caddy + CrowdSec",
        description:
            "Reverse proxy with automatic TLS via Cloudflare DNS challenge, paired with CrowdSec WAF for collaborative threat intelligence and DDoS protection.",
        icon: "🔒",
        technologies: ["Caddy", "CrowdSec", "Cloudflare", "Let's Encrypt"],
        features: [
            "Auto TLS with Cloudflare DNS-01 challenge",
            "CrowdSec WAF with community blocklists",
            "Rate limiting and DDoS protection",
            "Wildcard certificates for all subdomains",
        ],
        category: "security",
    },
    {
        id: "adguard",
        title: "AdGuard Home",
        description:
            "Network-wide DNS filtering with a primary + replica setup running in dedicated LXC containers. All DNS traffic is forwarded via iptables rules.",
        icon: "🛡️",
        technologies: ["AdGuard Home", "DNS", "LXC", "iptables"],
        features: [
            "Primary (CT 101) + Replica (CT 103) for redundancy",
            "Network-wide ad and tracker blocking",
            "DNS-over-HTTPS upstream resolvers",
            "iptables DNAT rules for forced DNS redirection",
        ],
        category: "security",
    },
    {
        id: "jellyfin",
        title: "Jellyfin & Jellyseerr",
        description:
            "Self-hosted media streaming server for personal library with a request portal for managing new content additions.",
        icon: "🎬",
        technologies: ["Jellyfin", "Jellyseerr", "Docker", "FFmpeg"],
        features: [
            "Hardware-accelerated transcoding",
            "Multi-user streaming with profiles",
            "Jellyseerr request portal for content management",
            "Organized media library with metadata scraping",
        ],
        category: "media",
    },
    {
        id: "vpn-gateway",
        title: "WireGuard VPN Gateway",
        description:
            "VPN tunneling via Gluetun container for secure outbound traffic, combined with Tailscale (CT 102) for remote access to the entire homelab.",
        icon: "🌐",
        technologies: ["WireGuard", "Gluetun", "Tailscale", "LXC"],
        features: [
            "Gluetun container for VPN-tunneled services",
            "Tailscale mesh VPN for remote homelab access",
            "Kill switch preventing traffic leaks",
            "Split tunneling for selective routing",
        ],
        category: "security",
    },
    {
        id: "backups",
        title: "Automated Backups",
        description:
            "Dual backup strategy: Borgmatic for Docker configs (daily 3 AM) and vzdump to Proxmox Backup Server (daily 2 AM) for VMs and containers.",
        icon: "💾",
        technologies: ["Borgmatic", "BorgBackup", "PBS", "vzdump"],
        features: [
            "Borgmatic: daily 3 AM, Docker configs + volumes",
            "vzdump: daily 2 AM, full VM/CT snapshots to PBS (CT 104)",
            "3-2-1 strategy: local + PBS + offsite",
            "Configurable retention policies",
        ],
        category: "backup",
    },
    {
        id: "uptime-kuma",
        title: "Uptime Kuma",
        description:
            "Self-hosted monitoring dashboard tracking all services with health checks, response time graphs, and instant Telegram alerts on downtime.",
        icon: "📊",
        technologies: ["Uptime Kuma", "Docker", "Telegram API"],
        features: [
            "HTTP/TCP/Ping health checks for all services",
            "Telegram instant alerts on downtime",
            "Public status page for transparency",
            "Response time graphs and uptime history",
        ],
        category: "infrastructure",
    },
]

export const categoryColors: Record<HomelabService["category"], string> = {
    infrastructure: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    media: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    security: "bg-green-500/10 text-green-400 border-green-500/20",
    backup: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}
