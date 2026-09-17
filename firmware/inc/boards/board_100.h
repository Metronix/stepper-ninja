#ifndef BOARD_100_H
#define BOARD_100_H

#include "internals.h"

// ==============================================================================
// BREAKOUT BOARD 100
// ==============================================================================
// 4 stepgens, 2 encoders, 32 inputs (2x MCP23017), 16 outputs (1x MCP23017),
// 2 analog outputs via MCP4725
// ==============================================================================

#define BOARD_NAME "Breakout Board 100"
#define breakout_board 100

#define MCP23017_ADDR          0x20
#define IN_EXPANDER_COUNT      2
#define MCP23017_ADDR_output   0x22
#define output_expander_count  1
#define MCP_ALL_RESET          GPIO_RESET

#define ANALOG_CH              2
#define MCP4725_BASE           0x60
#define MCP4725_PORT           i2c0
#define MCP4725_SDA            12
#define MCP4725_SCL            13

#define stepgens 4
#define stepgen_steps {PIN_1, PIN_4, PIN_6, PIN_9}
#define stepgen_dirs  {PIN_2, PIN_5, PIN_7, PIN_10}
#define step_invert   {0, 0, 0, 0}
#define default_pulse_width 2000
#define default_step_scale  1000

#define encoders 2
#define enc_pins {8, 14}
#define enc_index_pins {10, 11}
#define enc_index_active_level {high, high}

#define in_pins {}
#define in_pullup {}
#define out_pins {}

#define use_pwm 0
#define pwm_count 0

#define I2C_SDA         26
#define I2C_SCK         27
#define I2C_PORT        i2c1

#endif // BOARD_100_H
