#ifndef BOARD_PICOBOB_DLX_H
#define BOARD_PICOBOB_DLX_H

#include "internals.h"

// ==============================================================================
// PICOBOB-DLX BREAKOUT BOARD
// ==============================================================================
// 5 stepgens, 6 inputs, 2 outputs, 1 pwm
// ==============================================================================

#define BOARD_NAME "PicoBOB-DLX"
#define breakout_board 0

// Step Generators (5 eixos)
#define stepgens 5
#define stepgen_steps {22, 23, 24, 25, 26}
#define stepgen_dirs  {9, 10, 11, 12, 13}
#define step_invert   {0, 0, 0, 0, 0}
#define default_pulse_width 2000
#define default_step_scale  1000

// Encoders
#define encoders 0
#define enc_pins {}
#define enc_index_pins {PIN_NULL}
#define enc_index_active_level {high}

// Digital Inputs
#define in_pins {1, 2, 3, 4, 5, 15}
#define in_pullup {1, 1, 1, 1, 1, 1}

// Digital Outputs
#define out_pins {14, 8}

// PWM
#define use_pwm 1
#define pwm_count 1
#define pwm_pin {GP14}
#define pwm_invert {0}
#define default_pwm_frequency 10000
#define default_pwm_maxscale  4096
#define default_pwm_min_limit 0

#define io_expanders 0

#endif // BOARD_PICOBOB_DLX_H
