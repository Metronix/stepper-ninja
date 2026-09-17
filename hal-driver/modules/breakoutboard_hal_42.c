#include "config.h"
// ============================================================
// Breakout Board HAL Template (USER)
//
// How to use:
// 1) Copy this file to: breakoutboard_hal_<ID>.c
// 2) Change the compile guard below to: #if breakout_board == <ID>
// 3) Add a matching #elif branch in analog-ninja.c:
//      #elif breakout_board == <ID>
//      #include "modules/breakoutboard_hal_<ID>.c"
//
// Each board module defines exactly three functions with these
// common names (no board-number suffix needed):
//   bb_hal_setup_pins(), bb_hal_process_recv(), bb_hal_process_send()
//
// This file is expected to be included into analog-ninja.c after
// module_data_t and global rx_buffer/tx_buffer are defined.
// ============================================================

#if breakout_board == 42

#ifdef in_pin_names
static const char *bb42_input_names[] = in_pin_names;
#else
static const char *bb42_input_names[] = {
    "pause", "estop", "fim-curso", "probe", "arc-ok", "up", "down"
};
#endif

#ifdef out_pin_names
static const char *bb42_output_names[] = out_pin_names;
#else
static const char *bb42_output_names[] = {
    "arc-enable", "aux-out"
};
#endif

enum {
    BB42_IN_PINS_NO = in_pins_no,
};

static void add_pin_aliases(const char *name, int is_inverted)
{
    int chg = 0;
    // 1. Hyphen <-> Underscore conversion
    char alias_name[128];
    strncpy(alias_name, name, sizeof(alias_name) - 1);
    alias_name[sizeof(alias_name) - 1] = '\0';
    char *dot = strrchr(alias_name, '.');
    if (dot) {
        for (char *p = dot + 1; *p; p++) {
            if (is_inverted && (strcmp(p, "-not") == 0 || strcmp(p, "_not") == 0)) break;
            if (*p == '_') { *p = '-'; chg = 1; }
            else if (*p == '-') { *p = '_'; chg = 1; }
        }
        if (chg && strcmp(name, alias_name) != 0) {
            hal_pin_alias(name, alias_name);
        }
    }

    // 2. Plasma aliases (rl1out <-> arc-enable / arc_enable)
    if (strstr(name, ".rl1out") != NULL) {
        char plasma_alias[128];
        snprintf(plasma_alias, sizeof(plasma_alias), "%s", name);
        char *sub = strstr(plasma_alias, ".rl1out");
        if (sub) {
            strcpy(sub, ".arc-enable");
            hal_pin_alias(name, plasma_alias);
            strcpy(sub, ".arc_enable");
            hal_pin_alias(name, plasma_alias);
        }
    }
    if (strstr(name, ".arc-enable") != NULL || strstr(name, ".arc_enable") != NULL) {
        char rl_alias[128];
        snprintf(rl_alias, sizeof(rl_alias), "%s", name);
        char *sub = strstr(rl_alias, ".arc-enable");
        if (!sub) sub = strstr(rl_alias, ".arc_enable");
        if (sub) {
            strcpy(sub, ".rl1out");
            hal_pin_alias(name, rl_alias);
        }
    }
    if (strstr(name, ".aux-out") != NULL || strstr(name, ".aux_out") != NULL) {
        char rl_alias[128];
        snprintf(rl_alias, sizeof(rl_alias), "%s", name);
        char *sub = strstr(rl_alias, ".aux-out");
        if (!sub) sub = strstr(rl_alias, ".aux_out");
        if (sub) {
            strcpy(sub, ".rl2out");
            hal_pin_alias(name, rl_alias);
        }
    }

    // 3. Module cross-aliasing (stepgen-ninja <-> stepper-ninja)
    if (strncmp(name, "stepgen-ninja.", 14) == 0) {
        char alt_mod_name[128];
        snprintf(alt_mod_name, sizeof(alt_mod_name), "stepper-ninja.%s", name + 14);
        hal_pin_alias(name, alt_mod_name);
        if (chg && strcmp(name, alias_name) != 0) {
            char alt_alias[128];
            snprintf(alt_alias, sizeof(alt_alias), "stepper-ninja.%s", alias_name + 14);
            hal_pin_alias(name, alt_alias);
        }
    } else if (strncmp(name, "stepper-ninja.", 14) == 0) {
        char alt_mod_name[128];
        snprintf(alt_mod_name, sizeof(alt_mod_name), "stepgen-ninja.%s", name + 14);
        hal_pin_alias(name, alt_mod_name);
        if (chg && strcmp(name, alias_name) != 0) {
            char alt_alias[128];
            snprintf(alt_alias, sizeof(alt_alias), "stepgen-ninja.%s", alias_name + 14);
            hal_pin_alias(name, alt_alias);
        }
    }
}

static int bb_hal_setup_pins(module_data_t *d, int j, int comp_id,
                             char *name, uint32_t nsize)
{
    int r;

    // --- Entradas Digitais (do Pico para o LinuxCNC) ---
    for (int i = 0; i < BB42_IN_PINS_NO; i++) {
        // Pinos normais (true quando pino está High)
        memset(name, 0, nsize);
        snprintf(name, nsize, module_name ".%d.%s", j, bb42_input_names[i]);
        r = hal_pin_bit_newf(HAL_OUT, &d->input[i], comp_id, name, j);
        if (r < 0) return r;
        add_pin_aliases(name, 0);

        // Pinos invertidos (true quando pino está Low)
        memset(name, 0, nsize);
        snprintf(name, nsize, module_name ".%d.%s-not", j, bb42_input_names[i]);
        r = hal_pin_bit_newf(HAL_OUT, &d->input_not[i], comp_id, name, j);
        if (r < 0) return r;
        add_pin_aliases(name, 1);
    }

    // --- Saídas Digitais (do LinuxCNC para o Pico) ---
    for (int i = 0; i < out_pins_no; i++) {
        memset(name, 0, nsize);
        snprintf(name, nsize, module_name ".%d.%s", j, bb42_output_names[i]);
        r = hal_pin_bit_newf(HAL_IN, &d->output[i], comp_id, name, j);
        if (r < 0) return r;
        *d->output[i] = 0; // Inicia em estado seguro
        add_pin_aliases(name, 0);
    }

    return 0;
}

static void bb_hal_process_recv(module_data_t *d)
{
    // Desempacota as entradas recebidas do Pico (rx_buffer->inputs[0])
    uint32_t value = rx_buffer->inputs[0];

    for (uint8_t i = 0; i < BB42_IN_PINS_NO; i++) {
        uint8_t bit = (value >> i) & 1u;
        *d->input[i] = bit;
        *d->input_not[i] = !bit;
    }
}

static void bb_hal_process_send(module_data_t *d)
{
    // Empacota os comandos do LinuxCNC para o pacote UDP (tx_buffer->outputs[0])
    uint32_t outs = 0;

    for (uint8_t i = 0; i < out_pins_no; i++) {
        if (*d->output[i]) {
            outs |= (1u << i);
        }
    }

    tx_buffer->outputs[0] = outs;
}

#endif // breakout_board == 42
