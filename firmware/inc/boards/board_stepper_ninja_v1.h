#ifndef BOARD_STEPPER_NINJA_V1_H
#define BOARD_STEPPER_NINJA_V1_H

#include "internals.h"

// ==============================================================================
// STEPPER NINJA BREAKOUT BOARD V1.0
// ==============================================================================
// 4 stepgens, 2 encoders, 4 fast inputs, 16 inputs via MCP23017,
// 8 outputs via MCP23008, 2 analog outputs via MCP4725
// ==============================================================================

#define BOARD_NAME "Stepper Ninja Breakout Board v1.0"
#define breakout_board 1

// I2C & Expander Addresses
#define MCP23017_ADDR   0x20
#define MCP23008_ADDR   0x21
#define MCP_ALL_RESET   21
#define I2C_SDA         26
#define I2C_SCK         27
#define I2C_PORT        i2c1

#define ANALOG_CH       2
#define MCP4725_BASE    0x60
#define MCP4725_PORT    i2c0
#define MCP4725_SDA     12
#define MCP4725_SCL     13

// Step Generators
#define stepgens 4
#define stepgen_steps {PIN_1, PIN_4, PIN_6, PIN_9}
#define stepgen_dirs  {PIN_2, PIN_5, PIN_7, PIN_10}
#define step_invert   {0, 0, 0, 0}
#define default_pulse_width 2000
#define default_step_scale  1000

// Encoders
#define encoders 2
#define enc_pins {8, 14}
#define enc_index_pins {10, 11}
#define enc_index_active_level {high, high}

// Fast inputs on Pico GPIO
#define in_pins {PIN_29, PIN_31, PIN_32, PIN_34}
#define in_pullup {0, 0, 0, 0}

// Outputs on Pico GPIO
#define out_pins {}

// PWM
#define use_pwm 0
#define pwm_count 0

#endif // BOARD_STEPPER_NINJA_V1_H
