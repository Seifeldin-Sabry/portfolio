---
id: "proxmox"
title: "Proxmox VE"
icon: "🖥️"
category: "infrastructure"
technologies:
  - "Proxmox VE"
  - "LXC"
  - "KVM"
  - "ZFS"
  - "Debian"
---
# Proxmox VE

Type-1 hypervisor running on a 16-core / 30 GB RAM host with 4 TB USB HDD storage. Manages LXC containers and VMs across two bridges: vmbr0 (LAN) and vmbr1 (private NAT 10.10.10.0/24).

## Features

- LXC containers for AdGuard, Tailscale, PBS
- VM 100 Docker host for all service stacks
- Dual bridge networking (LAN + private NAT)
- DNS forwarding via iptables to AdGuard
