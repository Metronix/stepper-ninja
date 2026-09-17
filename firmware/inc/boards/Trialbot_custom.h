#ifndef TRIALBOT_CUSTOM_H
#define TRIALBOT_CUSTOM_H

#include "internals.h"

// ==============================================================================
// STEPPER NINJA - TRIALBOT
// Arquivo: Trialbot_custom.h
// Gerado pelo Stepper Ninja Board Configurator
// ==============================================================================

#define BOARD_NAME "Trialbot"
#define breakout_board 0

// ------------------------------------------------------------------------------
// 1. STEP GENERATORS (MOTORES DE PASSO)
// ------------------------------------------------------------------------------
#define stepgens 4
#define stepgen_steps {PIN_1, PIN_4, PIN_6, PIN_10}
#define stepgen_dirs  {PIN_2, PIN_5, PIN_7, PIN_11}
#define step_invert   {0, 0, 0, 0}
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
#define in_pins {PIN_15}
#define in_pullup {0}
#define in_pin_names {"estop"}

// ------------------------------------------------------------------------------
// 4. SAÍDAS DIGITAIS (OUTPUTS)
// ------------------------------------------------------------------------------
#define out_pins {PIN_12, PIN_20}
#define out_pin_names {"enable", "aux_out"}

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

#endif // TRIALBOT_CUSTOM_H
