#!/usr/bin/env python3
"""
Stepper Ninja Board Configurator - Backend Server
Provides a local REST API and static web server to interactively configure board pins and firmware settings.
"""

import os
import re
import json
import socketserver
import subprocess
import webbrowser
from http.server import SimpleHTTPRequestHandler
from urllib.parse import urlparse

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
FIRMWARE_DIR = os.path.join(BASE_DIR, "firmware")
FIRMWARE_MODULES_DIR = os.path.join(FIRMWARE_DIR, "modules")
BOARDS_DIR = os.path.join(FIRMWARE_DIR, "inc/boards")
CUSTOM_BOARD_PATH = os.path.join(BOARDS_DIR, "board_custom.h")
CONFIG_H_PATH = os.path.join(FIRMWARE_DIR, "inc/config.h")
BUILD_DIR = os.path.join(FIRMWARE_DIR, "build")
HAL_DRIVER_DIR = os.path.join(BASE_DIR, "hal-driver")
HAL_MODULES_DIR = os.path.join(HAL_DRIVER_DIR, "modules")
HAL_BUILD_DIR = os.path.join(HAL_DRIVER_DIR, "build-cmake")
DIST_DIR = os.path.join(BASE_DIR, "dist")
STATIC_DIR = os.path.join(os.path.dirname(__file__), "web")

# Pinout map for Raspberry Pi Pico (40 pins)
PICO_PINS = [
    {"pin": 1, "name": "GP0", "alias": "PIN_1", "type": "gpio", "gp": 0},
    {"pin": 2, "name": "GP1", "alias": "PIN_2", "type": "gpio", "gp": 1},
    {"pin": 3, "name": "GND", "alias": "GND", "type": "gnd"},
    {"pin": 4, "name": "GP2", "alias": "PIN_4", "type": "gpio", "gp": 2},
    {"pin": 5, "name": "GP3", "alias": "PIN_5", "type": "gpio", "gp": 3},
    {"pin": 6, "name": "GP4", "alias": "PIN_6", "type": "gpio", "gp": 4},
    {"pin": 7, "name": "GP5", "alias": "PIN_7", "type": "gpio", "gp": 5},
    {"pin": 8, "name": "GND", "alias": "GND", "type": "gnd"},
    {"pin": 9, "name": "GP6", "alias": "PIN_9", "type": "gpio", "gp": 6},
    {"pin": 10, "name": "GP7", "alias": "PIN_10", "type": "gpio", "gp": 7},
    {"pin": 11, "name": "GP8", "alias": "PIN_11", "type": "gpio", "gp": 8},
    {"pin": 12, "name": "GP9", "alias": "PIN_12", "type": "gpio", "gp": 9},
    {"pin": 13, "name": "GND", "alias": "GND", "type": "gnd"},
    {"pin": 14, "name": "GP10", "alias": "PIN_14", "type": "gpio", "gp": 10},
    {"pin": 15, "name": "GP11", "alias": "PIN_15", "type": "gpio", "gp": 11},
    {"pin": 16, "name": "GP12", "alias": "PIN_16", "type": "gpio", "gp": 12},
    {"pin": 17, "name": "GP13", "alias": "PIN_17", "type": "gpio", "gp": 13},
    {"pin": 18, "name": "GND", "alias": "GND", "type": "gnd"},
    {"pin": 19, "name": "GP14", "alias": "PIN_19", "type": "gpio", "gp": 14},
    {"pin": 20, "name": "GP15", "alias": "PIN_20", "type": "gpio", "gp": 15},
    # Right side (from bottom to top)
    {"pin": 21, "name": "GP16", "alias": "PIN_21", "type": "gpio", "gp": 16},
    {"pin": 22, "name": "GP17", "alias": "PIN_22", "type": "gpio", "gp": 17},
    {"pin": 23, "name": "GND", "alias": "GND", "type": "gnd"},
    {"pin": 24, "name": "GP18", "alias": "PIN_24", "type": "gpio", "gp": 18},
    {"pin": 25, "name": "GP19", "alias": "PIN_25", "type": "gpio", "gp": 19},
    {"pin": 26, "name": "GP20", "alias": "PIN_26", "type": "gpio", "gp": 20},
    {"pin": 27, "name": "GP21", "alias": "PIN_27", "type": "gpio", "gp": 21},
    {"pin": 28, "name": "GND", "alias": "GND", "type": "gnd"},
    {"pin": 29, "name": "GP22", "alias": "PIN_29", "type": "gpio", "gp": 22},
    {"pin": 30, "name": "RUN", "alias": "RUN", "type": "sys"},
    {"pin": 31, "name": "GP26", "alias": "PIN_31", "type": "gpio", "gp": 26},
    {"pin": 32, "name": "GP27", "alias": "PIN_32", "type": "gpio", "gp": 27},
    {"pin": 33, "name": "AGND", "alias": "AGND", "type": "gnd"},
    {"pin": 34, "name": "GP28", "alias": "PIN_34", "type": "gpio", "gp": 28},
    {"pin": 35, "name": "ADC_VREF", "alias": "VREF", "type": "pwr"},
    {"pin": 36, "name": "3V3(OUT)", "alias": "3V3", "type": "pwr"},
    {"pin": 37, "name": "3V3_EN", "alias": "3V3_EN", "type": "sys"},
    {"pin": 38, "name": "GND", "alias": "GND", "type": "gnd"},
    {"pin": 39, "name": "VSYS", "alias": "VSYS", "type": "pwr"},
    {"pin": 40, "name": "VBUS (5V)", "alias": "VBUS", "type": "pwr"}
]

def to_clean_pin(val, default="0"):
    if val is None:
        return str(default)
    s = str(val).strip().upper()
    if not s or s in ("PIN_NULL", "GP_NULL", "NULL", "NONE"):
        return str(default)
    if s == "PIN_23":
        s = "PIN_24"  # Retrocompatibilidade com antigo alias GP18
    if s.startswith("PIN_"):
        for p in PICO_PINS:
            if p.get("alias") == s and p.get("gp") is not None:
                return str(p["gp"])
        num = s.replace("PIN_", "")
        if num.isdigit():
            for p in PICO_PINS:
                if p.get("pin") == int(num) and p.get("gp") is not None:
                    return str(p["gp"])
    if s.startswith("GP"):
        gp_num = s.replace("GP", "")
        if gp_num.isdigit():
            return gp_num
    if s.isdigit():
        return s
    return str(default)

def parse_c_array(raw_str):
    if not raw_str:
        return []
    clean = re.sub(r"[{}\s]", "", raw_str)
    if not clean:
        return []
    return [x for x in clean.split(",") if x]

def parse_board_file(filepath):
    if not os.path.exists(filepath):
        return {}
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    def get_define(name, default=""):
        m = re.search(r"#define\s+" + re.escape(name) + r"\s+(.+)", content)
        if m:
            val = m.group(1).split("//")[0].strip()
            return val
        return default

    def get_int(name, default=0):
        val = get_define(name, str(default))
        try:
            return int(val)
        except ValueError:
            return default

    board_name = get_define("BOARD_NAME", "Custom GPIO Board").strip('"')
    breakout_id = get_int("breakout_board", 0)

    stepgens = get_int("stepgens", 0)
    steps = parse_c_array(get_define("stepgen_steps", "{}"))
    dirs = parse_c_array(get_define("stepgen_dirs", "{}"))
    invert = parse_c_array(get_define("step_invert", "{}"))
    pulse_width = get_int("default_pulse_width", 2000)
    step_scale = get_int("default_step_scale", 1000)

    encoders = get_int("encoders", 0)
    enc_pins = parse_c_array(get_define("enc_pins", "{}"))
    enc_indexes = parse_c_array(get_define("enc_index_pins", "{}"))
    enc_active_levels = parse_c_array(get_define("enc_index_active_level", "{}"))

    in_pins = parse_c_array(get_define("in_pins", "{}"))
    in_pullup = parse_c_array(get_define("in_pullup", "{}"))
    raw_in_names = parse_c_array(get_define("in_pin_names", "{}"))
    in_pin_names = [x.strip('"').strip("'") for x in raw_in_names]

    while len(in_pin_names) < len(in_pins):
        in_pin_names.append("")
    while len(in_pullup) < len(in_pins):
        in_pullup.append("1")

    out_pins = parse_c_array(get_define("out_pins", "{}"))
    raw_out_names = parse_c_array(get_define("out_pin_names", "{}"))
    out_pin_names = [x.strip('"').strip("'") for x in raw_out_names]
    while len(out_pin_names) < len(out_pins):
        out_pin_names.append("")

    use_pwm = get_int("use_pwm", 0)
    pwm_count = get_int("pwm_count", 0)
    pwm_pins = parse_c_array(get_define("pwm_pin", "{}"))
    pwm_invert = parse_c_array(get_define("pwm_invert", "{}"))
    pwm_freq = get_int("default_pwm_frequency", 10000)
    pwm_maxscale = get_int("default_pwm_maxscale", 4096)

    # SPI bus settings if defined in board file
    spi_inst_raw = get_define("SPI_PORT_SELECT", "")
    spi_miso = get_define("GPIO_MISO", "")
    spi_cs = get_define("GPIO_CS", "")
    spi_sck = get_define("GPIO_SCK", "")
    spi_mosi = get_define("GPIO_MOSI", "")
    spi_reset = get_define("GPIO_RESET", "")
    spi_int = get_define("GPIO_INT", "")

    res = {
        "board_name": board_name,
        "breakout_board": breakout_id,
        "stepgens": stepgens,
        "stepgen_steps": steps,
        "stepgen_dirs": dirs,
        "step_invert": invert,
        "default_pulse_width": pulse_width,
        "default_step_scale": step_scale,
        "encoders": encoders,
        "enc_pins": enc_pins,
        "enc_index_pins": enc_indexes,
        "enc_index_active_level": enc_active_levels,
        "in_pins": in_pins,
        "in_pullup": in_pullup,
        "in_pin_names": in_pin_names,
        "out_pins": out_pins,
        "out_pin_names": out_pin_names,
        "use_pwm": use_pwm,
        "pwm_count": pwm_count,
        "pwm_pins": pwm_pins,
        "pwm_invert": pwm_invert,
        "default_pwm_frequency": pwm_freq,
        "default_pwm_maxscale": pwm_maxscale
    }

    if spi_inst_raw != "":
        res["spi_instance"] = get_int("SPI_PORT_SELECT", 0)
    if spi_miso:
        res["spi_miso"] = spi_miso
    if spi_cs:
        res["spi_cs"] = spi_cs
    if spi_sck:
        res["spi_sck"] = spi_sck
    if spi_mosi:
        res["spi_mosi"] = spi_mosi
    if spi_reset:
        res["spi_reset"] = spi_reset
    if spi_int:
        res["spi_int"] = spi_int

    return res

def parse_cmake_cache():
    cache_path = os.path.join(BUILD_DIR, "CMakeCache.txt")
    mcu = "pico"
    wizchip = "W5500"
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                c = f.read()
            m_board = re.search(r"BOARD:STRING=(\w+)", c)
            if m_board:
                mcu = m_board.group(1)
            m_wiz = re.search(r"WIZCHIP_TYPE:STRING=(\w+)", c)
            if m_wiz:
                wizchip = m_wiz.group(1)
        except Exception:
            pass
    return {"mcu": mcu, "wizchip": wizchip}

def parse_config_h():
    if not os.path.exists(CONFIG_H_PATH):
        return {}
    with open(CONFIG_H_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    def get_define(name, default=""):
        m = re.search(r"#define\s+" + re.escape(name) + r"\s+(.+)", content)
        if m:
            val = m.group(1).split("//")[0].strip()
            return val
        return default

    def clean_ip(raw):
        nums = re.findall(r"\d+", raw)
        return ".".join(nums) if len(nums) == 4 else "192.168.0.177"

    selected_board = get_define("SELECTED_BOARD", "BOARD_CUSTOM")
    custom_board_file = get_define("CUSTOM_BOARD_FILE", '"boards/board_custom.h"').strip('"')
    cache_info = parse_cmake_cache()

    return {
        "selected_board": selected_board,
        "custom_board_file": os.path.basename(custom_board_file),
        "ip": clean_ip(get_define("DEFAULT_IP", "{192, 168, 0, 177}")),
        "gateway": clean_ip(get_define("DEFAULT_GATEWAY", "{192, 168, 0, 1}")),
        "subnet": clean_ip(get_define("DEFAULT_SUBNET", "{255, 255, 252, 0}")),
        "port": int(get_define("DEFAULT_PORT", "8888")),
        "transport": int(get_define("raspberry_pi_spi", "0")),
        "mcu": cache_info.get("mcu", "pico"),
        "wizchip": cache_info.get("wizchip", "W5500"),
        "spi_instance": int(get_define("SPI_PORT_SELECT", "0")),
        "spi_miso": get_define("GPIO_MISO", "0"),
        "spi_cs": get_define("GPIO_CS", "1"),
        "spi_sck": get_define("GPIO_SCK", "2"),
        "spi_mosi": get_define("GPIO_MOSI", "3"),
        "spi_reset": get_define("GPIO_RESET", "4"),
        "spi_int": get_define("GPIO_INT", "5")
    }

def generate_board_c_code(data, filename="board_custom.h", net_data=None):
    board_name = data.get("board_name", "Custom Board").strip()
    if not board_name:
        board_name = "Custom Board"

    clean_guard = re.sub(r"[^A-Za-z0-9_]", "_", filename.upper().replace(".H", ""))
    guard_macro = f"{clean_guard}_H"

    # SPI bus settings (priority: net_data > data > defaults)
    spi_src = net_data if net_data else data
    spi_inst = int(spi_src.get("spi_instance", 0)) if "spi_instance" in spi_src else 0
    spi_miso = to_clean_pin(spi_src.get("spi_miso", 0), "0")
    spi_cs = to_clean_pin(spi_src.get("spi_cs", 1), "1")
    spi_sck = to_clean_pin(spi_src.get("spi_sck", 2), "2")
    spi_mosi = to_clean_pin(spi_src.get("spi_mosi", 3), "3")
    spi_reset = to_clean_pin(spi_src.get("spi_reset", 4), "4")
    spi_int = to_clean_pin(spi_src.get("spi_int", 5), "5")

    steps_str = ", ".join(data.get("stepgen_steps", []))
    dirs_str = ", ".join(data.get("stepgen_dirs", []))
    invert_str = ", ".join(str(x) for x in data.get("step_invert", []))
    enc_pins_str = ", ".join(data.get("enc_pins", []))
    enc_index_str = ", ".join(data.get("enc_index_pins", []))
    enc_lvl_str = ", ".join(data.get("enc_index_active_level", []))
    in_pins_str = ", ".join(data.get("in_pins", []))
    in_pullup_str = ", ".join(str(x) for x in data.get("in_pullup", []))
    in_names = data.get("in_pin_names", [])
    in_names_str = ", ".join(f'"{x}"' for x in in_names)

    out_pins_str = ", ".join(data.get("out_pins", []))
    out_names = data.get("out_pin_names", [])
    out_names_str = ", ".join(f'"{x}"' for x in out_names)

    pwm_pins_str = ", ".join(data.get("pwm_pins", []))
    pwm_inv_str = ", ".join(str(x) for x in data.get("pwm_invert", []))

    code = f"""#ifndef {guard_macro}
#define {guard_macro}

#include "internals.h"

// ==============================================================================
// STEPPER NINJA - {board_name.upper()}
// Arquivo: {filename}
// Gerado pelo Stepper Ninja Board Configurator
// ==============================================================================

#define BOARD_NAME "{board_name}"
#define breakout_board 0

// ------------------------------------------------------------------------------
// 0. BARRAMENTO SPI (W5500 / W5100S)
// ------------------------------------------------------------------------------
#define SPI_PORT_SELECT {spi_inst}
#define GPIO_MISO {spi_miso}
#define GPIO_CS   {spi_cs}
#define GPIO_SCK  {spi_sck}
#define GPIO_MOSI {spi_mosi}
#define GPIO_RESET {spi_reset}
#define GPIO_INT  {spi_int}

// ------------------------------------------------------------------------------
// 1. STEP GENERATORS (MOTORES DE PASSO)
// ------------------------------------------------------------------------------
#define stepgens {data.get('stepgens', 0)}
#define stepgen_steps {{{steps_str}}}
#define stepgen_dirs  {{{dirs_str}}}
#define step_invert   {{{invert_str}}}
#define default_pulse_width {data.get('default_pulse_width', 2000)}
#define default_step_scale  {data.get('default_step_scale', 1000)}

// ------------------------------------------------------------------------------
// 2. ENCODERS DE QUADRATURA (SPINDLE / FEEDBACK)
// ------------------------------------------------------------------------------
#define encoders {data.get('encoders', 0)}
#define enc_pins {{{enc_pins_str}}}
#define enc_index_pins {{{enc_index_str}}}
#define enc_index_active_level {{{enc_lvl_str}}}

// ------------------------------------------------------------------------------
// 3. ENTRADAS DIGITAIS (INPUTS)
// ------------------------------------------------------------------------------
#define in_pins {{{in_pins_str}}}
#define in_pullup {{{in_pullup_str}}}
#define in_pin_names {{{in_names_str}}}

// ------------------------------------------------------------------------------
// 4. SAÍDAS DIGITAIS (OUTPUTS)
// ------------------------------------------------------------------------------
#define out_pins {{{out_pins_str}}}
#define out_pin_names {{{out_names_str}}}

// ------------------------------------------------------------------------------
// 5. PWM (SPINDLE / LASER)
// ------------------------------------------------------------------------------
#define use_pwm {data.get('use_pwm', 0)}
#define pwm_count {data.get('pwm_count', 0)}
#define pwm_pin {{{pwm_pins_str}}}
#define pwm_invert {{{pwm_inv_str}}}
#define default_pwm_frequency {data.get('default_pwm_frequency', 10000)}
#define default_pwm_maxscale  {data.get('default_pwm_maxscale', 4096)}
#define default_pwm_min_limit 0

// ------------------------------------------------------------------------------
// 6. EXPANDERS (I2C)
// ------------------------------------------------------------------------------
#define io_expanders 0

#endif // {guard_macro}
"""
    return code

def generate_hal_module_c_code(data, filename="board_custom.h"):
    board_name = data.get("board_name", "Custom Board")
    breakout_id = data.get("breakout_board", 0)

    in_names = [f'"{n}"' for n in data.get("in_pin_names", []) if n]
    if not in_names:
        in_names = ['"in0"']
    in_names_str = ",\n    ".join(in_names)

    out_names = [f'"{n}"' for n in data.get("out_pin_names", []) if n]
    if not out_names:
        out_names = ['"out0"']
    out_names_str = ",\n    ".join(out_names)

    code = f"""#include "config.h"
// ============================================================
// Breakout Board HAL Module - {board_name}
// Arquivo correspondente: {filename}
// Gerado automaticamente pelo Stepper Ninja Board Configurator
// ============================================================

#if breakout_board == {breakout_id}

#ifdef in_pin_names
static const char *bb_custom_in_names[] = in_pin_names;
#else
static const char *bb_custom_in_names[] = {{
    {in_names_str}
}};
#endif

#ifdef out_pin_names
static const char *bb_custom_out_names[] = out_pin_names;
#else
static const char *bb_custom_out_names[] = {{
    {out_names_str}
}};
#endif

static void add_pin_aliases(const char *name, int is_inverted)
{{
    int chg = 0;
    // 1. Hyphen <-> Underscore conversion
    char alias_name[128];
    strncpy(alias_name, name, sizeof(alias_name) - 1);
    alias_name[sizeof(alias_name) - 1] = '\\0';
    char *dot = strrchr(alias_name, '.');
    if (dot) {{
        for (char *p = dot + 1; *p; p++) {{
            if (is_inverted && (strcmp(p, "-not") == 0 || strcmp(p, "_not") == 0)) break;
            if (*p == '_') {{ *p = '-'; chg = 1; }}
            else if (*p == '-') {{ *p = '_'; chg = 1; }}
        }}
        if (chg && strcmp(name, alias_name) != 0) {{
            hal_pin_alias(name, alias_name);
        }}
    }}

    // 2. Plasma aliases (rl1out <-> arc-enable / arc_enable)
    if (strstr(name, ".rl1out") != NULL) {{
        char plasma_alias[128];
        snprintf(plasma_alias, sizeof(plasma_alias), "%s", name);
        char *sub = strstr(plasma_alias, ".rl1out");
        if (sub) {{
            strcpy(sub, ".arc-enable");
            hal_pin_alias(name, plasma_alias);
            strcpy(sub, ".arc_enable");
            hal_pin_alias(name, plasma_alias);
        }}
    }}
    if (strstr(name, ".arc-enable") != NULL || strstr(name, ".arc_enable") != NULL) {{
        char rl_alias[128];
        snprintf(rl_alias, sizeof(rl_alias), "%s", name);
        char *sub = strstr(rl_alias, ".arc-enable");
        if (!sub) sub = strstr(rl_alias, ".arc_enable");
        if (sub) {{
            strcpy(sub, ".rl1out");
            hal_pin_alias(name, rl_alias);
        }}
    }}
    if (strstr(name, ".aux-out") != NULL || strstr(name, ".aux_out") != NULL) {{
        char rl_alias[128];
        snprintf(rl_alias, sizeof(rl_alias), "%s", name);
        char *sub = strstr(rl_alias, ".aux-out");
        if (!sub) sub = strstr(rl_alias, ".aux_out");
        if (sub) {{
            strcpy(sub, ".rl2out");
            hal_pin_alias(name, rl_alias);
        }}
    }}

    // 3. Module cross-aliasing (stepgen-ninja <-> stepper-ninja)
    if (strncmp(name, "stepgen-ninja.", 14) == 0) {{
        char alt_mod_name[128];
        snprintf(alt_mod_name, sizeof(alt_mod_name), "stepper-ninja.%s", name + 14);
        hal_pin_alias(name, alt_mod_name);
        if (chg && strcmp(name, alias_name) != 0) {{
            char alt_alias[128];
            snprintf(alt_alias, sizeof(alt_alias), "stepper-ninja.%s", alias_name + 14);
            hal_pin_alias(name, alt_alias);
        }}
    }} else if (strncmp(name, "stepper-ninja.", 14) == 0) {{
        char alt_mod_name[128];
        snprintf(alt_mod_name, sizeof(alt_mod_name), "stepgen-ninja.%s", name + 14);
        hal_pin_alias(name, alt_mod_name);
        if (chg && strcmp(name, alias_name) != 0) {{
            char alt_alias[128];
            snprintf(alt_alias, sizeof(alt_alias), "stepgen-ninja.%s", alias_name + 14);
            hal_pin_alias(name, alt_alias);
        }}
    }}
}}

static int bb_hal_setup_pins(module_data_t *d, int j, int comp_id,
                             char *name, uint32_t nsize)
{{
    int r;

    // --- Entradas Digitais (Pico -> LinuxCNC) ---
    for (int i = 0; i < in_pins_no; i++) {{
        memset(name, 0, nsize);
        if (i < (int)(sizeof(bb_custom_in_names) / sizeof(bb_custom_in_names[0])) &&
            bb_custom_in_names[i] && strlen(bb_custom_in_names[i]) > 0) {{
            snprintf(name, nsize, module_name ".%d.%s", j, bb_custom_in_names[i]);
        }} else {{
            snprintf(name, nsize, module_name ".%d.input.gp%d", j, input_pins[i]);
        }}
        r = hal_pin_bit_newf(HAL_OUT, &d->input[i], comp_id, name, j);
        if (r < 0) {{
            rtapi_print_msg(RTAPI_MSG_ERR,
                module_name ".%d: ERROR: pin connected export failed with err=%i\\n", j, r);
            return r;
        }}
        add_pin_aliases(name, 0);

        memset(name, 0, nsize);
        if (i < (int)(sizeof(bb_custom_in_names) / sizeof(bb_custom_in_names[0])) &&
            bb_custom_in_names[i] && strlen(bb_custom_in_names[i]) > 0) {{
            snprintf(name, nsize, module_name ".%d.%s-not", j, bb_custom_in_names[i]);
        }} else {{
            snprintf(name, nsize, module_name ".%d.input.gp%d-not", j, input_pins[i]);
        }}
        r = hal_pin_bit_newf(HAL_OUT, &d->input_not[i], comp_id, name, j);
        if (r < 0) {{
            rtapi_print_msg(RTAPI_MSG_ERR,
                module_name ".%d: ERROR: pin connected export failed with err=%i\\n", j, r);
            return r;
        }}
        add_pin_aliases(name, 1);
    }}

    // --- Saídas Digitais (LinuxCNC -> Pico) ---
    for (int i = 0; i < out_pins_no; i++) {{
        memset(name, 0, nsize);
        if (i < (int)(sizeof(bb_custom_out_names) / sizeof(bb_custom_out_names[0])) &&
            bb_custom_out_names[i] && strlen(bb_custom_out_names[i]) > 0) {{
            snprintf(name, nsize, module_name ".%d.%s", j, bb_custom_out_names[i]);
        }} else {{
            snprintf(name, nsize, module_name ".%d.output.gp%d", j, output_pins[i]);
        }}
        r = hal_pin_bit_newf(HAL_IN, &d->output[i], comp_id, name, j);
        if (r < 0) {{
            rtapi_print_msg(RTAPI_MSG_ERR,
                module_name ".%d: ERROR: pin connected export failed with err=%i\\n", j, r);
            return r;
        }}
        *d->output[i] = 0;
        add_pin_aliases(name, 0);
    }}

    return 0;
}}

static void bb_hal_process_recv(module_data_t *d)
{{
    for (uint8_t i = 0; i < in_pins_no; i++) {{
        if (input_pins[i] < 32) {{
            *d->input[i] = (rx_buffer->inputs[0] >> (input_pins[i] & 31)) & 1;
        }} else {{
            *d->input[i] = (rx_buffer->inputs[1] >> ((input_pins[i] - 32) & 31)) & 1;
        }}
        *d->input_not[i] = !(*d->input[i]);
    }}
}}

static void bb_hal_process_send(module_data_t *d)
{{
    uint32_t outs0 = 0;
    uint32_t outs1 = 0;

    for (uint8_t i = 0; i < out_pins_no; i++) {{
        if (i < 32) {{
            outs0 |= *d->output[i] == 1 ? 1u << i : 0;
        }} else {{
            outs1 |= *d->output[i] == 1 ? 1u << (i & 31) : 0;
        }}
    }}

    tx_buffer->outputs[0] = outs0;
    tx_buffer->outputs[1] = outs1;
}}

#endif // breakout_board == {breakout_id}
"""
    return code

def generate_firmware_module_c_code(data, filename="board_custom.h"):
    board_name = data.get("board_name", "Custom Board")
    breakout_id = data.get("breakout_board", 42 if ("42" in filename or "test" in filename) else 0)
    in_pins = [to_clean_pin(p, "0") for p in data.get("in_pins", [])]
    out_pins = [to_clean_pin(p, "0") for p in data.get("out_pins", [])]

    setup_lines = []
    disc_lines = []
    conn_out_lines = []
    for i, p in enumerate(out_pins):
        setup_lines.append(f"    gpio_init({p}); gpio_set_dir({p}, GPIO_OUT); gpio_put({p}, 0);")
        disc_lines.append(f"    gpio_put({p}, 0);")
        conn_out_lines.append(f"    gpio_put({p}, (output_buffer >> {i}) & 1);")

    setup_str = "\n".join(setup_lines) if setup_lines else "    // Nenhum pino de saída dedicado"
    disc_str = "\n".join(disc_lines) if disc_lines else "    // Nenhum pino de saída dedicado"
    conn_out_str = "\n".join(conn_out_lines) if conn_out_lines else "    // Nenhum pino de saída dedicado"
    num_inputs = len(in_pins)

    code = f"""#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/gpio.h"
#include "breakoutboard.h"
#include "config.h"

// ============================================================
// Breakout Board Firmware Module - {board_name}
// Arquivo correspondente: {filename}
// Gerado automaticamente pelo Stepper Ninja Board Configurator
// ============================================================

#if breakout_board == {breakout_id}

extern transmission_pc_pico_t *rx_buffer;
extern transmission_pico_pc_t *tx_buffer;
extern volatile uint32_t input_buffer[4];
extern volatile uint32_t output_buffer;

void breakout_board_setup(void) {{
{setup_str}
}}

void breakout_board_disconnected_update(void) {{
{disc_str}
}}

void breakout_board_connected_update(void) {{
    const uint8_t pins[] = in_pins;
    uint32_t status = 0;

    for (int i = 0; i < {num_inputs}; i++) {{
        if (!gpio_get(pins[i])) {{
            status |= (1u << i);
        }}
    }}
    input_buffer[0] = status | 0x80000000;

{conn_out_str}
}}

void breakout_board_handle_data(void) {{
    tx_buffer->inputs[0] = input_buffer[0];
    tx_buffer->inputs[1] = 0;
    tx_buffer->inputs[2] = 0;
    tx_buffer->inputs[3] = 0;

    output_buffer = rx_buffer->outputs[0];
}}

#endif // breakout_board == {breakout_id}
"""
    return code

def update_config_h_network(net_data, active_filename="board_custom.h"):
    if not os.path.exists(CONFIG_H_PATH):
        return
    with open(CONFIG_H_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    ip_parts = net_data.get("ip", "192.168.0.177").split(".")
    gw_parts = net_data.get("gateway", "192.168.0.1").split(".")
    sn_parts = net_data.get("subnet", "255.255.255.0").split(".")

    content = re.sub(r"#define DEFAULT_IP\s+\{[^\}]+\}", f"#define DEFAULT_IP {{{', '.join(ip_parts)}}}", content)
    content = re.sub(r"#define DEFAULT_GATEWAY\s+\{[^\}]+\}", f"#define DEFAULT_GATEWAY {{{', '.join(gw_parts)}}}", content)
    content = re.sub(r"#define DEFAULT_SUBNET\s+\{[^\}]+\}", f"#define DEFAULT_SUBNET {{{', '.join(sn_parts)}}}", content)
    content = re.sub(r"#define DEFAULT_PORT\s+\d+", f"#define DEFAULT_PORT {net_data.get('port', 8888)}", content)
    
    if "transport" in net_data:
        content = re.sub(r"#define raspberry_pi_spi\s+\d+", f"#define raspberry_pi_spi {int(net_data['transport'])}", content)

    # SPI bus settings
    def to_clean_pin(val, default):
        s = str(val).strip().upper().replace("GP", "").replace("PIN_", "")
        return s if s.isdigit() else default

    if "spi_instance" in net_data:
        content = re.sub(r"#define SPI_PORT_SELECT\s+\d+", f"#define SPI_PORT_SELECT {int(net_data['spi_instance'])}", content)
    if "spi_miso" in net_data:
        content = re.sub(r"#define GPIO_MISO\s+\w+", f"#define GPIO_MISO {to_clean_pin(net_data['spi_miso'], '16')}", content)
    if "spi_cs" in net_data:
        content = re.sub(r"#define GPIO_CS\s+\w+", f"#define GPIO_CS {to_clean_pin(net_data['spi_cs'], '17')}", content)
    if "spi_sck" in net_data:
        content = re.sub(r"#define GPIO_SCK\s+\w+", f"#define GPIO_SCK {to_clean_pin(net_data['spi_sck'], '18')}", content)
    if "spi_mosi" in net_data:
        content = re.sub(r"#define GPIO_MOSI\s+\w+", f"#define GPIO_MOSI {to_clean_pin(net_data['spi_mosi'], '19')}", content)
    if "spi_reset" in net_data:
        clean_rst = to_clean_pin(net_data['spi_reset'], '4')
        if re.search(r"#define GPIO_RESET\s+", content):
            content = re.sub(r"#define GPIO_RESET\s+\w+", f"#define GPIO_RESET {clean_rst}", content)
        else:
            content = re.sub(r"(#define GPIO_INT\s+\w+)", f"#define GPIO_RESET {clean_rst}\n\\1", content)
    if "spi_int" in net_data:
        content = re.sub(r"#define GPIO_INT\s+\w+", f"#define GPIO_INT {to_clean_pin(net_data['spi_int'], '5')}", content)

    # If the user saved a custom file, make sure SELECTED_BOARD points to it
    if active_filename == "board_chinese_bob.h":
        content = re.sub(r"#define SELECTED_BOARD\s+\w+", "#define SELECTED_BOARD BOARD_CHINESE_BOB", content)
    elif active_filename == "board_stepper_ninja_v1.h":
        content = re.sub(r"#define SELECTED_BOARD\s+\w+", "#define SELECTED_BOARD BOARD_STEPPER_NINJA_V1", content)
    elif active_filename == "board_picobob_dlx.h":
        content = re.sub(r"#define SELECTED_BOARD\s+\w+", "#define SELECTED_BOARD BOARD_PICOBOB_DLX", content)
    elif active_filename == "board_100.h":
        content = re.sub(r"#define SELECTED_BOARD\s+\w+", "#define SELECTED_BOARD BOARD_100", content)
    else:
        content = re.sub(r"#define SELECTED_BOARD\s+\w+", "#define SELECTED_BOARD BOARD_CUSTOM", content)
        custom_line = f'#define CUSTOM_BOARD_FILE "boards/{active_filename}"'
        if re.search(r"#define CUSTOM_BOARD_FILE\s+", content):
            content = re.sub(r'#define CUSTOM_BOARD_FILE\s+"[^"]+"', custom_line, content)
        else:
            content = re.sub(r'(#if SELECTED_BOARD == BOARD_CUSTOM)', f'{custom_line}\n\\1', content)

    with open(CONFIG_H_PATH, "w", encoding="utf-8") as f:
        f.write(content)

class ConfiguratorHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/config":
            from urllib.parse import parse_qs
            qs = parse_qs(parsed.query)
            target_fname = qs.get("file", [None])[0]

            net_cfg = parse_config_h()

            if not target_fname:
                sel_b = net_cfg.get("selected_board", "BOARD_CUSTOM")
                if sel_b == "BOARD_CHINESE_BOB":
                    target_fname = "board_chinese_bob.h"
                elif sel_b == "BOARD_STEPPER_NINJA_V1":
                    target_fname = "board_stepper_ninja_v1.h"
                elif sel_b == "BOARD_PICOBOB_DLX":
                    target_fname = "board_picobob_dlx.h"
                elif sel_b == "BOARD_100":
                    target_fname = "board_100.h"
                else:
                    target_fname = net_cfg.get("custom_board_file", "board_custom.h")

            target_path = os.path.join(BOARDS_DIR, target_fname)
            if not os.path.exists(target_path):
                target_fname = "board_custom.h"
                target_path = CUSTOM_BOARD_PATH

            board_cfg = parse_board_file(target_path)

            # Sync board-specific SPI settings if present
            for k in ["spi_instance", "spi_miso", "spi_cs", "spi_sck", "spi_mosi", "spi_reset", "spi_int"]:
                if k in board_cfg:
                    net_cfg[k] = board_cfg[k]

            data = {
                "board": board_cfg,
                "network": net_cfg,
                "filename": target_fname,
                "pico_pins": PICO_PINS
            }
            self.send_json(data)
        elif parsed.path == "/api/presets":
            presets = []
            if os.path.exists(BOARDS_DIR):
                for fname in sorted(os.listdir(BOARDS_DIR)):
                    if fname.endswith(".h"):
                        fpath = os.path.join(BOARDS_DIR, fname)
                        p_data = parse_board_file(fpath)
                        presets.append({
                            "filename": fname,
                            "name": p_data.get("board_name", fname),
                            "data": p_data
                        })
            self.send_json(presets)
        elif parsed.path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
        elif parsed.path == "/api/download/zip":
            zip_path = os.path.join(DIST_DIR, "stepper-ninja-pacote.zip")
            self.send_file_download(zip_path, "stepper-ninja-pacote.zip", "application/zip")
        elif parsed.path == "/api/download/uf2" or parsed.path == "/api/download/firmware":
            uf2_path = None
            for sdir in [DIST_DIR, BUILD_DIR]:
                if os.path.exists(sdir):
                    for f in sorted(os.listdir(sdir)):
                        if f.endswith(".uf2"):
                            uf2_path = os.path.join(sdir, f)
                            break
                if uf2_path:
                    break
            if uf2_path and os.path.exists(uf2_path):
                self.send_file_download(uf2_path, os.path.basename(uf2_path), "application/octet-stream")
            else:
                self.send_error(404, "Arquivo .uf2 não encontrado. Compile o firmware primeiro.")
        elif parsed.path.startswith("/api/download/"):
            target_name = os.path.basename(parsed.path[len("/api/download/"):])
            file_path = os.path.join(DIST_DIR, target_name)
            if not os.path.exists(file_path):
                # Fallback to search any .uf2 if requested
                if target_name.endswith(".uf2") or target_name == "uf2":
                    for f in os.listdir(DIST_DIR) if os.path.exists(DIST_DIR) else []:
                        if f.endswith(".uf2"):
                            file_path = os.path.join(DIST_DIR, f)
                            target_name = f
                            break
            self.send_file_download(file_path, target_name)
        elif parsed.path == "/api/open-folder":
            try:
                os.makedirs(DIST_DIR, exist_ok=True)
                env = os.environ.copy()
                if "DISPLAY" not in env:
                    env["DISPLAY"] = ":0"
                opened = False
                for tool in [["gio", "open", DIST_DIR], ["xdg-open", DIST_DIR], ["thunar", DIST_DIR], ["nautilus", DIST_DIR]]:
                    try:
                        subprocess.Popen(tool, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                        opened = True
                        break
                    except Exception:
                        continue
                self.send_json({"status": "ok", "path": DIST_DIR, "opened": opened, "message": f"Pasta: {DIST_DIR}"})
            except Exception as e:
                self.send_json({"status": "error", "message": str(e)})
        else:
            try:
                super().do_GET()
            except (BrokenPipeError, ConnectionResetError):
                pass

    def do_POST(self):
        parsed = urlparse(self.path)
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len) if content_len > 0 else b"{}"

        try:
            req_data = json.loads(body.decode("utf-8"))
        except Exception:
            req_data = {}

        if parsed.path == "/api/config":
            board_data = req_data.get("board", {})
            net_data = req_data.get("network", {})
            filename = req_data.get("filename", "board_custom.h").strip()
            if not filename.endswith(".h"):
                filename += ".h"

            target_path = os.path.join(BOARDS_DIR, filename)

            # Generate C code with SPI settings and write to the chosen board file
            c_code = generate_board_c_code(board_data, filename=filename, net_data=net_data)
            with open(target_path, "w", encoding="utf-8") as f:
                f.write(c_code)

            # Generate corresponding HAL module C code for hal-driver/modules/
            hal_code = generate_hal_module_c_code(board_data, filename=filename)
            os.makedirs(HAL_MODULES_DIR, exist_ok=True)
            with open(os.path.join(HAL_MODULES_DIR, "breakoutboard_hal_0.c"), "w", encoding="utf-8") as f:
                f.write(hal_code)
            with open(os.path.join(HAL_MODULES_DIR, "breakoutboard_hal_custom.c"), "w", encoding="utf-8") as f:
                f.write(hal_code)
            base_name = filename[:-2] if filename.endswith(".h") else filename
            board_mod_name = f"breakoutboard_hal_{base_name}.c"
            with open(os.path.join(HAL_MODULES_DIR, board_mod_name), "w", encoding="utf-8") as f:
                f.write(hal_code)

            # Generate corresponding Firmware module C code for firmware/modules/
            fw_code = generate_firmware_module_c_code(board_data, filename=filename)
            os.makedirs(FIRMWARE_MODULES_DIR, exist_ok=True)
            fw_mod_name = f"breakoutboard_{base_name}.c"
            with open(os.path.join(FIRMWARE_MODULES_DIR, fw_mod_name), "w", encoding="utf-8") as f:
                f.write(fw_code)
            breakout_id = board_data.get("breakout_board", 42 if ("42" in filename or "test" in filename) else 0)
            if breakout_id:
                with open(os.path.join(FIRMWARE_MODULES_DIR, f"breakoutboard_{breakout_id}.c"), "w", encoding="utf-8") as f:
                    f.write(fw_code)

            # Update network & transport settings in config.h
            if net_data:
                update_config_h_network(net_data, active_filename=filename)

            self.send_json({"status": "ok", "message": f"Configuração salva em {filename}, módulos HAL ({board_mod_name}) e firmware (breakoutboard_{breakout_id}.c) atualizados com sucesso!"})

        elif parsed.path == "/api/preview":
            board_data = req_data.get("board", {})
            net_data = req_data.get("network", {})
            filename = req_data.get("filename", "board_custom.h").strip()
            if not filename.endswith(".h"):
                filename += ".h"
            code = generate_board_c_code(board_data, filename=filename, net_data=net_data)
            self.send_json({"code": code, "filename": filename})

        elif parsed.path == "/api/build":
            try:
                import shutil
                mcu = req_data.get("mcu", "pico")
                wizchip = req_data.get("wizchip", "W5500")

                # Detect if CMakeCache has a different platform (RP2040 vs RP2350)
                cache_path = os.path.join(BUILD_DIR, "CMakeCache.txt")
                need_clean = False
                if os.path.exists(cache_path):
                    try:
                        with open(cache_path, "r", encoding="utf-8") as f:
                            c = f.read()
                        m_board = re.search(r"BOARD:STRING=(\w+)", c)
                        if m_board and m_board.group(1) != mcu:
                            need_clean = True
                        m_wiz = re.search(r"WIZCHIP_TYPE:STRING=(\w+)", c)
                        if m_wiz and m_wiz.group(1) != wizchip:
                            need_clean = True
                    except Exception:
                        need_clean = True

                if need_clean:
                    if os.path.exists(cache_path):
                        os.remove(cache_path)
                    cmake_files = os.path.join(BUILD_DIR, "CMakeFiles")
                    if os.path.exists(cmake_files):
                        shutil.rmtree(cmake_files)

                # 1. Run cmake
                cmake_cmd = [
                    "cmake",
                    f"-DBOARD={mcu}",
                    f"-DWIZCHIP_TYPE={wizchip}",
                    "-DSTEPPER_NINJA_RUN_FROM_RAM=ON",
                    ".."
                ]
                cmake_proc = subprocess.run(cmake_cmd, cwd=BUILD_DIR, capture_output=True, text=True, timeout=60)
                
                # If cmake still complains about incompatible platform cache, wipe build dir and re-run
                if cmake_proc.returncode != 0:
                    for item in os.listdir(BUILD_DIR):
                        item_path = os.path.join(BUILD_DIR, item)
                        try:
                            if os.path.isdir(item_path):
                                shutil.rmtree(item_path)
                            else:
                                os.remove(item_path)
                        except Exception:
                            pass
                    cmake_proc = subprocess.run(cmake_cmd, cwd=BUILD_DIR, capture_output=True, text=True, timeout=60)

                if cmake_proc.returncode != 0:
                    self.send_json({
                        "status": "error",
                        "output": f"Erro na configuração do CMake:\n{cmake_proc.stderr or cmake_proc.stdout}"
                    })
                    return

                # Run make for firmware
                cmd = ["make", "-j4"]
                res = subprocess.run(cmd, cwd=BUILD_DIR, capture_output=True, text=True, timeout=120)

                # Locate generated UF2
                target_uf2 = f"stepper-ninja-{mcu}-{wizchip}.uf2"
                uf2_path = os.path.join(BUILD_DIR, target_uf2)
                if not os.path.exists(uf2_path):
                    for f in os.listdir(BUILD_DIR):
                        if f.endswith(".uf2"):
                            target_uf2 = f
                            uf2_path = os.path.join(BUILD_DIR, f)
                            break

                size_kb = round(os.path.getsize(uf2_path) / 1024, 1) if os.path.exists(uf2_path) else 0

                if res.returncode != 0 or not os.path.exists(uf2_path):
                    self.send_json({
                        "status": "error",
                        "output": f"Erro na compilação do firmware do Pico:\n{(res.stderr or res.stdout)[-1500:]}"
                    })
                    return

                # Prepare dist folder
                os.makedirs(DIST_DIR, exist_ok=True)
                shutil.copy2(uf2_path, os.path.join(DIST_DIR, target_uf2))

                # 2. Build LinuxCNC HAL drivers
                hal_build_log = ""
                driver_files_ok = False
                copied_drivers = []
                try:
                    os.makedirs(HAL_BUILD_DIR, exist_ok=True)
                    # CMake for hal-driver
                    p_hc = subprocess.run(["cmake", "-S", HAL_DRIVER_DIR, "-B", HAL_BUILD_DIR],
                                          cwd=HAL_DRIVER_DIR, capture_output=True, text=True, timeout=60)
                    if p_hc.returncode == 0:
                        # Build stepgen-ninja and stepper-ninja modules (clean-first ensures updated header symlinks are recompiled)
                        p_hb = subprocess.run(["cmake", "--build", HAL_BUILD_DIR, "--clean-first", "--target", "stepgen-ninja", "stepper-ninja"],
                                              cwd=HAL_DRIVER_DIR, capture_output=True, text=True, timeout=120)
                        hal_build_log = (p_hb.stdout or "") + (p_hb.stderr or "")
                        if p_hb.returncode == 0:
                            driver_files_ok = True
                    else:
                        hal_build_log = p_hc.stderr or p_hc.stdout
                except Exception as e_hal:
                    hal_build_log = f"Aviso ao compilar driver HAL: {e_hal}"

                # Copy driver .so files to dist
                stepgen_so = os.path.join(HAL_BUILD_DIR, "stepgen-ninja/stepgen-ninja.so")
                stepper_so = os.path.join(HAL_BUILD_DIR, "stepper-ninja/stepper-ninja.so")
                if os.path.exists(stepgen_so):
                    shutil.copy2(stepgen_so, os.path.join(DIST_DIR, "stepgen-ninja.so"))
                    copied_drivers.append("stepgen-ninja.so")
                if os.path.exists(stepper_so):
                    shutil.copy2(stepper_so, os.path.join(DIST_DIR, "stepper-ninja.so"))
                    copied_drivers.append("stepper-ninja.so")

                # 3. Create ready-to-run install script for other computers
                install_script_path = os.path.join(DIST_DIR, "install_driver.sh")
                with open(install_script_path, "w", encoding="utf-8") as f_inst:
                    f_inst.write("""#!/usr/bin/env bash
set -e
echo "=========================================================="
echo " Instalador do Driver Stepper Ninja para LinuxCNC"
echo "=========================================================="
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST_DIR="/usr/lib/linuxcnc/modules"

if [ ! -d "$DEST_DIR" ]; then
    echo "Erro: Diretório $DEST_DIR não encontrado!"
    echo "Certifique-se de que o LinuxCNC está instalado neste computador."
    exit 1
fi

echo "Copiando módulos para $DEST_DIR..."
if [ -f "$SCRIPT_DIR/stepgen-ninja.so" ]; then
    sudo cp -v "$SCRIPT_DIR/stepgen-ninja.so" "$DEST_DIR/"
fi
if [ -f "$SCRIPT_DIR/stepper-ninja.so" ]; then
    sudo cp -v "$SCRIPT_DIR/stepper-ninja.so" "$DEST_DIR/"
fi

echo ""
echo "Driver instalado com sucesso no LinuxCNC!"
echo "=========================================================="
""")
                os.chmod(install_script_path, 0o755)

                # 4. Create LEIAME.txt with usage instructions
                readme_path = os.path.join(DIST_DIR, "LEIAME.txt")
                with open(readme_path, "w", encoding="utf-8") as f_rd:
                    f_rd.write(f"""======================================================================
PACOTE DE DISTRIBUIÇÃO - STEPPER NINJA
======================================================================
Microcontrolador:  {mcu.upper()}
Módulo Ethernet:   {wizchip}
Gerado em:         dist/

ARQUIVOS DESTE PACOTE:
1. {target_uf2} (Firmware do Raspberry Pi Pico)
   - Conecte o Pico no PC segurando o botão BOOTSEL.
   - Copie este arquivo para o drive USB 'RPI-RP2' que aparecerá.

2. stepgen-ninja.so e stepper-ninja.so (Drivers LinuxCNC)
   - Para instalar no LinuxCNC de qualquer PC, execute:
       sudo ./install_driver.sh
     (ou copie os arquivos .so para /usr/lib/linuxcnc/modules/)

3. No seu arquivo de configuração (.hal) do LinuxCNC:
   - Carregue o driver normalmente:
       loadrt stepgen-ninja ip_address="192.168.0.177"
======================================================================
""")

                # 5. Pack everything into a ZIP file
                import zipfile
                zip_path = os.path.join(DIST_DIR, "stepper-ninja-pacote.zip")
                with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
                    zf.write(os.path.join(DIST_DIR, target_uf2), target_uf2)
                    for drv in copied_drivers:
                        zf.write(os.path.join(DIST_DIR, drv), drv)
                    zf.write(install_script_path, "install_driver.sh")
                    zf.write(readme_path, "LEIAME.txt")

                zip_size_kb = round(os.path.getsize(zip_path) / 1024, 1) if os.path.exists(zip_path) else 0

                combined_log = (
                    f"--- BUILD FIRMWARE PICO ({mcu.upper()}) ---\n"
                    f"{res.stdout[-600:] if res.stdout else 'OK'}\n\n"
                    f"--- BUILD DRIVER LINUXCNC (HAL) ---\n"
                    f"{hal_build_log[-600:] if hal_build_log else 'OK'}"
                )

                self.send_json({
                    "status": "success",
                    "dist_dir": DIST_DIR,
                    "firmware_file": target_uf2,
                    "firmware_size_kb": size_kb,
                    "driver_files": copied_drivers,
                    "zip_file": "stepper-ninja-pacote.zip",
                    "zip_size_kb": zip_size_kb,
                    "output": combined_log
                })
            except Exception as e:
                self.send_json({"status": "error", "output": str(e)})
        else:
            self.send_error(404, "Endpoint not found")

    def send_file_download(self, file_path, download_name=None, content_type="application/octet-stream"):
        if not os.path.exists(file_path):
            self.send_error(404, "Arquivo não encontrado")
            return
        filename = download_name or os.path.basename(file_path)
        file_size = os.path.getsize(file_path)
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(file_size))
        self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        with open(file_path, "rb") as f:
            while True:
                chunk = f.read(65536)
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    break

    def send_json(self, data, status_code=200):
        encoded = json.dumps(data, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        try:
            self.wfile.write(encoded)
        except (BrokenPipeError, ConnectionResetError):
            pass

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server(port=8080):
    with ThreadedTCPServer(("", port), ConfiguratorHandler) as httpd:
        print(f"\n=======================================================")
        print(f" Stepper Ninja Board Configurator")
        print(f" Servidor iniciado em: http://localhost:{port}")
        print(f" Pressione Ctrl+C para encerrar")
        print(f"=======================================================\n")
        try:
            webbrowser.open(f"http://localhost:{port}")
        except Exception:
            pass
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
