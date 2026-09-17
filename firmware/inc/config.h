#ifndef CONFIG_H
#define CONFIG_H

// ==============================================================================
// STEPPER NINJA - CONFIGURAÇÃO GERAL DO SISTEMA
// ==============================================================================

// ------------------------------------------------------------------------------
// 1. CONFIGURAÇÕES DE REDE (ETHERNET / W5500)
// ------------------------------------------------------------------------------
#define DEFAULT_MAC     {0x00, 0x08, 0xDC, 0x12, 0x34, 0x56}
#define DEFAULT_IP {192, 168, 69, 160}
#define DEFAULT_PORT 8888
#define DEFAULT_GATEWAY {192, 168, 69, 1}
#define DEFAULT_SUBNET {255, 255, 252, 0} // 255.255.252.0 Senão o Pico não é encontrado pelo linux
#define DEFAULT_TIMEOUT 1000000 // Timeout de detecção de perda de conexão (em microssegundos = 1s)

// ------------------------------------------------------------------------------
// 2. TRANSPORTE DE COMUNICAÇÃO & BARRAMENTO SPI
// ------------------------------------------------------------------------------
// 0 = Ethernet UDP via chip WIZnet W5500/W5100S
// 1 = SPI direto com Raspberry Pi (usando bcm2835)
#define raspberry_pi_spi 0

// Instância de SPI de hardware do Pico (0 = spi0, 1 = spi1):
#define SPI_PORT_SELECT 0

// Pinos de hardware do barramento SPI (podem usar spi0 ou spi1):
#define GPIO_MISO 0
#define GPIO_CS 1
#define GPIO_SCK 2
#define GPIO_MOSI 3
#define GPIO_RESET 4
#define GPIO_INT 5

#if raspberry_pi_spi == 1
    #define raspi_int_out 25
    #define raspi_inputs {2, 3, 4, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 27}
    #define raspi_input_pullups {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}
    #define raspi_outputs {0, 1, 5, 6, 12, 13, 19, 26}
#endif

#include "internals.h"

// ------------------------------------------------------------------------------
// 3. SELEÇÃO DA PLACA / PERFIL DE HARDWARE (BOARD PROFILE)
// ------------------------------------------------------------------------------
// Escolha a placa desejada definindo SELECTED_BOARD:
#define BOARD_CUSTOM            0  // Placa customizada (configure em boards/board_custom.h)
#define BOARD_STEPPER_NINJA_V1  1  // Stepper Ninja Breakout Board v1.0
#define BOARD_IO_NINJA          2  // IO Ninja (96 in / 32 out via MCP23017)
#define BOARD_ANALOG_NINJA      3  // Analog Ninja (MCP4725 DACs)
#define BOARD_100             100  // Breakout Board 100
#define BOARD_CHINESE_BOB       4  // Placa Paralela Chinesa 5 eixos (DB25 Mach3)
#define BOARD_PICOBOB_DLX       5  // PicoBOB-DLX
#define BOARD_USER_TEMPLATE   255  // Template para nova placa com expansores

// Defina a placa ativa (padrão: BOARD_CUSTOM)
#ifndef SELECTED_BOARD
#define SELECTED_BOARD BOARD_CUSTOM
#endif

#ifndef CUSTOM_BOARD_FILE
#define CUSTOM_BOARD_FILE "boards/test_board.h"
#endif

// Inclusão automática do perfil de placa escolhido
#if SELECTED_BOARD == BOARD_CUSTOM
    #include CUSTOM_BOARD_FILE
#elif SELECTED_BOARD == BOARD_STEPPER_NINJA_V1
    #include "boards/board_stepper_ninja_v1.h"
#elif SELECTED_BOARD == BOARD_IO_NINJA
    #include "boards/board_io_ninja.h"
#elif SELECTED_BOARD == BOARD_ANALOG_NINJA
    #include "boards/board_analog_ninja.h"
#elif SELECTED_BOARD == BOARD_100
    #include "boards/board_100.h"
#elif SELECTED_BOARD == BOARD_CHINESE_BOB
    #include "boards/board_chinese_bob.h"
#elif SELECTED_BOARD == BOARD_PICOBOB_DLX
    #include "boards/board_picobob_dlx.h"
#elif SELECTED_BOARD == BOARD_USER_TEMPLATE
    #include "boards/board_user_template.h"
#else
    #error "Placa desconhecida selecionada em SELECTED_BOARD!"
#endif

// ------------------------------------------------------------------------------
// 4. OPÇÕES AVANÇADAS / EXPERIMENTAIS
// ------------------------------------------------------------------------------
#define use_timer_interrupt 0 // Timer interrupt com ring buffer de 3 slots para jitter smoothing

#ifndef encoder_pio_version
#define encoder_pio_version ENCODER_PIO_SUBSTEP // 0 = encoder PIO legado, 1 = substep encoder PIO
#endif

#define KBMATRIX

#include "footer.h"
#include "kbmatrix.h"

#endif // CONFIG_H
