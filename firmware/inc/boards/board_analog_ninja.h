#ifndef BOARD_ANALOG_NINJA_H
#define BOARD_ANALOG_NINJA_H

#include "internals.h"

// ==============================================================================
// ANALOG NINJA BREAKOUT BOARD
// ==============================================================================
// 4 canais analógicos via MCP4725, 4 encoders de alta velocidade
// ==============================================================================

#define BOARD_NAME "Analog Ninja Breakout Board"
#define breakout_board 3

#define DA_CHANNELS     4
#define ANALOG_CH       DA_CHANNELS
#define MCP4725_BASE    0x60
#define MCP4725_PORT    i2c1
#define MCP4725_SDA     PIN_14
#define MCP4725_SCL     PIN_15

#define I2C_SDA         26
#define I2C_SCK         27
#define I2C_PORT        i2c1
#define MCP23008_ADDR   0x20
#define MCP_ALL_RESET   22

#define stepgens 0
#define stepgen_steps {}
#define stepgen_dirs  {}
#define step_invert   {}

#define encoders 4
#define enc_pins {PIN_1, PIN_5, PIN_9, PIN_16}
#define enc_index_pins {PIN_4, PIN_7, PIN_11, PIN_19}
#define enc_index_active_level {high, high, high, high}

#define in_pins {}
#define in_pullup {}
#define out_pins {}

#define use_pwm 0
#define pwm_count 0

#endif // BOARD_ANALOG_NINJA_H
