/**
 * Stepper Ninja Board Configurator - Frontend Controller
 */

// 40 Pins of Raspberry Pi Pico (Pico 1 / Pico 2)
const PICO_PINS = [
  { pin: 1,  name: "GP0",  alias: "PIN_1",  type: "gpio", gp: 0 },
  { pin: 2,  name: "GP1",  alias: "PIN_2",  type: "gpio", gp: 1 },
  { pin: 3,  name: "GND",  alias: "GND",    type: "gnd" },
  { pin: 4,  name: "GP2",  alias: "PIN_4",  type: "gpio", gp: 2 },
  { pin: 5,  name: "GP3",  alias: "PIN_5",  type: "gpio", gp: 3 },
  { pin: 6,  name: "GP4",  alias: "PIN_6",  type: "gpio", gp: 4 },
  { pin: 7,  name: "GP5",  alias: "PIN_7",  type: "gpio", gp: 5 },
  { pin: 8,  name: "GND",  alias: "GND",    type: "gnd" },
  { pin: 9,  name: "GP6",  alias: "PIN_9",  type: "gpio", gp: 6 },
  { pin: 10, name: "GP7",  alias: "PIN_10", type: "gpio", gp: 7 },
  { pin: 11, name: "GP8",  alias: "PIN_11", type: "gpio", gp: 8 },
  { pin: 12, name: "GP9",  alias: "PIN_12", type: "gpio", gp: 9 },
  { pin: 13, name: "GND",  alias: "GND",    type: "gnd" },
  { pin: 14, name: "GP10", alias: "PIN_14", type: "gpio", gp: 10 },
  { pin: 15, name: "GP11", alias: "PIN_15", type: "gpio", gp: 11 },
  { pin: 16, name: "GP12", alias: "PIN_16", type: "gpio", gp: 12 },
  { pin: 17, name: "GP13", alias: "PIN_17", type: "gpio", gp: 13 },
  { pin: 18, name: "GND",  alias: "GND",    type: "gnd" },
  { pin: 19, name: "GP14", alias: "PIN_19", type: "gpio", gp: 14 },
  { pin: 20, name: "GP15", alias: "PIN_20", type: "gpio", gp: 15 },
  // Right side (Physical Pins 21 to 40)
  { pin: 21, name: "GP16", alias: "PIN_21", type: "gpio", gp: 16 },
  { pin: 22, name: "GP17", alias: "PIN_22", type: "gpio", gp: 17 },
  { pin: 23, name: "GND",  alias: "GND",    type: "gnd" },
  { pin: 24, name: "GP18", alias: "PIN_24", type: "gpio", gp: 18 },
  { pin: 25, name: "GP19", alias: "PIN_25", type: "gpio", gp: 19 },
  { pin: 26, name: "GP20", alias: "PIN_26", type: "gpio", gp: 20 },
  { pin: 27, name: "GP21", alias: "PIN_27", type: "gpio", gp: 21 },
  { pin: 28, name: "GND",  alias: "GND",    type: "gnd" },
  { pin: 29, name: "GP22", alias: "PIN_29", type: "gpio", gp: 22 },
  { pin: 30, name: "RUN",  alias: "RUN",    type: "sys" },
  { pin: 31, name: "GP26", alias: "PIN_31", type: "gpio", gp: 26 },
  { pin: 32, name: "GP27", alias: "PIN_32", type: "gpio", gp: 27 },
  { pin: 33, name: "AGND", alias: "AGND",   type: "gnd" },
  { pin: 34, name: "GP28", alias: "PIN_34", type: "gpio", gp: 28 },
  { pin: 35, name: "ADC_VREF", alias: "VREF", type: "pwr" },
  { pin: 36, name: "3V3(OUT)", alias: "3V3",  type: "pwr" },
  { pin: 37, name: "3V3_EN",   alias: "3V3_EN", type: "sys" },
  { pin: 38, name: "GND",      alias: "GND",    type: "gnd" },
  { pin: 39, name: "VSYS",     alias: "VSYS",   type: "pwr" },
  { pin: 40, name: "VBUS (5V)",alias: "VBUS",   type: "pwr" }
];

// Available GPIO options for select boxes
const GPIO_OPTIONS = [
  { alias: "PIN_NULL", label: "Nenhum (PIN_NULL)", gp: null },
  { alias: "PIN_1",  label: "Pino 1 (GP0)",   gp: 0 },
  { alias: "PIN_2",  label: "Pino 2 (GP1)",   gp: 1 },
  { alias: "PIN_4",  label: "Pino 4 (GP2)",   gp: 2 },
  { alias: "PIN_5",  label: "Pino 5 (GP3)",   gp: 3 },
  { alias: "PIN_6",  label: "Pino 6 (GP4)",   gp: 4 },
  { alias: "PIN_7",  label: "Pino 7 (GP5)",   gp: 5 },
  { alias: "PIN_9",  label: "Pino 9 (GP6)",   gp: 6 },
  { alias: "PIN_10", label: "Pino 10 (GP7)",  gp: 7 },
  { alias: "PIN_11", label: "Pino 11 (GP8)",  gp: 8 },
  { alias: "PIN_12", label: "Pino 12 (GP9)",  gp: 9 },
  { alias: "PIN_14", label: "Pino 14 (GP10)", gp: 10 },
  { alias: "PIN_15", label: "Pino 15 (GP11)", gp: 11 },
  { alias: "PIN_16", label: "Pino 16 (GP12)", gp: 12 },
  { alias: "PIN_17", label: "Pino 17 (GP13)", gp: 13 },
  { alias: "PIN_19", label: "Pino 19 (GP14)", gp: 14 },
  { alias: "PIN_20", label: "Pino 20 (GP15)", gp: 15 },
  { alias: "PIN_21", label: "Pino 21 (GP16)", gp: 16 },
  { alias: "PIN_22", label: "Pino 22 (GP17)", gp: 17 },
  { alias: "PIN_24", label: "Pino 24 (GP18)", gp: 18 },
  { alias: "PIN_25", label: "Pino 25 (GP19)", gp: 19 },
  { alias: "PIN_26", label: "Pino 26 (GP20)", gp: 20 },
  { alias: "PIN_27", label: "Pino 27 (GP21)", gp: 21 },
  { alias: "PIN_29", label: "Pino 29 (GP22)", gp: 22 },
  { alias: "PIN_31", label: "Pino 31 (GP26)", gp: 26 },
  { alias: "PIN_32", label: "Pino 32 (GP27)", gp: 27 },
  { alias: "PIN_34", label: "Pino 34 (GP28)", gp: 28 }
];

// Helper to normalize pin representations (PIN_xx, GPxx, numeric) into standard PIN_xx alias
function normalizePinAlias(val) {
  if (val === undefined || val === null) return "PIN_NULL";
  const s = String(val).trim().toUpperCase();
  if (!s || s === "PIN_NULL" || s === "GP_NULL" || s === "NULL" || s === "NONE") return "PIN_NULL";
  if (s === "PIN_23") return "PIN_24"; // Retrocompatibilidade com antigo alias GP18
  const direct = GPIO_OPTIONS.find(o => o.alias === s);
  if (direct) return direct.alias;
  if (s.startsWith("GP")) {
    const num = parseInt(s.replace("GP", ""), 10);
    const byGp = GPIO_OPTIONS.find(o => o.gp === num);
    if (byGp) return byGp.alias;
  }
  const n = parseInt(s, 10);
  if (!isNaN(n)) {
    const byPin = GPIO_OPTIONS.find(o => o.alias === `PIN_${n}`);
    if (byPin) return byPin.alias;
    const byGp = GPIO_OPTIONS.find(o => o.gp === n);
    if (byGp) return byGp.alias;
  }
  return "PIN_NULL";
}

const SPI_PRESETS = {
  spi0_pico_w: {
    instance: 0,
    miso: "PIN_1", cs: "PIN_2", sck: "PIN_4", mosi: "PIN_5", reset: "PIN_6", int: "PIN_7",
    miso_gp: "GP0", cs_gp: "GP1", sck_gp: "GP2", mosi_gp: "GP3", reset_gp: "GP4", int_gp: "GP5",
    label: "SPI0 (Pico / Pico 2W: GP0-GP3, RST GP4, INT GP5)"
  },
  spi0_def: {
    instance: 0,
    miso: "PIN_21", cs: "PIN_22", sck: "PIN_24", mosi: "PIN_25", reset: "PIN_26", int: "PIN_27",
    miso_gp: "GP16", cs_gp: "GP17", sck_gp: "GP18", mosi_gp: "GP19", reset_gp: "GP20", int_gp: "GP21",
    label: "SPI0 Padrão (GP16-GP19, RST GP20, INT GP21)"
  },
  spi0_alt_b: {
    instance: 0,
    miso: "PIN_6", cs: "PIN_7", sck: "PIN_9", mosi: "PIN_10", reset: "PIN_11", int: "PIN_12",
    miso_gp: "GP4", cs_gp: "GP5", sck_gp: "GP6", mosi_gp: "GP7", reset_gp: "GP8", int_gp: "GP9",
    label: "SPI0 Alternativo B (GP4-GP7, RST GP8, INT GP9)"
  },
  spi1_def: {
    instance: 1,
    miso: "PIN_11", cs: "PIN_12", sck: "PIN_14", mosi: "PIN_15", reset: "PIN_16", int: "PIN_17",
    miso_gp: "GP8", cs_gp: "GP9", sck_gp: "GP10", mosi_gp: "GP11", reset_gp: "GP12", int_gp: "GP13",
    label: "SPI1 Padrão (GP8-GP11, RST GP12, INT GP13)"
  },
  spi1_alt_a: {
    instance: 1,
    miso: "PIN_16", cs: "PIN_17", sck: "PIN_19", mosi: "PIN_20", reset: "PIN_26", int: "PIN_29",
    miso_gp: "GP12", cs_gp: "GP13", sck_gp: "GP14", mosi_gp: "GP15", reset_gp: "GP20", int_gp: "GP22",
    label: "SPI1 Alternativo A (GP12-GP15, RST GP20, INT GP22)"
  },
  spi1_alt_b: {
    instance: 1,
    miso: "PIN_34", cs: "PIN_29", sck: "PIN_31", mosi: "PIN_32", reset: "PIN_27", int: "PIN_26",
    miso_gp: "GP28", cs_gp: "GP22", sck_gp: "GP26", mosi_gp: "GP27", reset_gp: "GP21", int_gp: "GP20",
    label: "SPI1 Alternativo B (GP26-GP28, RST GP21, INT GP20)"
  }
};

// Global State
let appData = {
  board_filename: "board_custom.h",
  pin_filter: "all",
  board: {
    board_name: "Custom GPIO Board",
    stepgens: 4,
    stepgen_steps: ["PIN_1", "PIN_4", "PIN_6", "PIN_9"],
    stepgen_dirs: ["PIN_2", "PIN_5", "PIN_7", "PIN_10"],
    step_invert: [0, 0, 0, 0],
    default_pulse_width: 2000,
    default_step_scale: 1000,
    encoders: 0,
    enc_pins: [],
    enc_index_pins: [],
    enc_index_active_level: [],
    in_pins: ["PIN_29", "PIN_31", "PIN_32", "PIN_34"],
    in_pullup: [1, 1, 1, 1],
    in_pin_names: ["probe", "estop", "limit_x", "limit_y"],
    out_pins: ["PIN_11"],
    out_pin_names: ["spindle"],
    use_pwm: 0,
    pwm_count: 1,
    pwm_pins: ["PIN_NULL"],
    pwm_invert: [0],
    default_pwm_frequency: 10000,
    default_pwm_maxscale: 4096
  },
  network: {
    ip: "192.168.0.177",
    gateway: "192.168.0.1",
    subnet: "255.255.255.0",
    port: 8888,
    transport: 0,
    mcu: "pico",
    wizchip: "W5500",
    spi_instance: 0,
    spi_preset: "spi0_pico_w",
    spi_miso: "GP0",
    spi_cs: "GP1",
    spi_sck: "GP2",
    spi_mosi: "GP3",
    spi_reset: "GP4",
    spi_int: "GP5",
    selected_board: "BOARD_CUSTOM"
  }
};

// DOM Init
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  loadInitialConfig();
  loadPresetsList();
  setupEventListeners();
});

// Setup tab buttons
function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
      
      btn.classList.add("active");
      const tabId = "tab-" + btn.dataset.tab;
      const targetPane = document.getElementById(tabId);
      if (targetPane) targetPane.classList.add("active");
    });
  });
}

// Normalize all board pin arrays (remapping legacy PIN_23 -> PIN_24 and raw numbers)
function normalizeBoardPins(b) {
  if (!b) return;
  if (Array.isArray(b.stepgen_steps)) {
    b.stepgen_steps = b.stepgen_steps.map(p => normalizePinAlias(p));
  }
  if (Array.isArray(b.stepgen_dirs)) {
    b.stepgen_dirs = b.stepgen_dirs.map(p => normalizePinAlias(p));
  }
  if (Array.isArray(b.enc_pins)) {
    b.enc_pins = b.enc_pins.map(p => normalizePinAlias(p));
  }
  if (Array.isArray(b.enc_index_pins)) {
    b.enc_index_pins = b.enc_index_pins.map(p => normalizePinAlias(p));
  }
  if (Array.isArray(b.in_pins)) {
    b.in_pins = b.in_pins.map(p => normalizePinAlias(p));
  }
  if (Array.isArray(b.out_pins)) {
    b.out_pins = b.out_pins.map(p => normalizePinAlias(p));
  }
  if (Array.isArray(b.pwm_pins)) {
    b.pwm_pins = b.pwm_pins.map(p => normalizePinAlias(p));
  }
}

// Fetch Initial Config from backend
async function loadInitialConfig() {
  try {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error("Falha ao carregar configuração");
    const data = await res.json();
    if (data.board) {
      normalizeBoardPins(data.board);
      appData.board = data.board;
    }
    if (data.network) appData.network = data.network;
    if (data.filename) appData.board_filename = data.filename;

    populateForm();
    renderPinout();
    updateCodePreview();
  } catch (err) {
    showToast("Erro ao carregar dados: " + err.message);
  }
}

// Fetch Presets list
async function loadPresetsList() {
  try {
    const res = await fetch("/api/presets");
    if (!res.ok) return;
    const presets = await res.json();
    const select = document.getElementById("presetSelect");
    select.innerHTML = '<option value="">-- Carregar Placas Prontas --</option>';
    presets.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.filename;
      opt.textContent = `${p.name} (${p.filename})`;
      opt.dataset.filename = p.filename;
      opt.dataset.preset = JSON.stringify(p.data);
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      const selected = select.selectedOptions[0];
      if (selected && selected.dataset.preset) {
        const presetData = JSON.parse(selected.dataset.preset);
        const filename = selected.dataset.filename || "board_custom.h";
        applyPreset(presetData, filename);
      }
    });
  } catch (err) {
    console.error("Presets error:", err);
  }
}

function applyPreset(pData, filename) {
  normalizeBoardPins(pData);
  appData.board = Object.assign({}, appData.board, pData);
  appData.board_filename = filename;

  // If preset has SPI settings, sync to appData.network
  if (pData.spi_miso) appData.network.spi_miso = pData.spi_miso;
  if (pData.spi_cs)   appData.network.spi_cs = pData.spi_cs;
  if (pData.spi_sck)  appData.network.spi_sck = pData.spi_sck;
  if (pData.spi_mosi) appData.network.spi_mosi = pData.spi_mosi;
  if (pData.spi_reset)appData.network.spi_reset = pData.spi_reset;
  if (pData.spi_int)  appData.network.spi_int = pData.spi_int;
  if (pData.spi_instance !== undefined) appData.network.spi_instance = pData.spi_instance;

  populateForm();
  renderPinout();
  updateCodePreview();
  showToast(`Preset "${pData.board_name || 'Placa'}" carregado! Arquivo: ${filename}`);
}

function detectSpiPreset() {
  const n = appData.network;
  const curMiso = normalizePinAlias(n.spi_miso);
  const curCs   = normalizePinAlias(n.spi_cs);
  const curSck  = normalizePinAlias(n.spi_sck);
  const curMosi = normalizePinAlias(n.spi_mosi);
  const curReset= normalizePinAlias(n.spi_reset);
  const curInt  = normalizePinAlias(n.spi_int);

  for (const [key, preset] of Object.entries(SPI_PRESETS)) {
    if (preset.instance === n.spi_instance &&
        preset.miso === curMiso &&
        preset.cs   === curCs &&
        preset.sck  === curSck &&
        preset.mosi === curMosi &&
        (!preset.reset || preset.reset === curReset) &&
        (!preset.int || preset.int === curInt)) {
      return key;
    }
  }
  return "custom";
}

function populateSpiPinSelects() {
  const n = appData.network;
  const misoEl = document.getElementById("spiMisoPin");
  const csEl = document.getElementById("spiCsPin");
  const sckEl = document.getElementById("spiSckPin");
  const mosiEl = document.getElementById("spiMosiPin");
  const rstEl = document.getElementById("spiResetPin");
  const intEl = document.getElementById("spiIntPin");

  if (!misoEl || !csEl || !sckEl || !mosiEl || !rstEl || !intEl) return;

  populatePinSelect(misoEl, normalizePinAlias(n.spi_miso || "PIN_1"));
  populatePinSelect(csEl,   normalizePinAlias(n.spi_cs   || "PIN_2"));
  populatePinSelect(sckEl,  normalizePinAlias(n.spi_sck  || "PIN_4"));
  populatePinSelect(mosiEl, normalizePinAlias(n.spi_mosi || "PIN_5"));
  populatePinSelect(rstEl,  normalizePinAlias(n.spi_reset|| "PIN_6"));
  populatePinSelect(intEl,  normalizePinAlias(n.spi_int  || "PIN_7"));
}

// Populate UI form from state
function populateForm() {
  const b = appData.board;
  const n = appData.network;

  // Board Name & Filename
  document.getElementById("boardName").value = b.board_name || "Custom GPIO Board";
  document.getElementById("boardFilename").value = appData.board_filename || "board_custom.h";
  document.getElementById("previewFilename").textContent = appData.board_filename || "board_custom.h";

  // MCU Choice
  const mcuVal = n.mcu || "pico";
  document.querySelectorAll('input[name="mcuChoice"]').forEach(r => {
    r.checked = (r.value === mcuVal);
    r.closest('.radio-card').classList.toggle('active', r.checked);
  });

  // Transport Choice
  const transVal = (n.transport !== undefined) ? String(n.transport) : "0";
  document.querySelectorAll('input[name="transportChoice"]').forEach(r => {
    r.checked = (r.value === transVal);
    r.closest('.radio-card').classList.toggle('active', r.checked);
  });

  // Wizchip Choice
  const wizVal = n.wizchip || "W5500";
  document.querySelectorAll('input[name="wizchipChoice"]').forEach(r => {
    r.checked = (r.value === wizVal);
    r.closest('.radio-card').classList.toggle('active', r.checked);
  });

  // SPI Instance Choice
  const spiInstVal = String(n.spi_instance !== undefined ? n.spi_instance : 0);
  document.querySelectorAll('input[name="spiInstanceChoice"]').forEach(r => {
    r.checked = (r.value === spiInstVal);
    r.closest('.radio-card').classList.toggle('active', r.checked);
  });

  // SPI Pin Preset & Individual Selects
  const spiPresetEl = document.getElementById("spiPinPreset");
  if (spiPresetEl) {
    let matched = detectSpiPreset();
    if (!n.spi_miso) {
      matched = n.spi_preset || ((n.spi_instance === 1) ? "spi1_def" : "spi0_pico_w");
      const cfg = SPI_PRESETS[matched];
      if (cfg) {
        n.spi_miso = cfg.miso_gp;
        n.spi_cs = cfg.cs_gp;
        n.spi_sck = cfg.sck_gp;
        n.spi_mosi = cfg.mosi_gp;
        n.spi_reset = cfg.reset_gp;
        n.spi_int = cfg.int_gp;
      }
    }
    n.spi_preset = matched;
    spiPresetEl.value = matched;
  }
  populateSpiPinSelects();

  updateTransportVisibility();

  // Pulse & Scale
  document.getElementById("pulseWidth").value = b.default_pulse_width || 2000;
  document.getElementById("stepScale").value = b.default_step_scale || 1000;

  // PWM
  document.getElementById("usePwm").checked = (b.use_pwm === 1);
  document.getElementById("pwmFreq").value = b.default_pwm_frequency || 10000;
  document.getElementById("pwmMaxscale").value = b.default_pwm_maxscale || 4096;
  document.getElementById("pwmInvert").checked = (b.pwm_invert && b.pwm_invert[0] === 1);
  populatePinSelect(document.getElementById("pwmPin"), (b.pwm_pins && b.pwm_pins[0]) || "PIN_NULL");

  // Network
  document.getElementById("netIp").value = n.ip || "192.168.0.177";
  document.getElementById("netGateway").value = n.gateway || "192.168.0.1";
  document.getElementById("netSubnet").value = n.subnet || "255.255.255.0";
  document.getElementById("netPort").value = n.port || 8888;

  renderStepgenList();
  renderEncoderList();
  renderInputList();
  renderOutputList();
}

function updateTransportVisibility() {
  const isSpi = (appData.network.transport === 1);
  const wizSec = document.getElementById("wizchipSection");
  const netSec = document.getElementById("netIpSection");
  const transBadge = document.getElementById("transportBadgeHeader");
  const legendText = document.getElementById("legendSpiText");

  const spiKey = appData.network.spi_preset || (appData.network.spi_instance === 1 ? "spi1_def" : "spi0_pico_w");
  let spiShort = "Custom";
  if (SPI_PRESETS[spiKey]) {
    spiShort = SPI_PRESETS[spiKey].label.split(':')[0].replace(" Alternativo", " Alt");
  } else if (spiKey === "custom") {
    spiShort = `SPI${appData.network.spi_instance} Custom (${appData.network.spi_miso || 'GP0'}, ${appData.network.spi_cs || 'GP1'})`;
  }

  if (isSpi) {
    if (wizSec) wizSec.style.display = "none";
    if (netSec) netSec.style.display = "none";
    if (transBadge) transBadge.textContent = `RPi SPI (${spiShort})`;
    if (legendText) legendText.textContent = `RPi SPI (${spiShort})`;
  } else {
    if (wizSec) wizSec.style.display = "block";
    if (netSec) netSec.style.display = "block";
    const chip = appData.network.wizchip || "W5500";
    if (transBadge) transBadge.textContent = `Ethernet ${chip} (${spiShort})`;
    if (legendText) legendText.textContent = `${chip} SPI (${spiShort})`;
  }
}

function checkConsecutive(stepAlias, dirAlias) {
  const stepOpt = GPIO_OPTIONS.find(o => o.alias === stepAlias);
  const dirOpt = GPIO_OPTIONS.find(o => o.alias === dirAlias);
  if (!stepOpt || !dirOpt || stepOpt.gp === null || dirOpt.gp === null) {
    return { ok: false, msg: "Selecione Step e Dir", stepGp: null, dirGp: null };
  }
  const diff = Math.abs(stepOpt.gp - dirOpt.gp);
  const isConsecutive = (diff === 1);
  return {
    ok: isConsecutive,
    stepGp: stepOpt.gp,
    dirGp: dirOpt.gp,
    msg: isConsecutive 
      ? `✓ Consecutivos (GP${stepOpt.gp} e GP${dirOpt.gp})` 
      : `⚠️ Não Consecutivos (GP${stepOpt.gp} / GP${dirOpt.gp})`
  };
}

// Render Step Generators Cards
function renderStepgenList() {
  const container = document.getElementById("stepgenList");
  container.innerHTML = "";
  const count = appData.board.stepgens || 0;
  const axes = ["X", "Y", "Z", "A", "B", "C", "U", "V"];

  for (let i = 0; i < count; i++) {
    const axisName = axes[i] || `Eixo ${i+1}`;
    const status = checkConsecutive(appData.board.stepgen_steps[i], appData.board.stepgen_dirs[i]);
    const card = document.createElement("div");
    card.className = "item-card" + (!status.ok && status.stepGp !== null ? " has-conflict" : "");
    card.innerHTML = `
      <div class="item-card-header">
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
          <h5>${axisName} - Step Generator #${i}</h5>
          <span class="consecutive-badge ${status.ok ? 'ok' : 'warn'}">${status.msg}</span>
        </div>
        <div class="item-card-header-actions">
          <button class="btn-swap btn-swap-stepgen" data-index="${i}" title="Inverter Step e Dir deste eixo">⇄ Inverter Step/Dir</button>
          <button class="btn-danger-sm btn-del-stepgen" data-index="${i}">Remover</button>
        </div>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Pino Step (Pulso):</label>
          <select class="pin-select sel-step" data-index="${i}"></select>
        </div>
        <div class="form-group">
          <label>Pino Dir (Direção):</label>
          <select class="pin-select sel-dir" data-index="${i}"></select>
        </div>
        <div class="form-group checkbox-group" style="margin-top: 22px;">
          <input type="checkbox" id="inv_step_${i}" class="chk-inv-step" data-index="${i}" ${appData.board.step_invert[i] === 1 ? 'checked' : ''}>
          <label for="inv_step_${i}">Inverter Pulso</label>
        </div>
      </div>
    `;
    container.appendChild(card);

    populatePinSelect(card.querySelector(".sel-step"), appData.board.stepgen_steps[i] || "PIN_NULL");
    populatePinSelect(card.querySelector(".sel-dir"), appData.board.stepgen_dirs[i] || "PIN_NULL");
  }

  container.querySelectorAll(".btn-del-stepgen").forEach(btn => {
    btn.addEventListener("click", () => removeStepgen(parseInt(btn.dataset.index)));
  });

  container.querySelectorAll(".btn-swap-stepgen").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      const temp = appData.board.stepgen_steps[idx];
      appData.board.stepgen_steps[idx] = appData.board.stepgen_dirs[idx];
      appData.board.stepgen_dirs[idx] = temp;
      renderStepgenList();
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-step").forEach(sel => {
    sel.addEventListener("change", () => {
      const idx = parseInt(sel.dataset.index);
      appData.board.stepgen_steps[idx] = sel.value;
      
      // Auto-suggest consecutive pin for Dir if not set or invalid
      const stepOpt = GPIO_OPTIONS.find(o => o.alias === sel.value);
      if (stepOpt && stepOpt.gp !== null) {
        const curDir = appData.board.stepgen_dirs[idx];
        const dirOpt = GPIO_OPTIONS.find(o => o.alias === curDir);
        if (!dirOpt || dirOpt.gp === null || Math.abs(dirOpt.gp - stepOpt.gp) !== 1) {
          // Look for gp + 1 first, else gp - 1
          const nextOpt = GPIO_OPTIONS.find(o => o.gp === stepOpt.gp + 1 && !o.reserved) ||
                          GPIO_OPTIONS.find(o => o.gp === stepOpt.gp - 1 && !o.reserved);
          if (nextOpt) {
            appData.board.stepgen_dirs[idx] = nextOpt.alias;
          }
        }
      }

      renderStepgenList();
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-dir").forEach(sel => {
    sel.addEventListener("change", () => {
      const idx = parseInt(sel.dataset.index);
      appData.board.stepgen_dirs[idx] = sel.value;
      renderStepgenList();
      onDataChanged();
    });
  });

  container.querySelectorAll(".chk-inv-step").forEach(chk => {
    chk.addEventListener("change", () => {
      appData.board.step_invert[parseInt(chk.dataset.index)] = chk.checked ? 1 : 0;
      onParamChanged();
    });
  });
}

function removeStepgen(idx) {
  appData.board.stepgen_steps.splice(idx, 1);
  appData.board.stepgen_dirs.splice(idx, 1);
  appData.board.step_invert.splice(idx, 1);
  appData.board.stepgens = appData.board.stepgen_steps.length;
  renderStepgenList();
  onDataChanged();
}

function addStepgen() {
  appData.board.stepgen_steps.push("PIN_NULL");
  appData.board.stepgen_dirs.push("PIN_NULL");
  appData.board.step_invert.push(0);
  appData.board.stepgens = appData.board.stepgen_steps.length;
  renderStepgenList();
  onDataChanged();
}

// Render Encoders Cards
function renderEncoderList() {
  const container = document.getElementById("encoderList");
  container.innerHTML = "";
  const count = appData.board.encoders || 0;

  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-card-header">
        <h5>Encoder #${i} (Spindle / Feedback)</h5>
        <button class="btn-danger-sm btn-del-enc" data-index="${i}">Remover</button>
      </div>
      <div class="form-grid">
        <div class="form-group">
          <label>Pino Base (Fase A / B):</label>
          <select class="pin-select sel-enc-base" data-index="${i}"></select>
          <small>Consome este pino (A) e o próximo (B)</small>
        </div>
        <div class="form-group">
          <label>Pino Index Z:</label>
          <select class="pin-select sel-enc-index" data-index="${i}"></select>
        </div>
        <div class="form-group">
          <label>Nível Ativo do Index:</label>
          <select class="sel-enc-lvl" data-index="${i}">
            <option value="high" ${appData.board.enc_index_active_level[i] === 'high' ? 'selected' : ''}>High (Ativo Alto)</option>
            <option value="low" ${appData.board.enc_index_active_level[i] === 'low' ? 'selected' : ''}>Low (Ativo Baixo)</option>
          </select>
        </div>
      </div>
    `;
    container.appendChild(card);

    populatePinSelect(card.querySelector(".sel-enc-base"), appData.board.enc_pins[i] || "PIN_NULL");
    populatePinSelect(card.querySelector(".sel-enc-index"), appData.board.enc_index_pins[i] || "PIN_NULL");
  }

  container.querySelectorAll(".btn-del-enc").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      appData.board.enc_pins.splice(idx, 1);
      appData.board.enc_index_pins.splice(idx, 1);
      appData.board.enc_index_active_level.splice(idx, 1);
      appData.board.encoders = appData.board.enc_pins.length;
      renderEncoderList();
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-enc-base").forEach(sel => {
    sel.addEventListener("change", () => {
      appData.board.enc_pins[parseInt(sel.dataset.index)] = sel.value;
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-enc-index").forEach(sel => {
    sel.addEventListener("change", () => {
      appData.board.enc_index_pins[parseInt(sel.dataset.index)] = sel.value;
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-enc-lvl").forEach(sel => {
    sel.addEventListener("change", () => {
      appData.board.enc_index_active_level[parseInt(sel.dataset.index)] = sel.value;
      onDataChanged();
    });
  });
}

function addEncoder() {
  appData.board.enc_pins.push("PIN_NULL");
  appData.board.enc_index_pins.push("PIN_NULL");
  appData.board.enc_index_active_level.push("high");
  appData.board.encoders = appData.board.enc_pins.length;
  renderEncoderList();
  onDataChanged();
}

// Render Inputs List
function renderInputList() {
  const container = document.getElementById("inputList");
  container.innerHTML = "";
  const pins = appData.board.in_pins || [];
  if (!appData.board.in_pin_names) appData.board.in_pin_names = [];

  const inChips = ["estop", "probe", "arc-ok", "up", "down", "fim-curso", "pause", "limit_x", "limit_y"];

  pins.forEach((pin, i) => {
    const card = document.createElement("div");
    card.className = "item-card";
    const pullVal = appData.board.in_pullup[i] !== undefined ? appData.board.in_pullup[i] : 1;
    const halName = appData.board.in_pin_names[i] || "";

    const chipsHtml = inChips.map(c => `
      <span class="hal-chip ${halName === c ? 'active' : ''}" data-target="in" data-index="${i}" data-val="${c}">
        ${halName === c ? '✓ ' : ''}${c}
      </span>
    `).join("");

    card.innerHTML = `
      <div class="item-card-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h5>Entrada Digital #${i}</h5>
          ${halName ? `<span class="hal-name-badge">.${halName}</span>` : ''}
        </div>
        <button class="btn-danger-sm btn-del-in" data-index="${i}">Remover</button>
      </div>
      <div class="form-grid-input">
        <div class="form-group form-group-gpio">
          <label>Pino GPIO:</label>
          <select class="pin-select sel-in-pin" data-index="${i}"></select>
        </div>
        <div class="form-group form-group-pull">
          <label>Resistor Interno:</label>
          <select class="sel-in-pull" data-index="${i}">
            <option value="1" ${pullVal == 1 ? 'selected' : ''}>Pull-Up Interno (Ativo GND)</option>
            <option value="-1" ${pullVal == -1 ? 'selected' : ''}>Pull-Down Interno</option>
            <option value="0" ${pullVal == 0 ? 'selected' : ''}>Nenhum (Flutuante / Externo)</option>
          </select>
        </div>
        <div class="form-group form-group-hal">
          <label>Nome no LinuxCNC HAL (Opcional):</label>
          <input type="text" class="input-hal-name" data-index="${i}" placeholder="ex: estop, probe, limit_x, arc_ok" value="${halName}">
          <div class="hal-tag-chips">
            ${chipsHtml}
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
    populatePinSelect(card.querySelector(".sel-in-pin"), pin);
  });

  container.querySelectorAll(".btn-del-in").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      appData.board.in_pins.splice(idx, 1);
      appData.board.in_pullup.splice(idx, 1);
      if (appData.board.in_pin_names) appData.board.in_pin_names.splice(idx, 1);
      renderInputList();
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-in-pin").forEach(sel => {
    sel.addEventListener("change", () => {
      appData.board.in_pins[parseInt(sel.dataset.index)] = sel.value;
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-in-pull").forEach(sel => {
    sel.addEventListener("change", () => {
      appData.board.in_pullup[parseInt(sel.dataset.index)] = parseInt(sel.value);
      onDataChanged();
    });
  });

  container.querySelectorAll(".input-hal-name").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const idx = parseInt(e.target.dataset.index);
      while (appData.board.in_pin_names.length <= idx) appData.board.in_pin_names.push("");
      const val = e.target.value.trim();
      appData.board.in_pin_names[idx] = val;

      const card = inp.closest(".item-card");
      const badgeWrap = card.querySelector(".item-card-header > div");
      let badge = badgeWrap.querySelector(".hal-name-badge");
      if (val) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "hal-name-badge";
          badgeWrap.appendChild(badge);
        }
        badge.textContent = `.${val}`;
      } else if (badge) {
        badge.remove();
      }

      card.querySelectorAll('.hal-chip[data-target="in"]').forEach(chip => {
        const isMatch = (chip.dataset.val === val);
        chip.classList.toggle("active", isMatch);
        chip.textContent = (isMatch ? '✓ ' : '') + chip.dataset.val;
      });

      onNameChanged();
    });
  });

  container.querySelectorAll('.hal-chip[data-target="in"]').forEach(chip => {
    chip.addEventListener("click", () => {
      const idx = parseInt(chip.dataset.index);
      while (appData.board.in_pin_names.length <= idx) appData.board.in_pin_names.push("");
      const cur = appData.board.in_pin_names[idx];
      const clickedVal = chip.dataset.val;

      // Toggle off if already active!
      if (cur === clickedVal) {
        appData.board.in_pin_names[idx] = "";
      } else {
        appData.board.in_pin_names[idx] = clickedVal;
      }

      renderInputList();
      onNameChanged();
    });
  });
}

function addInput() {
  appData.board.in_pins.push("PIN_NULL");
  appData.board.in_pullup.push(1);
  if (!appData.board.in_pin_names) appData.board.in_pin_names = [];
  appData.board.in_pin_names.push("");
  renderInputList();
  onDataChanged();
}

// Render Outputs List
function renderOutputList() {
  const container = document.getElementById("outputList");
  container.innerHTML = "";
  const pins = appData.board.out_pins || [];
  if (!appData.board.out_pin_names) appData.board.out_pin_names = [];

  const outChips = ["arc-enable", "aux-out", "torch-on", "spindle", "coolant", "enable"];

  pins.forEach((pin, i) => {
    const card = document.createElement("div");
    card.className = "item-card";
    const halName = appData.board.out_pin_names[i] || "";

    const chipsHtml = outChips.map(c => `
      <span class="hal-chip ${halName === c ? 'active' : ''}" data-target="out" data-index="${i}" data-val="${c}">
        ${halName === c ? '✓ ' : ''}${c}
      </span>
    `).join("");

    card.innerHTML = `
      <div class="item-card-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h5>Saída Digital #${i}</h5>
          ${halName ? `<span class="hal-name-badge">.${halName}</span>` : ''}
        </div>
        <button class="btn-danger-sm btn-del-out" data-index="${i}">Remover</button>
      </div>
      <div class="form-grid-input">
        <div class="form-group">
          <label>Pino GPIO:</label>
          <select class="pin-select sel-out-pin" data-index="${i}"></select>
        </div>
        <div class="form-group">
          <label>Nome no LinuxCNC HAL (Opcional):</label>
          <input type="text" class="output-hal-name" data-index="${i}" placeholder="ex: spindle, torch_on, coolant" value="${halName}">
          <div class="hal-tag-chips">
            ${chipsHtml}
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
    populatePinSelect(card.querySelector(".sel-out-pin"), pin);
  });

  container.querySelectorAll(".btn-del-out").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      appData.board.out_pins.splice(idx, 1);
      if (appData.board.out_pin_names) appData.board.out_pin_names.splice(idx, 1);
      renderOutputList();
      onDataChanged();
    });
  });

  container.querySelectorAll(".sel-out-pin").forEach(sel => {
    sel.addEventListener("change", () => {
      appData.board.out_pins[parseInt(sel.dataset.index)] = sel.value;
      onDataChanged();
    });
  });

  container.querySelectorAll(".output-hal-name").forEach(inp => {
    inp.addEventListener("input", (e) => {
      const idx = parseInt(e.target.dataset.index);
      while (appData.board.out_pin_names.length <= idx) appData.board.out_pin_names.push("");
      const val = e.target.value.trim();
      appData.board.out_pin_names[idx] = val;

      const card = inp.closest(".item-card");
      const badgeWrap = card.querySelector(".item-card-header > div");
      let badge = badgeWrap.querySelector(".hal-name-badge");
      if (val) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "hal-name-badge";
          badgeWrap.appendChild(badge);
        }
        badge.textContent = `.${val}`;
      } else if (badge) {
        badge.remove();
      }

      card.querySelectorAll('.hal-chip[data-target="out"]').forEach(chip => {
        const isMatch = (chip.dataset.val === val);
        chip.classList.toggle("active", isMatch);
        chip.textContent = (isMatch ? '✓ ' : '') + chip.dataset.val;
      });

      onNameChanged();
    });
  });

  container.querySelectorAll('.hal-chip[data-target="out"]').forEach(chip => {
    chip.addEventListener("click", () => {
      const idx = parseInt(chip.dataset.index);
      while (appData.board.out_pin_names.length <= idx) appData.board.out_pin_names.push("");
      const cur = appData.board.out_pin_names[idx];
      const clickedVal = chip.dataset.val;

      // Toggle off if already active!
      if (cur === clickedVal) {
        appData.board.out_pin_names[idx] = "";
      } else {
        appData.board.out_pin_names[idx] = clickedVal;
      }

      renderOutputList();
      onNameChanged();
    });
  });
}

function addOutput() {
  appData.board.out_pins.push("PIN_NULL");
  if (!appData.board.out_pin_names) appData.board.out_pin_names = [];
  appData.board.out_pin_names.push("");
  renderOutputList();
  onDataChanged();
}

// Map assigned functions to pin numbers
function getPinAssignments() {
  const map = {};
  const conflicts = [];
  const b = appData.board;
  const isSpi = (appData.network.transport === 1);

  // Active SPI config
  const spiKey = appData.network.spi_preset || (appData.network.spi_instance === 1 ? "spi1_def" : "spi0_pico_w");
  const spiCfg = SPI_PRESETS[spiKey];
  const chipName = isSpi ? "RPi SPI" : (appData.network.wizchip || "W5500");

  const misoAlias = normalizePinAlias(appData.network.spi_miso || (spiCfg ? spiCfg.miso : "PIN_1"));
  const csAlias   = normalizePinAlias(appData.network.spi_cs   || (spiCfg ? spiCfg.cs   : "PIN_2"));
  const sckAlias  = normalizePinAlias(appData.network.spi_sck  || (spiCfg ? spiCfg.sck  : "PIN_4"));
  const mosiAlias = normalizePinAlias(appData.network.spi_mosi || (spiCfg ? spiCfg.mosi : "PIN_5"));
  const resetAlias= normalizePinAlias(appData.network.spi_reset|| (spiCfg ? spiCfg.reset: "PIN_6"));
  const intAlias  = normalizePinAlias(appData.network.spi_int  || (spiCfg ? spiCfg.int  : "PIN_7"));

  function assign(pinAlias, role, roleClass, name) {
    if (!pinAlias || pinAlias === "PIN_NULL") return;
    
    // Check conflict with active SPI bus
    const activeReserved = [misoAlias, csAlias, sckAlias, mosiAlias];
    if (!isSpi) {
      if (resetAlias && resetAlias !== "PIN_NULL") activeReserved.push(resetAlias);
      if (intAlias && intAlias !== "PIN_NULL") activeReserved.push(intAlias);
    }

    if (activeReserved.includes(pinAlias) && role !== "w5500") {
      conflicts.push(`O pino ${pinAlias} é reservado para o barramento SPI (${chipName}) e não pode ser usado por "${name}"!`);
    }

    if (map[pinAlias]) {
      conflicts.push(`Conflito no ${pinAlias}: atribuído para "${map[pinAlias].name}" e "${name}"`);
      map[pinAlias] = {
        role: "conflict",
        roleClass: "role-conflict",
        name: `${map[pinAlias].name} + ${name}`
      };
    } else {
      map[pinAlias] = { role, roleClass, name };
    }
  }

  // Assign hardware SPI bus lines dynamically
  assign(misoAlias, "w5500", "role-w5500", `${chipName} MISO`);
  assign(csAlias,   "w5500", "role-w5500", `${chipName} CS`);
  assign(sckAlias,  "w5500", "role-w5500", `${chipName} SCK`);
  assign(mosiAlias, "w5500", "role-w5500", `${chipName} MOSI`);
  if (!isSpi) {
    if (resetAlias && resetAlias !== "PIN_NULL") {
      assign(resetAlias, "w5500", "role-w5500", `${chipName} RESET`);
    }
    if (intAlias && intAlias !== "PIN_NULL") {
      assign(intAlias, "w5500", "role-w5500", `${chipName} INT`);
    }
  }

  // Step/Dir assignments and consecutive check
  const axesNames = ["X", "Y", "Z", "A", "B", "C", "U", "V"];
  (b.stepgen_steps || []).forEach((p, i) => {
    const dirP = b.stepgen_dirs[i];
    const axis = axesNames[i] || `Eixo #${i}`;
    assign(p, "step", "role-step", `${axis} Step`);
    assign(dirP, "dir", "role-dir", `${axis} Dir`);

    const stepOpt = GPIO_OPTIONS.find(o => o.alias === p);
    const dirOpt = GPIO_OPTIONS.find(o => o.alias === dirP);
    if (stepOpt && dirOpt && stepOpt.gp !== null && dirOpt.gp !== null) {
      if (Math.abs(stepOpt.gp - dirOpt.gp) !== 1) {
        conflicts.push(`⚠️ ${axis} (Step Generator #${i}): Step (${stepOpt.label}) e Dir (${dirOpt.label}) precisam ser GPIOs consecutivos (|GP${stepOpt.gp} - GP${dirOpt.gp}| != 1)!`);
      }
    }
  });

  // Encoders
  (b.enc_pins || []).forEach((p, i) => assign(p, "enc", "role-enc", `Enc #${i} A/B`));
  (b.enc_index_pins || []).forEach((p, i) => assign(p, "enc", "role-enc", `Enc #${i} Index`));

  // In / Out
  (b.in_pins || []).forEach((p, i) => {
    const halName = (b.in_pin_names && b.in_pin_names[i]) ? b.in_pin_names[i] : `in_${i}`;
    assign(p, "in", "role-in", `Input: ${halName}`);
  });
  (b.out_pins || []).forEach((p, i) => {
    const halName = (b.out_pin_names && b.out_pin_names[i]) ? b.out_pin_names[i] : `out_${i}`;
    assign(p, "out", "role-out", `Output: ${halName}`);
  });

  // PWM
  if (b.use_pwm && b.pwm_pins && b.pwm_pins[0]) {
    assign(b.pwm_pins[0], "pwm", "role-pwm", "PWM Out");
  }

  return { map, conflicts };
}

// Populate Pin Select Box with color coding and availability filter
function populatePinSelect(selectEl, selectedVal) {
  if (!selectEl) return;
  const currentVal = selectedVal !== undefined ? selectedVal : selectEl.value;
  selectEl.innerHTML = "";

  const assignments = getPinAssignments();
  const map = assignments.map || {};
  const filterAvailable = (appData.pin_filter === "available");

  GPIO_OPTIONS.forEach(opt => {
    // PIN_NULL (desabilitado) sempre fica disponível
    if (opt.alias === "PIN_NULL") {
      const el = document.createElement("option");
      el.value = opt.alias;
      el.textContent = opt.label;
      if (opt.alias === currentVal) el.selected = true;
      selectEl.appendChild(el);
      return;
    }

    const used = map[opt.alias];
    const isCurrent = (opt.alias === currentVal);

    if (used && !isCurrent) {
      if (filterAvailable) {
        // No modo apenas disponíveis, não exibe pinos que já estão ocupados
        return;
      }
      const el = document.createElement("option");
      el.value = opt.alias;
      el.textContent = `${opt.label} — [Em uso: ${used.name}]`;
      el.className = "pin-opt-used";
      el.style.color = "#f59e0b";
      selectEl.appendChild(el);
    } else {
      const el = document.createElement("option");
      el.value = opt.alias;
      el.textContent = opt.label;
      el.className = "pin-opt-free";
      if (isCurrent) el.selected = true;
      selectEl.appendChild(el);
    }
  });

  if (currentVal && selectEl.value !== currentVal) {
    selectEl.value = currentVal;
  }
}

// Refresh all pin select boxes on the page while preserving their selected values
function refreshAllPinSelects() {
  document.querySelectorAll("select.pin-select").forEach(sel => {
    populatePinSelect(sel, sel.value);
  });
}

// Render Visual Pico 40-Pin Board (com reaproveitamento de nós DOM para 60 FPS estáveis)
function renderPinout() {
  const leftCol = document.getElementById("leftPins");
  const rightCol = document.getElementById("rightPins");
  const banner = document.getElementById("conflictBanner");
  const bannerText = document.getElementById("conflictText");

  if (!leftCol || !rightCol) return;

  const { map, conflicts } = getPinAssignments();

  // Show / Hide Conflict Banner
  if (conflicts.length > 0) {
    banner.classList.remove("hidden");
    const conflictHtml = conflicts.join("<br>");
    if (bannerText.innerHTML !== conflictHtml) {
      bannerText.innerHTML = conflictHtml;
    }
  } else {
    banner.classList.add("hidden");
  }

  // Update MCU badge and SoC text
  const isPico2 = (appData.network.mcu === "pico2");
  const chipName = isPico2 ? "RP2350" : "RP2040";
  const chipDesc = isPico2 ? "Dual Cortex-M33" : "Dual Cortex-M0+";
  
  const mcuBadge = document.getElementById("mcuBadgeHeader");
  const boardLabel = document.getElementById("boardChipLabel");
  const chipSocName = document.getElementById("chipSocName");
  const chipSocSub = document.getElementById("chipSocSub");

  if (mcuBadge && mcuBadge.textContent !== chipName) mcuBadge.textContent = chipName;
  if (boardLabel && boardLabel.textContent !== `${chipName} PICO`) boardLabel.textContent = `${chipName} PICO`;
  if (chipSocName && chipSocName.textContent !== chipName) chipSocName.textContent = chipName;
  if (chipSocSub && chipSocSub.textContent !== chipDesc) chipSocSub.textContent = chipDesc;

  // Left: Pins 1 to 20
  const leftRows = leftCol.children;
  if (leftRows.length === 20) {
    for (let i = 0; i < 20; i++) {
      const pinNum = i + 1;
      const pinInfo = PICO_PINS.find(p => p.pin === pinNum) || { pin: pinNum, name: `P${pinNum}`, alias: `PIN_${pinNum}`, type: "gpio" };
      updatePinRow(leftRows[i], pinInfo, map[pinInfo.alias]);
    }
  } else {
    leftCol.innerHTML = "";
    for (let pinNum = 1; pinNum <= 20; pinNum++) {
      const pinInfo = PICO_PINS.find(p => p.pin === pinNum) || { pin: pinNum, name: `P${pinNum}`, alias: `PIN_${pinNum}`, type: "gpio" };
      leftCol.appendChild(createPinRow(pinInfo, map[pinInfo.alias]));
    }
  }

  // Right: Pins 40 down to 21 (Pico physical order)
  const rightRows = rightCol.children;
  if (rightRows.length === 20) {
    for (let i = 0; i < 20; i++) {
      const pinNum = 40 - i;
      const pinInfo = PICO_PINS.find(p => p.pin === pinNum) || { pin: pinNum, name: `P${pinNum}`, alias: `PIN_${pinNum}`, type: "gpio" };
      updatePinRow(rightRows[i], pinInfo, map[pinInfo.alias]);
    }
  } else {
    rightCol.innerHTML = "";
    for (let pinNum = 40; pinNum >= 21; pinNum--) {
      const pinInfo = PICO_PINS.find(p => p.pin === pinNum) || { pin: pinNum, name: `P${pinNum}`, alias: `PIN_${pinNum}`, type: "gpio" };
      rightCol.appendChild(createPinRow(pinInfo, map[pinInfo.alias]));
    }
  }
}

function updatePinRow(row, pinInfo, assignment) {
  let roleClass = "role-free";
  let tagText = "";

  if (pinInfo.type === "gnd") {
    roleClass = "role-gnd";
    tagText = "GND";
  } else if (pinInfo.type === "pwr" || pinInfo.type === "sys") {
    roleClass = "role-pwr";
    tagText = pinInfo.alias;
  } else if (assignment) {
    roleClass = assignment.roleClass;
    tagText = assignment.name;
  }

  const pad = row.querySelector(".pin-pad");
  const desiredPadClass = `pin-pad ${roleClass}`;
  if (pad && pad.className !== desiredPadClass) {
    pad.className = desiredPadClass;
  }

  let tagEl = row.querySelector(".pin-role-tag");
  if (tagText) {
    if (!tagEl) {
      tagEl = document.createElement("span");
      row.appendChild(tagEl);
    }
    const desiredTagClass = `pin-role-tag ${roleClass}`;
    if (tagEl.className !== desiredTagClass) tagEl.className = desiredTagClass;
    if (tagEl.textContent !== tagText) tagEl.textContent = tagText;
  } else if (tagEl) {
    tagEl.remove();
  }

  const desiredTitle = `Pino Físico ${pinInfo.pin} (${pinInfo.name}): ${tagText || 'Livre'}`;
  if (row.title !== desiredTitle) row.title = desiredTitle;
}

function createPinRow(pinInfo, assignment) {
  const row = document.createElement("div");
  row.className = "pin-row";
  
  let roleClass = "role-free";
  let tagText = "";

  if (pinInfo.type === "gnd") {
    roleClass = "role-gnd";
    tagText = "GND";
  } else if (pinInfo.type === "pwr" || pinInfo.type === "sys") {
    roleClass = "role-pwr";
    tagText = pinInfo.alias;
  } else if (assignment) {
    roleClass = assignment.roleClass;
    tagText = assignment.name;
  }

  row.innerHTML = `
    <span class="pin-num">${pinInfo.pin}</span>
    <span class="pin-pad ${roleClass}"></span>
    <span class="pin-name">${pinInfo.name}</span>
    ${tagText ? `<span class="pin-role-tag ${roleClass}">${tagText}</span>` : ''}
  `;

  row.title = `Pino Físico ${pinInfo.pin} (${pinInfo.name}): ${tagText || 'Livre'}`;
  return row;
}

// Debounced C Code Preview (economiza ~80% de chamadas de rede)
let previewDebounceTimer = null;
function updateCodePreview(delay = 200) {
  if (previewDebounceTimer) clearTimeout(previewDebounceTimer);
  if (delay === 0) {
    _fetchCodePreview();
  } else {
    previewDebounceTimer = setTimeout(_fetchCodePreview, delay);
  }
}

async function _fetchCodePreview() {
  try {
    const filename = appData.board_filename || "board_custom.h";
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board: appData.board,
        network: appData.network,
        filename: filename
      })
    });
    if (res.ok) {
      const data = await res.json();
      const codeBox = document.getElementById("codePreview");
      if (codeBox && codeBox.textContent !== data.code) {
        codeBox.textContent = data.code;
      }
      const fnEl = document.getElementById("previewFilename");
      if (fnEl) fnEl.textContent = data.filename || filename;
    }
  } catch (err) {
    console.error("Preview error:", err);
  }
}

// Batching de atualizações visuais via requestAnimationFrame
let rafDataChange = null;
function onDataChanged() {
  if (rafDataChange) cancelAnimationFrame(rafDataChange);
  rafDataChange = requestAnimationFrame(() => {
    refreshAllPinSelects();
    renderPinout();
    updateCodePreview(200);
  });
}

// Para campos que não alteram a distribuição de pinos (ex: pulsos, frequências, inverte step)
function onParamChanged() {
  updateCodePreview(200);
}

// Quando o nome de um pino HAL muda: atualiza o diagrama em tempo real e o preview de código C
function onNameChanged() {
  renderPinout();
  updateCodePreview(200);
}

// Global Event Listeners
function setupEventListeners() {
  // Pin Display Filter Combo Box
  const filterSel = document.getElementById("pinDisplayFilter");
  if (filterSel) {
    filterSel.addEventListener("change", () => {
      appData.pin_filter = filterSel.value;
      refreshAllPinSelects();
    });
  }

  // Board Name Input
  document.getElementById("boardName").addEventListener("input", (e) => {
    appData.board.board_name = e.target.value.trim() || "Custom Board";
    updateCodePreview();
  });

  // Board Filename Input
  document.getElementById("boardFilename").addEventListener("input", (e) => {
    let fn = e.target.value.trim();
    if (fn) {
      appData.board_filename = fn;
      document.getElementById("previewFilename").textContent = fn;
      updateCodePreview();
    }
  });

  // MCU Radio Selection
  document.querySelectorAll('input[name="mcuChoice"]').forEach(r => {
    r.addEventListener("change", (e) => {
      appData.network.mcu = e.target.value;
      document.querySelectorAll('input[name="mcuChoice"]').forEach(other => {
        other.closest('.radio-card').classList.toggle('active', other.checked);
      });
      renderPinout();
    });
  });

  // Transport Radio Selection
  document.querySelectorAll('input[name="transportChoice"]').forEach(r => {
    r.addEventListener("change", (e) => {
      appData.network.transport = parseInt(e.target.value);
      document.querySelectorAll('input[name="transportChoice"]').forEach(other => {
        other.closest('.radio-card').classList.toggle('active', other.checked);
      });
      updateTransportVisibility();
      renderPinout();
    });
  });

  // Wizchip Radio Selection
  document.querySelectorAll('input[name="wizchipChoice"]').forEach(r => {
    r.addEventListener("change", (e) => {
      appData.network.wizchip = e.target.value;
      document.querySelectorAll('input[name="wizchipChoice"]').forEach(other => {
        other.closest('.radio-card').classList.toggle('active', other.checked);
      });
      updateTransportVisibility();
      renderPinout();
    });
  });

  // SPI Instance Radio Selection
  document.querySelectorAll('input[name="spiInstanceChoice"]').forEach(r => {
    r.addEventListener("change", (e) => {
      appData.network.spi_instance = parseInt(e.target.value);
      document.querySelectorAll('input[name="spiInstanceChoice"]').forEach(other => {
        other.closest('.radio-card').classList.toggle('active', other.checked);
      });
      // Switch default preset for this instance
      const presetSelect = document.getElementById("spiPinPreset");
      if (presetSelect) {
        presetSelect.value = (appData.network.spi_instance === 1) ? "spi1_def" : "spi0_pico_w";
        appData.network.spi_preset = presetSelect.value;
        const cfg = SPI_PRESETS[presetSelect.value];
        if (cfg) {
          appData.network.spi_miso = cfg.miso_gp;
          appData.network.spi_cs = cfg.cs_gp;
          appData.network.spi_sck = cfg.sck_gp;
          appData.network.spi_mosi = cfg.mosi_gp;
          appData.network.spi_reset = cfg.reset_gp;
          appData.network.spi_int = cfg.int_gp;
        }
        populateSpiPinSelects();
      }
      updateTransportVisibility();
      onDataChanged();
    });
  });

  // SPI Pin Preset Select
  const spiPresetEl = document.getElementById("spiPinPreset");
  if (spiPresetEl) {
    spiPresetEl.addEventListener("change", (e) => {
      const pKey = e.target.value;
      appData.network.spi_preset = pKey;
      if (pKey !== "custom") {
        const cfg = SPI_PRESETS[pKey];
        if (cfg) {
          appData.network.spi_instance = cfg.instance;
          appData.network.spi_miso = cfg.miso_gp;
          appData.network.spi_cs = cfg.cs_gp;
          appData.network.spi_sck = cfg.sck_gp;
          appData.network.spi_mosi = cfg.mosi_gp;
          appData.network.spi_reset = cfg.reset_gp;
          appData.network.spi_int = cfg.int_gp;

          // Sync radio card
          document.querySelectorAll('input[name="spiInstanceChoice"]').forEach(r => {
            r.checked = (parseInt(r.value) === cfg.instance);
            r.closest('.radio-card').classList.toggle('active', r.checked);
          });
          populateSpiPinSelects();
        }
      }
      updateTransportVisibility();
      onDataChanged();
    });
  }

  // Individual Selectors for SPI lines (MISO, CS, SCK, MOSI, RESET, INT)
  const spiPinSelectMap = [
    { id: "spiMisoPin", prop: "spi_miso" },
    { id: "spiCsPin",   prop: "spi_cs" },
    { id: "spiSckPin",  prop: "spi_sck" },
    { id: "spiMosiPin", prop: "spi_mosi" },
    { id: "spiResetPin",prop: "spi_reset" },
    { id: "spiIntPin",  prop: "spi_int" }
  ];

  spiPinSelectMap.forEach(({ id, prop }) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        const opt = GPIO_OPTIONS.find(o => o.alias === e.target.value);
        appData.network[prop] = opt && opt.gp !== null ? `GP${opt.gp}` : e.target.value;
        const matched = detectSpiPreset();
        appData.network.spi_preset = matched;
        if (spiPresetEl) spiPresetEl.value = matched;

        updateTransportVisibility();
        onDataChanged();
      });
    }
  });

  // Add buttons
  document.getElementById("btnAddStepgen").addEventListener("click", addStepgen);
  document.getElementById("btnAddEncoder").addEventListener("click", addEncoder);
  document.getElementById("btnAddInput").addEventListener("click", addInput);
  document.getElementById("btnAddOutput").addEventListener("click", addOutput);

  // Timing inputs
  document.getElementById("pulseWidth").addEventListener("input", (e) => {
    appData.board.default_pulse_width = parseInt(e.target.value) || 2000;
    onParamChanged();
  });

  document.getElementById("stepScale").addEventListener("input", (e) => {
    appData.board.default_step_scale = parseInt(e.target.value) || 1000;
    onParamChanged();
  });

  // PWM Inputs
  document.getElementById("usePwm").addEventListener("change", (e) => {
    appData.board.use_pwm = e.target.checked ? 1 : 0;
    onDataChanged();
  });

  document.getElementById("pwmPin").addEventListener("change", (e) => {
    appData.board.pwm_pins = [e.target.value];
    onDataChanged();
  });

  document.getElementById("pwmFreq").addEventListener("input", (e) => {
    appData.board.default_pwm_frequency = parseInt(e.target.value) || 10000;
    onParamChanged();
  });

  document.getElementById("pwmMaxscale").addEventListener("input", (e) => {
    appData.board.default_pwm_maxscale = parseInt(e.target.value) || 4096;
    onParamChanged();
  });

  document.getElementById("pwmInvert").addEventListener("change", (e) => {
    appData.board.pwm_invert = [e.target.checked ? 1 : 0];
    onParamChanged();
  });

  // Network Inputs
  document.getElementById("netIp").addEventListener("change", (e) => {
    appData.network.ip = e.target.value;
  });
  document.getElementById("netGateway").addEventListener("change", (e) => {
    appData.network.gateway = e.target.value;
  });
  document.getElementById("netSubnet").addEventListener("change", (e) => {
    appData.network.subnet = e.target.value;
  });
  document.getElementById("netPort").addEventListener("change", (e) => {
    appData.network.port = parseInt(e.target.value) || 8888;
  });

  // Save Button
  document.getElementById("btnSave").addEventListener("click", saveConfig);

  // Build Button
  document.getElementById("btnBuild").addEventListener("click", buildFirmware);

  // Copy Code Button
  document.getElementById("btnCopyCode").addEventListener("click", () => {
    const code = document.getElementById("codePreview").textContent;
    navigator.clipboard.writeText(code).then(() => {
      showToast("Código C copiado para a área de transferência!");
    });
  });

  // Modal close buttons
  document.getElementById("btnCloseModal").addEventListener("click", closeModal);
  document.getElementById("btnDismissBuild").addEventListener("click", closeModal);
}

// Save Config to disk via API
async function saveConfig() {
  const { conflicts } = getPinAssignments();
  if (conflicts.length > 0) {
    if (!confirm("Existem conflitos de pinos ativos! Deseja salvar mesmo assim?")) {
      return;
    }
  }

  const filename = document.getElementById("boardFilename").value.trim() || appData.board_filename || "board_custom.h";
  appData.board_filename = filename;

  // Synchronize array lengths for inputs & outputs before sending
  const inCount = (appData.board.in_pins || []).length;
  if (!Array.isArray(appData.board.in_pullup)) appData.board.in_pullup = [];
  while (appData.board.in_pullup.length < inCount) appData.board.in_pullup.push(1);
  if (!Array.isArray(appData.board.in_pin_names)) appData.board.in_pin_names = [];
  while (appData.board.in_pin_names.length < inCount) appData.board.in_pin_names.push("");

  const outCount = (appData.board.out_pins || []).length;
  if (!Array.isArray(appData.board.out_pin_names)) appData.board.out_pin_names = [];
  while (appData.board.out_pin_names.length < outCount) appData.board.out_pin_names.push("");

  const btn = document.getElementById("btnSave");
  btn.disabled = true;
  btn.innerHTML = '<span class="btn-icon">⏳</span> Salvando...';

  try {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        board: appData.board,
        network: appData.network,
        filename: filename
      })
    });
    const data = await res.json();
    showToast(data.message || `Configuração salva em ${filename} com sucesso!`);
    updateCodePreview();
  } catch (err) {
    showToast("Erro ao salvar: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">💾</span> Salvar';
  }
}

// Build Firmware via API
async function buildFirmware() {
  await saveConfig();

  const modal = document.getElementById("buildModal");
  const spinner = document.getElementById("buildSpinner");
  const logBox = document.getElementById("buildOutput");
  const logDetails = document.getElementById("buildLogDetails");
  const successBox = document.getElementById("buildSuccessBox");
  const modalTitle = document.getElementById("buildModalTitle");
  const modalSubtitle = document.getElementById("buildModalSubtitle");
  const buildTargetName = document.getElementById("buildTargetName");

  const mcu = appData.network.mcu || "pico";
  const wizchip = (appData.network.transport === 1) ? "SPI" : (appData.network.wizchip || "W5500");

  modal.classList.remove("hidden");
  spinner.style.display = "flex";
  spinner.classList.remove("hidden");
  if (logDetails) logDetails.open = false;
  logBox.textContent = `Iniciando compilação para ${mcu.toUpperCase()} com ${wizchip}...`;
  successBox.classList.add("hidden");
  modalTitle.textContent = "Compilando Firmware...";
  if (modalSubtitle) modalSubtitle.textContent = `CMake (-DBOARD=${mcu} -DWIZCHIP_TYPE=${appData.network.wizchip || 'W5500'})...`;

  try {
    const res = await fetch("/api/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mcu: appData.network.mcu || "pico",
        wizchip: appData.network.wizchip || "W5500"
      })
    });
    const data = await res.json();
    spinner.style.display = "none";
    spinner.classList.add("hidden");
    logBox.textContent = data.output || "Compilação terminada.";

    if (data.status === "success") {
      modalTitle.textContent = "Pacote Completo Gerado!";
      if (logDetails) logDetails.open = false;
      successBox.classList.remove("hidden");
      
      const fwName = data.firmware_file || `stepper-ninja-${mcu}-${wizchip}.uf2`;
      if (buildTargetName) buildTargetName.textContent = fwName;
      const sizeEl = document.getElementById("buildFileSize");
      if (sizeEl) sizeEl.textContent = `${data.firmware_size_kb || 0} KB`;

      const distPathEl = document.getElementById("distFolderPath");
      if (distPathEl) distPathEl.textContent = data.dist_dir || "stepper-ninja/dist/";

      const downloadUf2Btn = document.getElementById("btnDownloadUf2");
      if (downloadUf2Btn) {
        downloadUf2Btn.href = `/api/download/${fwName}`;
        downloadUf2Btn.download = fwName;
      }

      const downloadZipBtn = document.getElementById("btnDownloadZip");
      if (downloadZipBtn) {
        downloadZipBtn.href = `/api/download/zip`;
      }

      showToast("Firmware e Drivers gerados na pasta dist/ com sucesso!");
    } else {
      modalTitle.textContent = "Erro na Compilação";
      if (logDetails) logDetails.open = true;
      showToast("Falha durante o build do pacote.");
    }
  } catch (err) {
    spinner.style.display = "none";
    spinner.classList.add("hidden");
    if (logDetails) logDetails.open = true;
    logBox.textContent = "Erro na requisição: " + err.message;
    showToast("Erro ao compilar: " + err.message);
  }
}

window.openDistFolder = async function() {
  try {
    const res = await fetch("/api/open-folder");
    const d = await res.json();
    if (d.status === "ok") {
      showToast(d.opened ? "Pasta dist/ aberta no seu sistema!" : `Pasta localizada em: ${d.path}`);
    } else {
      showToast("Aviso: " + (d.message || "Não foi possível abrir a pasta automaticamente."));
    }
  } catch (e) {
    showToast("Erro ao chamar abertura de pasta: " + e.message);
  }
};

document.getElementById("btnOpenDistFolder")?.addEventListener("click", window.openDistFolder);

function closeModal() {
  document.getElementById("buildModal").classList.add("hidden");
  const spinner = document.getElementById("buildSpinner");
  if (spinner) {
    spinner.style.display = "none";
    spinner.classList.add("hidden");
  }
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4000);
}
