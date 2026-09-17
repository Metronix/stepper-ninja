#ifndef BOARD_CUSTOM_H
#define BOARD_CUSTOM_H

#include "internals.h"

// ==============================================================================
// STEPPER NINJA - CUSTOM BOARD
// Arquivo: board_custom.h
// Gerado pelo Stepper Ninja Board Configurator
// ==============================================================================

#define BOARD_NAME "Custom Board"
#define breakout_board 0

// ------------------------------------------------------------------------------
// 1. STEP GENERATORS (MOTORES DE PASSO)
// ------------------------------------------------------------------------------
#define stepgens 0
#define stepgen_steps {}
#define stepgen_dirs  {}
#define step_invert   {}
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
#define in_pins {}
#define in_pullup {}
#define in_pin_names {}

// ------------------------------------------------------------------------------
// 4. SAÍDAS DIGITAIS (OUTPUTS)
// ------------------------------------------------------------------------------
#define out_pins {}
#define out_pin_names {}

// ------------------------------------------------------------------------------
// 5. PWM (SPINDLE / LASER)
// ------------------------------------------------------------------------------
#define use_pwm 0
#define pwm_count 0
#define pwm_pin {}
#define pwm_invert {}
#define default_pwm_frequency 10000
#define default_pwm_maxscale  4096
#define default_pwm_min_limit 0

// ------------------------------------------------------------------------------
// 6. EXPANDERS (I2C)
// ------------------------------------------------------------------------------
#define io_expanders 0

#endif // BOARD_CUSTOM_H
