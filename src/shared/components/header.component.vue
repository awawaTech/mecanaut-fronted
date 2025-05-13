<script>
import ThemeToggle from './theme-toggle.component.vue';
import LanguageSwitcher from './language-switcher.component.vue';

export default {
    name: 'HeaderComponent',
    components: {
        ThemeToggle,
        LanguageSwitcher
    },
    props: {
        title: {
            type: String,
            required: false,
            default: 'MecanautApp'
        }
    },
    methods: {
        toggleSidebar() {
            this.$emit('toggle-sidebar')
        }
    }
}
</script>

<template>
    <header class="header">
        <div class="header__left">
            <button class="header__menu-toggle" @click="toggleSidebar" aria-label="Alternar menú">
                <span class="hamburger-icon"></span>
            </button>
            <h1 class="header__title">{{ title }}</h1>
        </div>
        
        <div class="header__right">
            <theme-toggle />
            <language-switcher />
        </div>
    </header>
</template>

<style scoped lang="scss">
.header {
    height: 70px;
    background-color: var(--clr-surface);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.5rem;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, var(--clr-primary-300), var(--clr-primary-500));
    }
}

.header__left {
    display: flex;
    align-items: center;
}

.header__title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--clr-primary-400);
    margin: 0;
    margin-left: 1.2rem;
    position: relative;
    letter-spacing: -0.3px;
    transform: translateY(1px);
    transition: color 0.3s ease;
    
    &::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, var(--clr-primary-300), var(--clr-primary-200));
        transition: width 0.3s ease;
    }
    
    &:hover::after {
        width: 100%;
    }
}

.header__menu-toggle {
    background: none;
    border: none;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    border-radius: 8px;
    transition: all 0.2s ease;
    
    &:hover {
        background-color: rgba(0, 0, 0, 0.03);
        
        .hamburger-icon, 
        .hamburger-icon:before, 
        .hamburger-icon:after {
            background-color: var(--clr-primary-400);
        }
    }
    
    &:active {
        transform: scale(0.95);
    }
}

.hamburger-icon,
.hamburger-icon:before,
.hamburger-icon:after {
    width: 22px;
    height: 2px;
    background-color: var(--clr-primary-300);
    position: relative;
    transition: all 0.3s ease;
    border-radius: 4px;
}

.hamburger-icon:before,
.hamburger-icon:after {
    content: '';
    position: absolute;
    left: 0;
}

.hamburger-icon:before {
    top: -7px;
    width: 16px;
    left: 3px;
}

.hamburger-icon:after {
    top: 7px;
    width: 16px;
    left: 3px;
}

.header__menu-toggle:hover .hamburger-icon:before,
.header__menu-toggle:hover .hamburger-icon:after {
    width: 22px;
    left: 0;
}

.header__right {
    display: flex;
    align-items: center;
    gap: 1.2rem;
}

// Responsive styles
@media (max-width: 768px) {
    .header {
        padding: 0 1rem;
    }
    
    .header__title {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {
    .header {
        padding: 0 2rem;
    }
}
</style>