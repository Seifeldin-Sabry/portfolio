---
id: "backups"
title: "Automated Backups"
icon: "💾"
category: "backup"
technologies:
  - "Borgmatic"
  - "BorgBackup"
  - "PBS"
  - "vzdump"
---
# Automated Backups

Dual backup strategy: Borgmatic for Docker configs (daily 3 AM) and vzdump to Proxmox Backup Server (daily 2 AM) for VMs and containers.

## Features

- Borgmatic: daily 3 AM, Docker configs + volumes
- vzdump: daily 2 AM, full VM/CT snapshots to PBS (CT 104)
- 3-2-1 strategy: local + PBS + offsite
- Configurable retention policies
