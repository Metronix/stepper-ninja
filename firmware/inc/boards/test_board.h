#ifndef TEST_BOARD_H
#define TEST_BOARD_H

#include "internals.h"

// ==============================================================================
// STEPPER NINJA - TRIALBOT
// Arquivo: test_board.h
// Gerado pelo Stepper Ninja Board Configurator
// ==============================================================================

#define BOARD_NAME "Trialbot"
#define breakout_board 0

// ------------------------------------------------------------------------------
// 0. BARRAMENTO SPI (W5500 / W5100S)
// ------------------------------------------------------------------------------
#define SPI_PORT_SELECT 0
#define GPIO_MISO 0
#define GPIO_CS   1
#define GPIO_SCK  2
#define GPIO_MOSI 3
#define GPIO_RESET 4
#define GPIO_INT  5

// ------------------------------------------------------------------------------
// 1. STEP GENERATORS (MOTORES DE PASSO)
// ------------------------------------------------------------------------------
#define stepgens 3
#define stepgen_steps {PIN_21, PIN_24, PIN_26}
#define stepgen_dirs  {PIN_22, PIN_25, PIN_27}
#define step_invert   {0, 0, 0}
#define default_pulse_width 2000
#define default_step_scale  1000

// ------------------------------------------------------------------------------
// 2. ENCODERS DE QUADRATURA (SPINDLE / FEEDBACK)
// ------------------------------------------------------------------------------
#define encoders 0
#define enc_pins {}
#define enc_index_pins {}
#define enc_index_active_level {}

// ------------------------------------------------------------------------------
// 3. ENTRADAS DIGITAIS (INPUTS)
// ------------------------------------------------------------------------------
#define in_pins {PIN_12, PIN_14, PIN_15, PIN_16, PIN_17, PIN_19, PIN_20}
#define in_pullup {0, 0, 0, 0, 0, 0, 0}
#define in_pin_names {"pause", "estop", "fim-curso", "probe", "arc-ok", "up", "down"}

// ------------------------------------------------------------------------------
// 4. SAÍDAS DIGITAIS (OUTPUTS)
// ------------------------------------------------------------------------------
#define out_pins {PIN_34, PIN_11, PIN_29}
#define out_pin_names {"arc-enable", "aux-out", "status_connection"}

// ------------------------------------------------------------------------------
// 5. PWM (SPINDLE / LASER)
// ------------------------------------------------------------------------------
#define use_pwm 0
#define pwm_count 1
#define pwm_pin {PIN_NULL}
#define pwm_invert {0}
#define default_pwm_frequency 10000
#define default_pwm_maxscale  4096
#define default_pwm_min_limit 0

// ------------------------------------------------------------------------------
// 6. EXPANDERS (I2C)
// ------------------------------------------------------------------------------
#define io_expanders 0

#endif // TEST_BOARD_H
