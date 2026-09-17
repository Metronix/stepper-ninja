#!/usr/bin/env bash
set -e
echo "=========================================================="
echo " Instalador do Driver Stepper Ninja para LinuxCNC"
echo "=========================================================="
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="/usr/lib/linuxcnc/modules"

if [ ! -d "$DEST_DIR" ]; then
    echo "Erro: Diretório $DEST_DIR não encontrado!"
    echo "Certifique-se de que o LinuxCNC está instalado neste computador."
    exit 1
fi

echo "Copiando módulos para $DEST_DIR..."
if [ -f "$SCRIPT_DIR/stepgen-ninja.so" ]; then
    sudo cp -v "$SCRIPT_DIR/stepgen-ninja.so" "$DEST_DIR/"
fi
if [ -f "$SCRIPT_DIR/stepper-ninja.so" ]; then
    sudo cp -v "$SCRIPT_DIR/stepper-ninja.so" "$DEST_DIR/"
fi

echo ""
echo "Driver instalado com sucesso no LinuxCNC!"
echo "=========================================================="
