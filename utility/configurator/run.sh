#!/usr/bin/env bash
# Stepper Ninja Board Configurator Launcher

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Iniciando o Stepper Ninja Configurator..."
python3 server.py
