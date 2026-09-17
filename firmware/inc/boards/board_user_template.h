#ifndef BOARD_USER_TEMPLATE_H
#define BOARD_USER_TEMPLATE_H

#include "internals.h"

// ==============================================================================
// TEMPLATE PARA NOVA PLACA DE EXPANSÃO (USER BREAKOUT BOARD)
// ==============================================================================
// Use este arquivo como modelo para criar sua própria placa com periféricos
// especiais (MCP23017, MCP23008, DAC MCP4725, etc.).
//
// Passos:
// 1. Defina os pinos de Step/Dir, Encoders, I/O e PWM abaixo.
// 2. Ajuste o endereço I2C e periféricos se usar barramento I2C.
// 3. Caso use periféricos especiais, implemente as funções de callback em
//    firmware/modules/breakoutboard_user.c e hal-driver/modules/breakoutboard_hal_user.c
// ==============================================================================

#define BOARD_NAME "User Template Board"
#define breakout_board 255 // ID para módulo user em firmware/modules/breakoutboard_user.c

// Step Generators
#define stepgens 4
#define stepgen_steps {PIN_1, PIN_4, PIN_6, PIN_9}
#define stepgen_dirs  {PIN_2, PIN_5, PIN_7, PIN_10}
#define step_invert   {0, 0, 0, 0}
#define default_pulse_width 2000
#define default_step_scale  1000

// Encoders
#define encoders 1
#define enc_pins {PIN_11}
#define enc_index_pins {PIN_NULL}
#define enc_index_active_level {high}

// Pinos nativos do Pico
#define in_pins {PIN_29, PIN_31, PIN_32, PIN_34}
#define in_pullup {1, 1, 1, 1}
#define out_pins {PIN_16, PIN_17}

// PWM
#define use_pwm 0
#define pwm_count 0
#define pwm_pin {PIN_NULL}
#define pwm_invert {0}
#define default_pwm_frequency 10000
#define default_pwm_maxscale  4096
#define default_pwm_min_limit 0

// I2C / Expansores (opcional)
#define io_expanders 0
//#define MCP23017_ADDR   0x20
//#define I2C_SDA         26
//#define I2C_SCK         27
//#define I2C_PORT        i2c1

#endif // BOARD_USER_TEMPLATE_H
