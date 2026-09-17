#!/usr/bin/env bash
# ==============================================================================
# Stepper Ninja - Script de Teste Interativo no halrun (LinuxCNC)
# ==============================================================================

# Cores para o terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# IP padrão
DEFAULT_IP="192.168.69.160:8888"
TARGET_IP="${1:-$DEFAULT_IP}"
IP_ONLY="${TARGET_IP%%:*}"

# Função de limpeza ao sair
cleanup() {
    echo -e "\n${YELLOW}[*] Finalizando sessão HAL...${NC}"
    halrun -U 2>/dev/null || true
    rm -f /tmp/stepper_ninja_test.hal
    echo -e "${GREEN}[OK] Sessão encerrada com sucesso.${NC}"
}
trap cleanup EXIT INT TERM

clear 2>/dev/null || true
echo -e "${CYAN}${BOLD}==============================================================${NC}"
echo -e "${CYAN}${BOLD}       STEPPER NINJA - TESTE DE COMUNICAÇÃO NO HALRUN         ${NC}"
echo -e "${CYAN}${BOLD}==============================================================${NC}"
echo -e " Alvo: ${BOLD}${TARGET_IP}${NC} (IP: ${IP_ONLY})"
echo ""

# 1. Teste de ping na placa
echo -ne "${YELLOW}[*] Testando conectividade ICMP (ping ${IP_ONLY})... ${NC}"
if ping -c 1 -W 1 "$IP_ONLY" >/dev/null 2>&1; then
    echo -e "${GREEN}${BOLD}[OK] Placa encontrada e respondendo!${NC}"
else
    echo -e "${RED}${BOLD}[FALHA]${NC}"
    echo -e "${YELLOW}[!] Aviso: A placa no IP ${IP_ONLY} não respondeu ao ping.${NC}"
    echo -e "    Verifique o cabo de rede, a alimentação e se a sub-rede do PC corresponde."
    echo ""
    read -rp "Deseja continuar mesmo assim? [s/N]: " resp
    if [[ ! "$resp" =~ ^[sS]$ ]]; then
        exit 1
    fi
fi

# 2. Garante que qualquer instância anterior do HAL seja descarregada
echo -e "${YELLOW}[*] Liberando recursos do LinuxCNC HAL...${NC}"
halrun -U 2>/dev/null || true
sleep 0.5

# 3. Gera o arquivo HAL de inicialização
HAL_FILE="/tmp/stepper_ninja_test.hal"
cat <<EOF > "$HAL_FILE"
# Configuração de teste Stepper Ninja
loadrt threads name1=servo-thread period1=2000000
loadrt stepgen-ninja ip_address="${TARGET_IP}"
addf stepgen-ninja.0.watchdog-process servo-thread
addf stepgen-ninja.0.process-send     servo-thread
addf stepgen-ninja.0.process-recv     servo-thread
start
EOF

# Menu de opções
echo ""
echo -e "${BOLD}Escolha o modo de teste desejado:${NC}"
echo -e "  ${CYAN}1)${NC} ${BOLD}Teste Automático de Relés / Saídas${NC} (Alterna arc-enable e aux-out)"
echo -e "  ${CYAN}2)${NC} ${BOLD}Prompt Interativo do halcmd${NC} (Você digita os comandos setp/show)"
echo -e "  ${CYAN}3)${NC} ${BOLD}Monitor de Entradas em Tempo Real${NC} (arc-ok, probe, estop, etc.)"
echo -e "  ${CYAN}4)${NC} ${BOLD}Abrir com Halmeter Gráfico${NC} (Monitor visual de pinos)"
echo -e "  ${CYAN}5)${NC} Sair"
echo ""
read -rp "Digite a opção [1-5] (padrão: 1): " OPCAO
OPCAO="${OPCAO:-1}"

case "$OPCAO" in
    1)
        echo ""
        echo -e "${CYAN}${BOLD}=== TESTE AUTOMÁTICO DE SAÍDAS (RELÉS) ===${NC}"
        echo -e "Iniciando HAL com o driver da placa..."
        
        # Inicia o halrun em background alimentado com pipe aberto
        coproc HAL_PROC { halrun -I -f "$HAL_FILE"; }
        sleep 1

        echo -e "${GREEN}[OK] HAL iniciado e threads em execução!${NC}"
        echo ""
        
        # Verifica conexão
        CONN=$(halcmd getp stepgen-ninja.0.connected 2>/dev/null || echo "FALSE")
        echo -e "Status da Conexão: ${BOLD}$CONN${NC}"
        echo ""
        echo -e "${YELLOW}Iniciando ciclo de teste dos relés (Pressione Ctrl+C para encerrar):${NC}"
        echo ""

        for i in {1..3}; do
            echo -e "${BOLD}--- Ciclo $i/3 ---${NC}"
            
            # Liga arc-enable
            echo -e "  [>] Ligando: ${GREEN}arc-enable (Relé 1)${NC} ..."
            halcmd setp stepgen-ninja.0.arc-enable 1
            sleep 1.5
            
            # Desliga arc-enable
            echo -e "  [<] Desligando: ${YELLOW}arc-enable${NC} ..."
            halcmd setp stepgen-ninja.0.arc-enable 0
            sleep 0.8
            
            # Liga aux-out
            echo -e "  [>] Ligando: ${GREEN}aux-out (Relé 2)${NC} ..."
            halcmd setp stepgen-ninja.0.aux-out 1
            sleep 1.5
            
            # Desliga aux-out
            echo -e "  [<] Desligando: ${YELLOW}aux-out${NC} ..."
            halcmd setp stepgen-ninja.0.aux-out 0
            sleep 0.8

            CONN=$(halcmd getp stepgen-ninja.0.connected 2>/dev/null || echo "FALSE")
            echo -e "  Status da Conexão: ${BOLD}$CONN${NC}"
            echo ""
        done

        echo -e "${GREEN}${BOLD}[TESTE CONCLUÍDO COM SUCESSO]${NC}"
        echo "Finalizando..."
        echo "exit" >&"${HAL_PROC[1]}" 2>/dev/null || true
        ;;

    2)
        echo ""
        echo -e "${CYAN}${BOLD}=== TERMINAL INTERATIVO HALCMD ===${NC}"
        echo -e "O HAL já foi iniciado com a placa conectada."
        echo -e "Exemplos de comandos úteis:"
        echo -e "  ${BOLD}setp stepgen-ninja.0.arc-enable 1${NC}   -> Liga o Relé 1"
        echo -e "  ${BOLD}setp stepgen-ninja.0.arc-enable 0${NC}   -> Desliga o Relé 1"
        echo -e "  ${BOLD}setp stepgen-ninja.0.aux-out 1${NC}      -> Liga o Relé 2"
        echo -e "  ${BOLD}show pin stepgen-ninja.0${NC}           -> Lista todos os pinos"
        echo -e "  ${BOLD}getp stepgen-ninja.0.connected${NC}     -> Mostra status da conexão"
        echo -e "  ${BOLD}exit${NC}                                 -> Encerra o teste"
        echo ""
        # Executa diretamente o halrun interativo com o arquivo de comandos
        halrun -I -f "$HAL_FILE"
        ;;

    3)
        echo ""
        echo -e "${CYAN}${BOLD}=== MONITOR DE ENTRADAS EM TEMPO REAL ===${NC}"
        echo -e "Iniciando HAL..."
        coproc HAL_PROC { halrun -I -f "$HAL_FILE"; }
        sleep 1

        echo -e "${GREEN}[OK] HAL iniciado! Pressione Ctrl+C para sair.${NC}"
        echo ""
        
        while true; do
            CONN=$(halcmd getp stepgen-ninja.0.connected 2>/dev/null || echo "FALSE")
            ARCOK=$(halcmd getp stepgen-ninja.0.arc-ok 2>/dev/null || echo "N/A")
            PROBE=$(halcmd getp stepgen-ninja.0.probe 2>/dev/null || echo "N/A")
            ESTOP=$(halcmd getp stepgen-ninja.0.estop 2>/dev/null || echo "N/A")
            FIM=$(halcmd getp stepgen-ninja.0.fim-curso 2>/dev/null || echo "N/A")
            UP=$(halcmd getp stepgen-ninja.0.up 2>/dev/null || echo "N/A")
            DOWN=$(halcmd getp stepgen-ninja.0.down 2>/dev/null || echo "N/A")
            JITTER=$(halcmd getp stepgen-ninja.0.jitter 2>/dev/null || echo "0")

            printf "\r\033[KConexão: %s | arc-ok: %s | probe: %s | estop: %s | fim-curso: %s | up: %s | down: %s | jitter: %s ns" \
                "$CONN" "$ARCOK" "$PROBE" "$ESTOP" "$FIM" "$UP" "$DOWN" "$JITTER"
            sleep 0.2
        done
        ;;

    4)
        echo ""
        echo -e "${CYAN}${BOLD}=== MODO GRÁFICO (HALMETER) ===${NC}"
        echo -e "Iniciando HAL e abrindo painel gráfico halmeter..."
        coproc HAL_PROC { halrun -I -f "$HAL_FILE"; }
        sleep 1

        if command -v halmeter >/dev/null 2>&1; then
            echo -e "Feche a janela do halmeter ou pressione Ctrl+C no terminal para sair."
            halmeter &
            wait $! 2>/dev/null || true
        else
            echo -e "${RED}[!] halmeter não encontrado no sistema.${NC}"
        fi
        echo "exit" >&"${HAL_PROC[1]}" 2>/dev/null || true
        ;;

    5)
        echo "Saindo..."
        exit 0
        ;;

    *)
        echo -e "${RED}Opção inválida.${NC}"
        exit 1
        ;;
esac
