#!/usr/bin/env bash
# Primera instalación en el Droplet (alias de restart-artifacts).
exec "$(dirname "$0")/restart-artifacts.sh" "$@"
