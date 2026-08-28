---
id: "vpn-gateway"
title: "WireGuard VPN Gateway"
icon: "🌐"
category: "security"
technologies:
  - "WireGuard"
  - "Gluetun"
  - "Tailscale"
  - "LXC"
---
# WireGuard VPN Gateway

VPN tunneling via Gluetun container for secure outbound traffic, combined with Tailscale (CT 102) for remote access to the entire homelab.

## Features

- Gluetun container for VPN-tunneled services
- Tailscale mesh VPN for remote homelab access
- Kill switch preventing traffic leaks
- Split tunneling for selective routing
