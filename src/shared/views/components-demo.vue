<script>
import HeaderComponent from '../components/header.component.vue';
import ThemeToggle from '../components/theme-toggle.component.vue';
import LanguageSwitcher from '../components/language-switcher.component.vue';
import NotificationContainer from '../components/notifications/notification-container.component.vue';
import InformationPanel from '../components/information-panel/information-panel.component.vue';
import InfoSection from '../components/information-panel/info-section.component.vue';
import InfoContainer from '../components/information-panel/info-container.component.vue';
import InfoListItems from '../components/information-panel/info-list-items.component.vue';
import { useI18n } from 'vue-i18n';
import Button from '../components/button.component.vue';
import Search from '../components/search.component.vue';
import RecordTable from '../components/record-table.component.vue';
import SidebarMecanaut from '../components/sidebar-mecanaut.component.vue';

export default {
    name: 'ComponentsDemo',
    components: {
        HeaderComponent,
        ThemeToggle,
        LanguageSwitcher,
        NotificationContainer,
        InformationPanel,
        InfoSection,
        InfoContainer,
        InfoListItems,
        Button,
        Search,
        RecordTable,
        SidebarMecanaut
    },
    setup() {
        const { t } = useI18n();
        return { t };
    },
    data() {
        return {
            activeTab: 'header',
            components: [
                { id: 'header', name: 'Header', component: 'HeaderComponent' },
                { id: 'theme', name: 'Theme Toggle', component: 'ThemeToggle' },
                { id: 'language', name: 'Language Switcher', component: 'LanguageSwitcher' },
                { id: 'notifications', name: 'Notifications', component: 'NotificationContainer' },
                { id: 'infopanel', name: 'Information Panel', component: 'InformationPanel' },
                { id: 'button', name: 'Button', component: 'Button' },
                { id: 'search', name: 'Search', component: 'Search' },
                { id: 'table', name: 'Record Table', component: 'RecordTable' }
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
            languageEvents: [],
            notificationsList: [
            { title: 'Notificación 1', message: 'Mensaje de la notificación 1', type: 'notification', icon: 'error' },
            { title: 'Notificación 2', message: 'Mensaje de la notificación 2', type: 'error', icon: 'error' },
            { title: 'Notificación 3', message: 'Mensaje de la notificación 3', type: 'notification', icon: 'FiAirplay ' }
        ],
            // Datos para el Information Panel
            especificacionesData: [
                { subtitle: 'Modelo', info: 'Excavadora XYZ-200' },
                { subtitle: 'Marca', info: 'CAT' },
                { subtitle: 'Año', info: '2021' },
                { subtitle: 'Potencia', info: '220 HP' }
            ],
            actividadData: [
                { subtitle: 'Última actividad', info: '15/06/2023' },
                { subtitle: 'Horas de trabajo', info: '1,200 hrs' }
            ],
            statisticsData: [
                { stadistic: '720', percentage: '85%', description: 'Rendimiento general' },
                { stadistic: '120', percentage: '75%', description: 'Días sin incidentes' }
            ],
            mantenimientoItems: [
                { date: '10/05/2023', type: 'Preventivo', responsible: 'Juan Pérez' },
                { date: '15/03/2023', type: 'Correctivo', responsible: 'María García' }
            ],
            maquinariasItems: [
                { model: 'Excavadora XYZ-100' },
                { model: 'Bulldozer AB-200' },
                { model: 'Grúa G-300' }
            ],
            movimientosItems: [
                { date: '25/06/2023', action: 'Traslado', order: 'Orden #12345' },
                { date: '10/06/2023', action: 'Préstamo', order: 'Orden #12340' }
            ],
            // Datos para el botón de demostración
            buttonVariants: ['primary', 'secondary', 'danger', 'success'],
            buttonSizes: ['sm', 'md', 'lg'],

            // Datos para la tabla de demostración
            demoTableColumns: [
                { key: 'nombre', label: 'Nombre', type: 'texto' },
                { key: 'edad', label: 'Edad', type: 'numero' },
                { key: 'descripcion', label: 'Info', type: 'informacion' },
                { 
                    key: 'accion', 
                    label: 'Acciones', 
                    type: 'cta',
                    ctaLabel: 'Ver perfil',
                    ctaVariant: 'primary' 
                }
            ],
            demoTableData: [
                { 
                    id: 1, 
                    nombre: 'Juan Pérez', 
                    edad: 28, 
                    descripcion: 'Desarrollador Full Stack con 5 años de experiencia',
                },
                { 
                    id: 2, 
                    nombre: 'María García', 
                    edad: 32, 
                    descripcion: 'Diseñadora UX/UI especializada en aplicaciones móviles',
                },
                { 
                    id: 3, 
                    nombre: 'Carlos López', 
                    edad: 25, 
                    descripcion: 'Desarrollador Frontend Junior',
                }
            ],

            // Datos para el Search de demostración
            demoFilters: [
                {
                    label: 'Categoría',
                    value: 'category',
                    options: [
                        { label: 'Todas', value: 'all' },
                        { label: 'Electrónica', value: 'electronics' },
                        { label: 'Ropa', value: 'clothing' }
                    ]
                },
                {
                    label: 'Estado',
                    value: 'status',
                    options: [
                        { label: 'Todos', value: 'all' },
                        { label: 'Activo', value: 'active' },
                        { label: 'Inactivo', value: 'inactive' }
                    ]
                }
            ]
        }
    },
    methods: {
        setActiveTab(tabId) {
            this.activeTab = tabId;
        },
        toggleDemoSidebar() {
            // Solo para demostración
            alert('Evento toggle-sidebar emitido');
        },
        handleSearch(text) {
            console.log('Búsqueda:', text);
        },
        handleFilterChange(filters) {
            console.log('Filtros:', filters);
        },
        handleNewClick() {
            console.log('Crear nuevo elemento');
        },
        handleTableCtaClick({ row, column }) {
            console.log('CTA clicked:', { row, column });
        },
        handleButtonClick() {
            console.log('Botón clickeado');
        }
    }
}
</script>

<template>
    <div class="components-demo">
        <SidebarMecanaut 
            userName="Usuario Demo"
            userRole="Administrador"
        />

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

            <!--search-->
            <div v-show="activeTab === 'search'" class="component-section">
                <div class="component-info">
                    <h2>Search Component</h2>
                    <p>Un componente de búsqueda que permite filtrar y buscar elementos en una lista.</p>

                    <h3>Código de ejemplo</h3>
                    <pre><code>&lt;Search 
                        :filters="demoFilters"
                        @search="handleSearch"
                        @filter-change="handleFilterChange"
                        @action-click="handleNewClick"
                    /&gt;</code></pre>
                </div>

                <div class="component-preview">
                    <h3>Vista previa</h3>
                    <div class="preview-container">
                            <Search 
                            :filters="demoFilters"
                            @search="handleSearch"
                            @filter-change="handleFilterChange"
                            @action-click="handleNewClick"
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

            <!-- NotificationsContainer Demo -->
            <div v-show="activeTab === 'notifications'" class="component-section">
            <div class="component-info">
                <h2>Notification Container Component</h2>
                <p>Un contenedor para mostrar una lista de notificaciones. Las notificaciones se pasan como un array de objetos con propiedades como título, mensaje, tipo e icono.</p>

                <h3>Código de ejemplo</h3>
                <pre><code>&lt;NotificationContainer :title="'Notificaciones de ejemplo'" :notifications="notificationsList" /&gt;</code></pre>
            </div>

            <div class="component-preview">
                <h3>Vista previa</h3>
                <div class="preview-container">
                    <NotificationContainer 
                        :title="'Notificaciones de ejemplo'" 
                        :notifications="notificationsList"
                    />
                </div>
            </div>
            </div>

            <!-- Information Panel Demo -->
            <div v-show="activeTab === 'infopanel'" class="component-section">
                <div class="component-info">
                    <h2>Information Panel Component</h2>
                    <p>Un panel de información flexible que contiene múltiples secciones y contenedores para mostrar diferentes tipos de datos.</p>

                    <h3>Código de ejemplo</h3>
                    <pre><code>&lt;InformationPanel headerText="Panel de Información Completo"&gt;
                        &lt;InfoSection 
                            :infoType="1" 
                            :showSubtitle="true"
                            subtitleText="Especificaciones:" 
                            :data="especificacionesData"
                        /&gt;
                    
                    &lt;InfoSection 
                        :infoType="2" 
                        :showSubtitle="true"
                        subtitleText="Actividad:" 
                        :data="actividadData"
                    /&gt;
  
                    &lt;InfoContainer 
                        title="Historial de mantenimiento" 
                        :titleType="1"
                    &gt;
                        &lt;InfoListItems 
                        type="maintenance" 
                        :items="mantenimientoItems"
                        /&gt;
                    &lt;/InfoContainer&gt;
                    &lt;/InformationPanel&gt;</code></pre>
                                    </div>

                <div class="component-preview">
                    <h3>Vista previa</h3>
                    <div class="preview-container preview-container--large">
                        <InformationPanel headerText="Panel de Información Completo">
                            <!-- Sección 1: Especificaciones -->
                            <InfoSection 
                                :infoType="1" 
                                :showSubtitle="true"
                                subtitleText="Especificaciones:" 
                                :data="especificacionesData">
                            </InfoSection>
                            
                            <!-- Sección 2: Actividad -->
                            <InfoSection 
                                :infoType="2" 
                                :showSubtitle="true"
                                subtitleText="Actividad:" 
                                :data="actividadData">
                            </InfoSection>
                            
                            <!-- Sección 3: Estadísticas -->
                            <InfoSection 
                                :infoType="3" 
                                :statisticsData="statisticsData">
                            </InfoSection>
                            
                            <!-- Historial de mantenimiento -->
                            <InfoContainer 
                                title="Historial de mantenimiento" 
                                :titleType="1">
                                <InfoListItems 
                                    type="maintenance" 
                                    :items="mantenimientoItems">
                                </InfoListItems>
                            </InfoContainer>
                            
                            <!-- Maquinarias asociadas -->
                            <InfoContainer 
                                title="Lista Simple de maquinarias" 
                                :titleType="1">
                                <InfoListItems 
                                    type="simpleList" 
                                    :items="maquinariasItems">
                                </InfoListItems>
                            </InfoContainer>

                            <!-- Historial de movimientos -->
                            <InfoContainer 
                                title="Historial de movimientos" 
                                :titleType="1">
                                <InfoListItems 
                                    type="movements" 
                                    :items="movimientosItems">
                                </InfoListItems>
                            </InfoContainer>
                            
                            <!-- Anotaciones -->
                            <InfoContainer 
                                title="Anotaciones" 
                                :titleType="2">
                                <InfoListItems 
                                    type="default" 
                                    :items="[{text: 'Muestra texto de forma simple'}]">
                                </InfoListItems>
                            </InfoContainer>
                        </InformationPanel>
                    </div>
                </div>
            </div>

            <!-- Button Demo -->
            <div v-show="activeTab === 'button'" class="component-section">
                <div class="component-info">
                    <h2>Button Component</h2>
                    <p>Un componente de botón versátil con diferentes variantes, tamaños y estados.</p>
                    
                    <h3>Variantes</h3>
                    <div class="button-demo-group">
                        <Button 
                            v-for="variant in buttonVariants"
                            :key="variant"
                            :variant="variant"
                            @clicked="handleButtonClick"
                        >
                            Botón {{ variant }}
                        </Button>
                    </div>

                    <h3>Tamaños</h3>
                    <div class="button-demo-group">
                        <Button 
                            v-for="size in buttonSizes"
                            :key="size"
                            :size="size"
                            @clicked="handleButtonClick"
                        >
                            Botón {{ size }}
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Table Demo -->
            <div v-show="activeTab === 'table'" class="component-section">
                <div class="component-info">
                    <h2>Record Table Component</h2>
                    <p>Una tabla de registros versátil que admite diferentes tipos de columnas y acciones.</p>

                    <h3>Props</h3>
                    <table class="props-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>columns</td>
                                <td>Array</td>
                                <td>Array de objetos que define las columnas de la tabla. Cada columna debe tener: key, label, y type (texto, numero, informacion, cta)</td>
                            </tr>
                            <tr>
                                <td>data</td>
                                <td>Array</td>
                                <td>Array de objetos con los datos a mostrar en la tabla</td>
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
                            <tr>
                                <td>ctaClick</td>
                                <td>{ row, column }</td>
                                <td>Emitido cuando se hace clic en un botón CTA de la tabla</td>
                            </tr>
                        </tbody>
                    </table>

                    <h3>Código de ejemplo</h3>
                    <pre><code>&lt;record-table 
    :columns="demoTableColumns"
    :data="demoTableData"
    @ctaClick="handleTableCtaClick"
/&gt;</code></pre>
                </div>

                <div class="component-preview">
                    <h3>Vista previa</h3>
                    <div class="preview-container">
                        <record-table 
                            :columns="demoTableColumns"
                            :data="demoTableData"
                            @ctaClick="handleTableCtaClick"
                        />
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
    margin-left: 100px;
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

    &--large {
        min-height: 500px;
        overflow-y: auto;
    }
}

pre {
    background-color: var(--clr-bg);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
    
    
}

.information-panel {
  width: 100%;
  padding: 2.3em 2.1em;
  border: 2px solid #F1E9F7;
  border-radius: 8px;
  background-color: var(--clr-bg);
}

.list-statistics {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5em;
  
  .stadistic {
    font-size: 1.8em;
    font-weight: 730;
    color: #6DA0E1;
  }
  /* ... */
}
</style>
