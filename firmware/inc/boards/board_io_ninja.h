#ifndef BOARD_IO_NINJA_H
#define BOARD_IO_NINJA_H

#include "internals.h"

// ==============================================================================
// IO NINJA BREAKOUT BOARD
// ==============================================================================
// 96 inputs digitais (6x MCP23017), 32 outputs digitais (2x MCP23017)
// ==============================================================================

#define BOARD_NAME "IO Ninja Breakout Board"
#define breakout_board 2

#define MCP23017_ADDR          0x20
#define IN_EXPANDER_COUNT      6
#define MCP23017_ADDR_output   0x26
#define output_expander_count  2
#define MCP_ALL_RESET          GPIO_RESET

#define toolchanger_encoder 1

#define I2C_SDA         12
#define I2C_SCK         13
#define I2C_PORT        i2c0

#define stepgens 0
#define stepgen_steps {}
#define stepgen_dirs  {}
#define step_invert   {}

#define encoders 0
#define enc_pins {}
#define enc_index_pins {}
#define enc_index_active_level {}

#define in_pins {}
#define in_pullup {}
#define out_pins {}

#define use_pwm 0
#define pwm_count 0

#endif // BOARD_IO_NINJA_H
