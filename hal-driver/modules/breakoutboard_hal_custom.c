#include "config.h"
// ============================================================
// Breakout Board HAL Module - Trialbot
// Arquivo correspondente: test_board.h
// Gerado automaticamente pelo Stepper Ninja Board Configurator
// ============================================================

#if breakout_board == 0

#ifdef in_pin_names
static const char *bb_custom_in_names[] = in_pin_names;
#else
static const char *bb_custom_in_names[] = {
    "pause",
    "estop",
    "fim-curso",
    "probe",
    "arc-ok",
    "up",
    "down"
};
#endif

#ifdef out_pin_names
static const char *bb_custom_out_names[] = out_pin_names;
#else
static const char *bb_custom_out_names[] = {
    "arc-enable",
    "aux-out",
    "status_connection"
};
#endif

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

    // --- Entradas Digitais (Pico -> LinuxCNC) ---
    for (int i = 0; i < in_pins_no; i++) {
        memset(name, 0, nsize);
        if (i < (int)(sizeof(bb_custom_in_names) / sizeof(bb_custom_in_names[0])) &&
            bb_custom_in_names[i] && strlen(bb_custom_in_names[i]) > 0) {
            snprintf(name, nsize, module_name ".%d.%s", j, bb_custom_in_names[i]);
        } else {
            snprintf(name, nsize, module_name ".%d.input.gp%d", j, input_pins[i]);
        }
        r = hal_pin_bit_newf(HAL_OUT, &d->input[i], comp_id, name, j);
        if (r < 0) {
            rtapi_print_msg(RTAPI_MSG_ERR,
                module_name ".%d: ERROR: pin connected export failed with err=%i\n", j, r);
            return r;
        }
        add_pin_aliases(name, 0);

        memset(name, 0, nsize);
        if (i < (int)(sizeof(bb_custom_in_names) / sizeof(bb_custom_in_names[0])) &&
            bb_custom_in_names[i] && strlen(bb_custom_in_names[i]) > 0) {
            snprintf(name, nsize, module_name ".%d.%s-not", j, bb_custom_in_names[i]);
        } else {
            snprintf(name, nsize, module_name ".%d.input.gp%d-not", j, input_pins[i]);
        }
        r = hal_pin_bit_newf(HAL_OUT, &d->input_not[i], comp_id, name, j);
        if (r < 0) {
            rtapi_print_msg(RTAPI_MSG_ERR,
                module_name ".%d: ERROR: pin connected export failed with err=%i\n", j, r);
            return r;
        }
        add_pin_aliases(name, 1);
    }

    // --- Saídas Digitais (LinuxCNC -> Pico) ---
    for (int i = 0; i < out_pins_no; i++) {
        memset(name, 0, nsize);
        if (i < (int)(sizeof(bb_custom_out_names) / sizeof(bb_custom_out_names[0])) &&
            bb_custom_out_names[i] && strlen(bb_custom_out_names[i]) > 0) {
            snprintf(name, nsize, module_name ".%d.%s", j, bb_custom_out_names[i]);
        } else {
            snprintf(name, nsize, module_name ".%d.output.gp%d", j, output_pins[i]);
        }
        r = hal_pin_bit_newf(HAL_IN, &d->output[i], comp_id, name, j);
        if (r < 0) {
            rtapi_print_msg(RTAPI_MSG_ERR,
                module_name ".%d: ERROR: pin connected export failed with err=%i\n", j, r);
            return r;
        }
        *d->output[i] = 0;
        add_pin_aliases(name, 0);
    }

    return 0;
}

static void bb_hal_process_recv(module_data_t *d)
{
    for (uint8_t i = 0; i < in_pins_no; i++) {
        if (input_pins[i] < 32) {
            *d->input[i] = (rx_buffer->inputs[0] >> (input_pins[i] & 31)) & 1;
        } else {
            *d->input[i] = (rx_buffer->inputs[1] >> ((input_pins[i] - 32) & 31)) & 1;
        }
        *d->input_not[i] = !(*d->input[i]);
    }
}

static void bb_hal_process_send(module_data_t *d)
{
    uint32_t outs0 = 0;
    uint32_t outs1 = 0;

    for (uint8_t i = 0; i < out_pins_no; i++) {
        if (i < 32) {
            outs0 |= *d->output[i] == 1 ? 1u << i : 0;
        } else {
            outs1 |= *d->output[i] == 1 ? 1u << (i & 31) : 0;
        }
    }

    tx_buffer->outputs[0] = outs0;
    tx_buffer->outputs[1] = outs1;
}

#endif // breakout_board == 0
