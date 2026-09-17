#ifndef FOOTER_H
#define FOOTER_H    

// **********************************************************************************
// Stepper Ninja - Verificações de integridade e configurações do sistema
// **********************************************************************************

#if raspberry_pi_spi == 1
    #pragma message("Build for Raspberry PI SPI communication!")
#endif

#ifndef use_stepcounter
#define use_stepcounter 0
#endif

#ifndef debug_mode
#define debug_mode 0
#endif

#define max_statemachines (stepgens + encoders)

#ifdef PICO_RP2040
    #if max_statemachines > 8
        #pragma error "State machines exceeded the maximum platform size (8)."
    #endif
#endif

#ifdef PICO_RP2350
    #if max_statemachines > 12
        #pragma error "State machines exceeded the maximum platform size (12)."
    #endif
#endif

#ifndef pico_clock
#define pico_clock 200000000
#endif

#endif // FOOTER_H