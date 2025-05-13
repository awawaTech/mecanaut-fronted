<script>
import HeaderComponent from '../components/header.component.vue';
import ThemeToggle from '../components/theme-toggle.component.vue';
import LanguageSwitcher from '../components/language-switcher.component.vue';

export default {
    name: 'ComponentsDemo',
    components: {
        HeaderComponent,
        ThemeToggle,
        LanguageSwitcher
    },
    data() {
        return {
            activeTab: 'header',
            components: [
                { id: 'header', name: 'Header', component: 'HeaderComponent' },
                { id: 'theme', name: 'Theme Toggle', component: 'ThemeToggle' },
                { id: 'language', name: 'Language Switcher', component: 'LanguageSwitcher' }
            ],
            headerProps: [
                { name: 'title', type: 'String', default: 'MecanautApp', description: 'Título mostrado en el encabezado' }
            ],
            headerEvents: [
                { name: 'toggle-sidebar', params: '-', description: 'Emitido cuando se hace clic en el botón de menú' }
            ],
            themeProps: [],
            themeEvents: [],
            languageProps: [],
            languageEvents: []
        }
    },
    methods: {
        setActiveTab(tabId) {
            this.activeTab = tabId;
        },
        toggleDemoSidebar() {
            // Solo para demostración
            alert('Evento toggle-sidebar emitido');
        }
    }
}
</script>

<template>
    <div class="components-demo">
        <div class="demo-header">
            <h1>Biblioteca de Componentes</h1>
        </div>
        
        <div class="demo-nav">
            <button 
                v-for="comp in components" 
                :key="comp.id"
                :class="['demo-nav__button', { 'demo-nav__button--active': activeTab === comp.id }]"
                @click="setActiveTab(comp.id)"
            >
                {{ comp.name }}
            </button>
        </div>
        
        <div class="demo-content">
            <!-- Header Component Demo -->
            <div v-show="activeTab === 'header'" class="component-section">
                <div class="component-info">
                    <h2>Header Component</h2>
                    <p>Un componente de encabezado reutilizable que incluye un botón de menú, un título y espacio para acciones a la derecha.</p>
                    
                    <h3>Props</h3>
                    <table class="props-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Default</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="prop in headerProps" :key="prop.name">
                                <td>{{ prop.name }}</td>
                                <td>{{ prop.type }}</td>
                                <td>{{ prop.default }}</td>
                                <td>{{ prop.description }}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h3>Eventos</h3>
                    <table class="props-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Parámetros</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="event in headerEvents" :key="event.name">
                                <td>{{ event.name }}</td>
                                <td>{{ event.params }}</td>
                                <td>{{ event.description }}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h3>Código de ejemplo</h3>
                    <pre><code>&lt;header-component 
  title="Mi Aplicación"
  @toggle-sidebar="mySidebarToggleFunction"
/&gt;</code></pre>
                </div>
                
                <div class="component-preview">
                    <h3>Vista previa</h3>
                    <div class="preview-container">
                        <header-component 
                            title="Título de ejemplo" 
                            @toggle-sidebar="toggleDemoSidebar"
                        />
                    </div>
                </div>
            </div>
            
            <!-- Theme Toggle Demo -->
            <div v-show="activeTab === 'theme'" class="component-section">
                <div class="component-info">
                    <h2>Theme Toggle Component</h2>
                    <p>Un elegante interruptor para cambiar entre temas claro y oscuro.</p>
                    
                    <h3>Código de ejemplo</h3>
                    <pre><code>&lt;theme-toggle /&gt;</code></pre>
                </div>
                
                <div class="component-preview">
                    <h3>Vista previa</h3>
                    <div class="preview-container preview-container--centered">
                        <theme-toggle />
                    </div>
                </div>
            </div>
            
            <!-- Language Switcher Demo -->
            <div v-show="activeTab === 'language'" class="component-section">
                <div class="component-info">
                    <h2>Language Switcher Component</h2>
                    <p>Un selector para cambiar el idioma de la aplicación.</p>
                    
                    <h3>Código de ejemplo</h3>
                    <pre><code>&lt;language-switcher /&gt;</code></pre>
                </div>
                
                <div class="component-preview">
                    <h3>Vista previa</h3>
                    <div class="preview-container preview-container--centered">
                        <language-switcher />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
*{
    font-family: 'Montserrat', sans-serif;
}
.components-demo {
    padding: 0 1rem 3rem;
    max-width: 1200px;
    margin: 0 auto;
}

.demo-header {
    margin: 2rem 0;
    
    h1 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--clr-primary-400);
        margin-bottom: 0.5rem;
        position: relative;
        display: inline-block;
        
        &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--clr-primary-300), var(--clr-primary-500));
            border-radius: 2px;
        }
    }
}

.demo-nav {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--clr-primary-100);
    padding-bottom: 1rem;
    
    &__button {
        padding: 0.75rem 1.25rem;
        background-color: var(--clr-surface);
        border: 1px solid var(--clr-primary-100);
        border-radius: 0.5rem;
        color: var(--clr-text);
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
        
        &:hover {
            background-color: var(--clr-primary-100);
            color: var(--clr-bg);
        }
        
        &--active {
            background-color: var(--clr-primary-400);
            color: white;
            border-color: var(--clr-primary-400);
            
            &:hover {
                background-color: var(--clr-primary-500);
            }
        }
    }
}

.component-section {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    
    @media (min-width: 992px) {
        grid-template-columns: 1fr 1fr;
    }
}

.component-info {
    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: var(--clr-primary-500);
    }
    
    h3 {
        font-size: 1.25rem;
        margin: 1.5rem 0 0.75rem;
        color: var(--clr-primary-300);
    }
    
    p {
        line-height: 1.6;
        margin-bottom: 1rem;
    }
}

.props-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
    font-size: 0.9rem;
    
    th, td {
        text-align: left;
        padding: 0.75rem;
        border-bottom: 1px solid var(--clr-primary-100);
    }
    
    th {
        background-color: var(--clr-surface);
        font-weight: 600;
    }
    
    tr:nth-child(even) {
        background-color: rgba(0,0,0,0.02);
    }
}

.component-preview {
    background-color: var(--clr-surface);
    border-radius: 0.75rem;
    padding: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    
    h3 {
        font-size: 1.1rem;
        margin-bottom: 1rem;
        color: var(--clr-primary-400);
    }
}

.preview-container {
    background-color: var(--clr-bg);
    border-radius: 0.5rem;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    
    &--centered {
        align-items: center;
        justify-content: center;
    }
}

pre {
    background-color: var(--clr-bg);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
    
    
}
</style>
