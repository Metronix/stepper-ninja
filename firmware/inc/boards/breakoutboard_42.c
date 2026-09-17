#include <stdio.h>

#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "breakoutboard.h"

// ============================================================
// Breakout Board Firmware Template (USER)
//
// How to use:
// 1) Copy this file to: breakoutboard_<ID>.c
// 2) Change the compile guard below to: #if breakout_board == <ID>
// 3) Add the new file to firmware/CMakeLists.txt
// 4) Add board-specific config/macros in firmware/inc/footer.h
// 5) Implement the 4 required callbacks below
// ============================================================


#if breakout_board == 42

extern transmission_pc_pico_t *rx_buffer;
extern transmission_pico_pc_t *tx_buffer;
extern volatile uint32_t input_buffer[4];
extern volatile uint32_t output_buffer;

void breakout_board_setup(void) {
    // Inicializa saídas digitais em nível baixo por segurança
    gpio_put(GP28, 0);
    gpio_put(GP08, 0);
        
}

void breakout_board_disconnected_update(void) {
    // Se a rede cair, desliga o arco imediatamente
    gpio_put(GP28, 0); 
    gpio_put(GP08, 0);
}

void breakout_board_connected_update(void) {
    // 1. Lê as entradas e mantém o mapeamento direto (GPIO = BIT)
    const uint8_t pins[] = in_pins;
    uint32_t status = 0;

    for (int i = 0; i < 7; i++) {
        // Se gpio_get retornar 0 (Pull-down ativo), setamos o bit como 1
        if (!gpio_get(pins[i])) { 
            status |= (1 << i); 
        }
    }
    // Salva no buffer. Note que o Bit 31 (Hardware OK) 
    // deve ser adicionado aqui ou na função handle_data
    input_buffer[0] = status  | 0x80000000;
    
    // 2. Aplica as saídas (Isso já estava correto)
    gpio_put(GP28, (output_buffer & 0x01));      
    gpio_put(GP08, (output_buffer & 0x02) >> 1); 
}


void breakout_board_handle_data(void) {
    // Mapeia para inputs[2] como no exemplo da Board 1
    // Adicionamos o bit 31 como HIGH para sinalizar "Hardware OK" ao driver
    tx_buffer->inputs[0] = input_buffer[0]; 
    
    tx_buffer->inputs[1] = 0; 
    tx_buffer->inputs[2] = 0;
    tx_buffer->inputs[3] = 0;

    output_buffer = rx_buffer->outputs[0];
}
#endif