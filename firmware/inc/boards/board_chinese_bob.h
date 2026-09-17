#ifndef BOARD_CHINESE_BOB_H
#define BOARD_CHINESE_BOB_H

#include "internals.h"

// ==============================================================================
// STEPPER NINJA - CHINESE 5-AXIS DB25 BOB
// Arquivo: board_chinese_bob.h
// Gerado pelo Stepper Ninja Board Configurator
// ==============================================================================

#define BOARD_NAME "Chinese 5-Axis DB25 BOB"
#define breakout_board 0

// ------------------------------------------------------------------------------
// 1. STEP GENERATORS (MOTORES DE PASSO)
// ------------------------------------------------------------------------------
#define stepgens 4
#define stepgen_steps {PIN_1, PIN_4, PIN_6, PIN_9}
#define stepgen_dirs  {PIN_2, PIN_5, PIN_7, PIN_10}
#define step_invert   {0, 0, 0, 0}
#define default_pulse_width 3000
#define default_step_scale  1000

// ------------------------------------------------------------------------------
// 2. ENCODERS DE QUADRATURA (SPINDLE / FEEDBACK)
// ------------------------------------------------------------------------------
#define encoders 0
#define enc_pins {}
#define enc_index_pins {PIN_NULL}
#define enc_index_active_level {high}

// ------------------------------------------------------------------------------
// 3. ENTRADAS DIGITAIS (INPUTS)
// ------------------------------------------------------------------------------
#define in_pins {PIN_14, PIN_15, PIN_16, PIN_29, PIN_31, PIN_32}
#define in_pullup {1, 1, 1, 1, 1, 1}
#define in_pin_names {"limit_x", "limit_y", "limit_z", "probe", "estop", "pause"}

// ------------------------------------------------------------------------------
// 4. SAÍDAS DIGITAIS (OUTPUTS)
// ------------------------------------------------------------------------------
#define out_pins {PIN_17, PIN_20}
#define out_pin_names {"spindle", "coolant"}

// ------------------------------------------------------------------------------
// 5. PWM (SPINDLE / LASER)
// ------------------------------------------------------------------------------
#define use_pwm 1
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

#endif // BOARD_CHINESE_BOB_H
