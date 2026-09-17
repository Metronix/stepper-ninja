#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "breakoutboard.h"
#include "config.h"

// ============================================================
// Breakout Board Firmware Module - Trialbot
// Arquivo correspondente: test_board.h
// Gerado automaticamente pelo Stepper Ninja Board Configurator
// ============================================================

#if breakout_board == 0

extern transmission_pc_pico_t *rx_buffer;
extern transmission_pico_pc_t *tx_buffer;
extern volatile uint32_t input_buffer[4];
extern volatile uint32_t output_buffer;

void breakout_board_setup(void) {
    gpio_init(28); gpio_set_dir(28, GPIO_OUT); gpio_put(28, 0);
    gpio_init(8); gpio_set_dir(8, GPIO_OUT); gpio_put(8, 0);
    gpio_init(22); gpio_set_dir(22, GPIO_OUT); gpio_put(22, 0);
}

void breakout_board_disconnected_update(void) {
    gpio_put(28, 0);
    gpio_put(8, 0);
    gpio_put(22, 0);
}

void breakout_board_connected_update(void) {
    const uint8_t pins[] = in_pins;
    uint32_t status = 0;

    for (int i = 0; i < 7; i++) {
        if (!gpio_get(pins[i])) {
            status |= (1u << i);
        }
    }
    input_buffer[0] = status | 0x80000000;

    gpio_put(28, (output_buffer >> 0) & 1);
    gpio_put(8, (output_buffer >> 1) & 1);
    gpio_put(22, (output_buffer >> 2) & 1);
}

void breakout_board_handle_data(void) {
    tx_buffer->inputs[0] = input_buffer[0];
    tx_buffer->inputs[1] = 0;
    tx_buffer->inputs[2] = 0;
    tx_buffer->inputs[3] = 0;

    output_buffer = rx_buffer->outputs[0];
}

#endif // breakout_board == 0
