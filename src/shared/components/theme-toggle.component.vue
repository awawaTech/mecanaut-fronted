<script>
import { themeService } from '../../core/services/theme.service';

export default {
    name: 'theme-toggle',
    data() {
        return {
            currentTheme: 'light',
            ariaLabel: 'Cambiar a modo oscuro'
        }
    },
    mounted() {
        // Suscribirse a cambios de tema
        this.unsubscribe = themeService.subscribe((theme) => {
            this.currentTheme = theme;
            this.ariaLabel = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        });
    },
    beforeUnmount() {
        // Limpiar suscripción
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    },
    methods: {
        toggleTheme() {
            themeService.toggleTheme();
        }
    }
}
</script>

<template>
    <button 
        class="theme-toggle" 
        :class="{ 'theme-toggle--dark': currentTheme === 'dark' }"
        @click="toggleTheme" 
        :aria-label="ariaLabel"
    >
        <div class="theme-toggle__switch">
            <div class="theme-toggle__icons">
                <div class="theme-toggle__icon theme-toggle__icon--sun">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="4"></circle>
                        <path d="M12 2v2"></path>
                        <path d="M12 20v2"></path>
                        <path d="M5 5l1.5 1.5"></path>
                        <path d="M17.5 17.5l1.5 1.5"></path>
                        <path d="M2 12h2"></path>
                        <path d="M20 12h2"></path>
                        <path d="M5 19l1.5-1.5"></path>
                        <path d="M17.5 6.5l1.5-1.5"></path>
                    </svg>
                </div>
                <div class="theme-toggle__icon theme-toggle__icon--moon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </div>
            </div>
            <div class="theme-toggle__ball"></div>
        </div>
    </button>
</template>

<style scoped>
.theme-toggle {
    --toggle-width: 70px;
    --toggle-height: 35px;
    --toggle-padding: 5px;
    --ball-size: calc(var(--toggle-height) - 2 * var(--toggle-padding));
    --ball-translation: calc(var(--toggle-width) - var(--ball-size) - 2 * var(--toggle-padding));
    
    position: relative;
    display: inline-block;
    width: var(--toggle-width);
    height: var(--toggle-height);
    border-radius: 999px;
    background: linear-gradient(to right, #846bae, #5560ab);
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: none;
    padding: 0;
    transition: all 0.3s ease;
    overflow: hidden;
}

.theme-toggle--dark {
    background: linear-gradient(to right, #494087, #251e54);
}

.theme-toggle__switch {
    position: relative;
    width: 100%;
    height: 100%;
}

.theme-toggle__ball {
    position: absolute;
    left: var(--toggle-padding);
    top: var(--toggle-padding);
    width: var(--ball-size);
    height: var(--ball-size);
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 2;
}

.theme-toggle--dark .theme-toggle__ball {
    transform: translateX(var(--ball-translation));
    background-color: #c5c5ff;
}

.theme-toggle__icons {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 calc(var(--toggle-padding) + 2px);
    pointer-events: none;
}

.theme-toggle__icon {
    width: 16px;
    height: 16px;
    color: #ffffff;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.theme-toggle__icon--sun {
    margin-left: 4px;
    opacity: 0.9;
}

.theme-toggle__icon--moon {
    margin-right: 4px;
    opacity: 0.5;
}

.theme-toggle--dark .theme-toggle__icon--sun {
    opacity: 0.5;
}

.theme-toggle--dark .theme-toggle__icon--moon {
    opacity: 0.9;
}

.theme-toggle:hover {
    transform: scale(1.05);
}

.theme-toggle:active {
    transform: scale(0.95);
}

/* Añadimos animación sutil para mejorar la experiencia */
@keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(146, 109, 222, 0.8); }
    50% { box-shadow: 0 0 15px rgba(146, 109, 222, 0.6); }
}

.theme-toggle:hover {
    animation: glow 1.5s infinite;
}
</style>