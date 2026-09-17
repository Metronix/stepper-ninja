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

#if breakout_board == 42

extern transmission_pc_pico_t *rx_buffer;
extern transmission_pico_pc_t *tx_buffer;
extern volatile uint32_t input_buffer[4];
extern volatile uint32_t output_buffer;

static const uint8_t bb42_in_pins[] = in_pins;
static const uint8_t bb42_out_pins[] = out_pins;

void breakout_board_setup(void) {
    for (size_t i = 0; i < sizeof(bb42_out_pins); i++) {
        gpio_init(bb42_out_pins[i]);
        gpio_set_dir(bb42_out_pins[i], GPIO_OUT);
        gpio_put(bb42_out_pins[i], 0);
    }
}

void breakout_board_disconnected_update(void) {
    for (size_t i = 0; i < sizeof(bb42_out_pins); i++) {
        gpio_put(bb42_out_pins[i], 0);
    }
}

void breakout_board_connected_update(void) {
    uint32_t status = 0;

    for (size_t i = 0; i < sizeof(bb42_in_pins); i++) {
        if (!gpio_get(bb42_in_pins[i])) {
            status |= (1u << i);
        }
    }
    input_buffer[0] = status | 0x80000000;

    for (size_t i = 0; i < sizeof(bb42_out_pins); i++) {
        gpio_put(bb42_out_pins[i], (output_buffer >> i) & 1);
    }
}

void breakout_board_handle_data(void) {
    tx_buffer->inputs[0] = input_buffer[0];
    tx_buffer->inputs[1] = 0;
    tx_buffer->inputs[2] = 0;
    tx_buffer->inputs[3] = 0;

    output_buffer = rx_buffer->outputs[0];
}

#endif // breakout_board == 42
