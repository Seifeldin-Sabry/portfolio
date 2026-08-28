---
id: "adguard"
title: "AdGuard Home"
icon: "🛡️"
category: "security"
technologies:
  - "AdGuard Home"
  - "DNS"
  - "LXC"
  - "iptables"
---
# AdGuard Home

Network-wide DNS filtering with a primary + replica setup running in dedicated LXC containers. All DNS traffic is forwarded via iptables rules.

## Features

- Primary (CT 101) + Replica (CT 103) for redundancy
- Network-wide ad and tracker blocking
- DNS-over-HTTPS upstream resolvers
- iptables DNAT rules for forced DNS redirection
