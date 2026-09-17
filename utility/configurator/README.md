# Stepper Ninja - Board & Pinout Configurator

Interface gráfica interativa moderna para configurar o mapeamento de pinos do Raspberry Pi Pico, gerar arquivos de configuração (`board_custom.h`) e compilar o firmware (.uf2) com 1 clique.

---

## Como Executar

No terminal, execute:

```bash
./utility/configurator/run.sh
```
Ou diretamente:
```bash
python3 utility/configurator/server.py
```

O configurador iniciará o servidor local e abrirá automaticamente o navegador em:
**`http://localhost:8080`**

---

## Funcionalidades

1. **Diagrama Visual do Pico (40 Pinos)**:
   - Identificação por cores de cada função:
     - 🟢 **Verde**: Step (Pulso) e Dir (Direção) dos motores
     - 🔵 **Ciano**: Encoders de quadratura e Index
     - 🟠 **Laranja**: Entradas digitais (Fins de curso, Probe, E-Stop)
     - 🟣 **Roxo**: Saídas digitais (Relés, Coolant, Enable)
     - 🔴 **Rosa/Vermelho**: PWM e barramento reservado do chip SPI W5500
2. **Detector de Conflitos em Tempo Real**:
   - Alerta visual instantâneo se você usar o mesmo pino para duas funções ou se tentar usar os pinos reservados da Ethernet W5500 (`GP16-GP21`).
3. **Gerenciador de Presets**:
   - Carregue placas prontas com 1 clique no menu superior:
     - *Placa Chinesa DB25 5 eixos (Mach3)*
     - *Stepper Ninja Breakout Board v1.0*
     - *PicoBOB-DLX*
     - *Breakout Board 100*
     - *IO Ninja / Analog Ninja*
4. **Visualização de Código C em Tempo Real**:
   - Veja o arquivo `firmware/inc/boards/board_custom.h` sendo gerado na hora enquanto você altera os pinos.
5. **Compilação Integrada**:
   - Botão **"Compilar Firmware (.uf2)"** que executa o toolchain CMake/GCC e reporta o status do binário gerado na hora.
