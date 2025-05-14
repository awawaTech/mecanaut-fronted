<template>
  <div class="container">
    <header class="breadcrumb-header">
      <h1>Planes de Mantenimiento</h1>
    </header>

    <main class="main-container">
      <div class="search-container" :class="{'full-width': !showDetailPanel}">
        <!-- El componente app-record-table ya implementa la búsqueda internamente -->
        
        <div v-if="loading && !showDetailPanel" class="loading-indicator">
          Cargando datos...
        </div>
        
        <div v-if="error && !showDetailPanel" class="error-message">
          {{ error }}
          <button @click="loadPlans()">Reintentar</button>
        </div>
        
        <div v-if="!loading && !error" class="table-container">
          <app-record-table
            :columns="tableColumns"
            :data="filteredPlansData"
            :search-placeholder="'Buscar plan de mantenimiento...'"
            :new-label="'Plan'"
            :searchable-columns="['planId', 'planName', 'productionLineId']"
            :show-new-button="true"
            @search="onSearch"
            @filter-change="onFilterChange"
            @new-click="openNewPlanModal"
            @ctaClick="onRowClick">
          </app-record-table>
        </div>
      </div>
      
      <!-- Panel de información -->
      <div v-if="showDetailPanel" class="information-panel-container">
        <div class="panel-header">
          <button class="close-button" @click="closeDetailPanel">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        
        <div v-if="loading" class="loading-indicator">
          Cargando información del plan...
        </div>
        
        <div v-if="!loading && selectedPlan">
          <app-information-panel
            :headerText="'Plan: ' + selectedPlan.planName + ' (ID: ' + selectedPlan.planId + ')'"
            :showHeader="true"
            :showPrimaryButton="true"
            :primaryButtonText="'Editar'">
            
            <app-info-section 
              :infoType="2" 
              :data="planInfoData">
            </app-info-section>
            
            <app-info-container 
              :title="'Tareas del Plan'" 
              :titleType="1">
              <app-info-list-items 
                :type="'simpleList'" 
                :items="planTasksItems">
              </app-info-list-items>
            </app-info-container>
          </app-information-panel>
        </div>
      </div>
    </main>

    <!-- Modal de selección de tipo de plan -->
    <choose-plan-type-modal 
      v-if="showChoosePlanModal" 
      @close="closeChoosePlanModal" 
      @select="openPlanForm" 
    />

    <!-- Modal de formulario para plan dinámico -->
    <dynamic-plan-form 
      v-if="showDynamicForm" 
      @close="closeDynamicForm" 
      @planCreated="onPlanCreated" 
    />

    <!-- Modal de formulario para plan estático -->
    <static-plan-form 
      v-if="showStaticForm" 
      @close="closeStaticForm" 
      @planCreated="onPlanCreated" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { maintenancePlanService } from '../services/maintenance-plan.service.js';
import { maintenanceDynamicPlanService } from '../services/maintenance-dynamic-plan.service.js';
import { MaintenancePlanModel, MaintenancePlanItemModel, MaintenancePlanTaskModel } from "../models/maintenance-plan.model.js";
import { MaintenancePlanListResponse } from "../models/maintenance-plan.response.js";

// Componentes importados con rutas relativas correctas
import AppRecordTable from '../../../shared/components/record-table.component.vue';
import AppInformationPanel from '../../../shared/components/information-panel/information-panel.component.vue';
import AppInfoSection from '../../../shared/components/information-panel/info-section.component.vue';
import AppInfoContainer from '../../../shared/components/information-panel/info-container.component.vue';
import AppInfoListItems from '../../../shared/components/information-panel/info-list-items.component.vue';

// Componentes para el flujo de creación de planes
import ChoosePlanTypeModal from '../components/choose-plan-type-modal.component.vue';
import DynamicPlanForm from '../components/dynamic-plan-form.component.vue';
import StaticPlanForm from '../components/static-plan-form.component.vue';

// Variables reactivas
const allPlansData = ref([]);
const filteredPlansData = ref([]);
const showDetailPanel = ref(false);
const selectedPlan = ref(null);
const planTasksItems = ref([]);
const planInfoData = ref([]);
const loading = ref(false);
const error = ref('');

// Estados para los modales
const showChoosePlanModal = ref(false);
const showDynamicForm = ref(false);
const showStaticForm = ref(false);

// Estado para la búsqueda y filtrado
const searchQuery = ref('');
const activeFilters = ref({});

// Configuración de filtros para el componente de búsqueda
const searchFilters = [
  {
    label: 'Línea de producción',
    value: 'productionLineId',
    options: [
      { label: 'Todas', value: '' },
      { label: 'Línea 1', value: 1 },
      { label: 'Línea 2', value: 2 },
      { label: 'Línea 3', value: 3 }
    ]
  },
  {
    label: 'Duración',
    value: 'durationDays',
    options: [
      { label: 'Todas', value: '' },
      { label: '1 día', value: 1 },
      { label: '2-3 días', value: '2-3' },
      { label: 'Más de 3 días', value: '4+' }
    ]
  }
];

// Filtra los planes según la búsqueda y filtros activos
const filterPlans = () => {
  if (!allPlansData.value.length) {
    filteredPlansData.value = [];
    return;
  }
  
  let filtered = [...allPlansData.value];
  
  // Filtrar por texto de búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(plan => 
      plan.planName?.toLowerCase().includes(query) || 
      plan.planId?.toString().includes(query)
    );
  }
  
  // Filtrar por línea de producción
  if (activeFilters.value.productionLineId) {
    filtered = filtered.filter(plan => 
      plan.productionLineId === parseInt(activeFilters.value.productionLineId)
    );
  }
  
  // Filtrar por duración
  if (activeFilters.value.durationDays) {
    const durationFilter = activeFilters.value.durationDays;
    
    if (durationFilter === 1) {
      filtered = filtered.filter(plan => plan.durationDays === 1);
    } else if (durationFilter === '2-3') {
      filtered = filtered.filter(plan => plan.durationDays >= 2 && plan.durationDays <= 3);
    } else if (durationFilter === '4+') {
      filtered = filtered.filter(plan => plan.durationDays >= 4);
    }
  }
  
  filteredPlansData.value = filtered;
};


const loadDynamicPlans = async () => {
  try {
    const dynamicPlans = await maintenanceDynamicPlanService.getAllPlans();
    console.log('Planes dinámicos de mantenimiento:', dynamicPlans);
    

    if (dynamicPlans && dynamicPlans.length) {
      dynamicPlans.forEach((plan, index) => {
        console.log(`--- Plan dinámico #${index + 1} ---`);
        console.log('ID:', plan.dynamicPlanId);
        console.log('Nombre:', plan.planName);
        console.log('Máquinas IDs:', plan.machineIds);
        console.log('Parámetro:', plan.parameter);
        console.log('Creador:', plan.userCreator);
        console.log('Tareas:');
        
        if (plan.tasks && plan.tasks.length) {
          plan.tasks.forEach((task, taskIndex) => {
            console.log(`  Tarea ${taskIndex + 1}:`);
            console.log(`    ID: ${task.taskId}`);
            console.log(`    Nombre: ${task.taskName}`);
            console.log(`    Descripción: ${task.taskDescription}`);
            console.log(`    Máquinas: ${JSON.stringify(task.machineIds)}`);
          });
        }
        
        console.log('------------------------');
      });
    }
  } catch (error) {
    console.error('Error al cargar planes dinámicos:', error);
  }
};


const tableColumns = ref([
  { key: 'planId', label: 'ID', type: 'texto' },
  { key: 'planName', label: 'Nombre', type: 'texto' },
  { key: 'productionLineId', label: 'Línea de Producción', type: 'texto', filterable: true },
  { key: 'startDate', label: 'Fecha Inicio', type: 'texto' },
  { key: 'durationDays', label: 'Duración (días)', type: 'texto', filterable: true },
  { key: 'actions', label: 'Acciones', type: 'cta', ctaLabel: 'Ver', ctaVariant: 'primary' }
]);

// Funciones para la búsqueda y filtrado
const onSearch = (query) => {
  searchQuery.value = query;
  filterPlans();
};

const onFilterChange = (filters) => {
  activeFilters.value = filters;
  filterPlans();
};

// Funciones para los planes estáticos
const loadPlans = async () => {
  loading.value = true;
  error.value = '';
  try {
    allPlansData.value = await maintenancePlanService.getAllPlans();
    filterPlans(); // Aplicar filtros a los datos cargados
  } catch (err) {
    error.value = err?.message ?? 'Error inesperado';
    allPlansData.value = [];
    filteredPlansData.value = [];
  } finally {
    loading.value = false;
  }
};

// Funciones para el manejo de modales
const openNewPlanModal = () => {
  showChoosePlanModal.value = true;
};

const closeChoosePlanModal = () => {
  showChoosePlanModal.value = false;
};

const openPlanForm = (planType) => {
  if (planType === 'dynamic') {
    showDynamicForm.value = true;
  } else if (planType === 'static') {
    showStaticForm.value = true;
  }
  closeChoosePlanModal();
};

const closeDynamicForm = () => {
  showDynamicForm.value = false;
};

const closeStaticForm = () => {
  showStaticForm.value = false;
};

// Manejar la creación de un plan
const onPlanCreated = async (plan) => {
  // Recargar los planes después de crear uno nuevo
  await loadPlans();
  await loadDynamicPlans();
};

const onRowClick = ({ row }) => {
  selectedPlan.value = row;
  
  // Preparar datos para el panel de información
  planInfoData.value = [
    { subtitle: 'ID del Plan', info: row.planId },
    { subtitle: 'Nombre', info: row.planName },
    { subtitle: 'Línea de Producción', info: row.productionLineId },
    { subtitle: 'Fecha de Inicio', info: formatDate(row.startDate) },
    { subtitle: 'Duración', info: `${row.durationDays} días` },
    { subtitle: 'Creado por', info: row.userCreator }
  ];
  
  // Preparar las tareas para el panel
  planTasksItems.value = [];
  if (row.items) {
    row.items.forEach(item => {
      if (item.tasks && Array.isArray(item.tasks)) {
        item.tasks.forEach(task => {
          const machineInfo = task.machineIds && task.machineIds.length > 0 
            ? ` - Máquinas: ${task.machineIds.join(', ')}`
            : ' - Para todas las máquinas';
            
          planTasksItems.value.push({
            model: `${task.taskName} - Día ${item.dayNumber}${machineInfo}`
          });
        });
      }
    });
  }
  
  showDetailPanel.value = true;
};

const closeDetailPanel = () => {
  showDetailPanel.value = false;
  selectedPlan.value = null;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

onMounted(() => {
  loadPlans();
  loadDynamicPlans(); // Cargar planes dinámicos al iniciar
});
</script>

<style scoped>
.container {
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: var(--clr-bg, #f5f7f9);
  transition: background 0.3s;
  padding: 1.5rem;
}

.breadcrumb-header {
  margin-bottom: 2em;
}

.main-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2.5em;
  min-height: 80vh;
  width: 100%;
  transition: gap 0.3s;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 2em;
  width: 72%;
  height: 100%;
  transition: width 0.3s ease;
}

.search-container.full-width {
  width: 100% !important;
}

.table-container {
  padding: 1em;
  border: 1px solid var(--clr-shadow, rgba(0,0,0,0.1));
  border-radius: var(--radius-md, 8px);
  height: 100%;
  min-width: 0;
  overflow: hidden;
  transition: box-shadow 0.3s, border 0.3s;
  background-color: var(--clr-surface, #fff);
}

.information-panel-container {
  width: 28%;
  border-radius: var(--radius-md, 8px);
  min-height: 70vh;
  transition: box-shadow 0.3s, border 0.3s, width 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  background-color: var(--clr-surface, #fff);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.panel-header {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 2;
}

.close-button {
  background: transparent;
  border: none;
  color: var(--clr-text, #333);
  font-size: 1.5em;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 1;
}

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: var(--clr-gris2, #666);
}

.error-message {
  text-align: center;
  padding: 1rem;
  color: var(--clr-error, #f44336);
  background-color: var(--clr-surface, #fff);
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Tablet: apila los paneles */
@media (max-width: 1024px) {
  .main-container {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5em;
    min-height: unset;
  }
  .search-container,
  .information-panel-container {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }
  .information-panel-container {
    margin-top: 0.5em;
    height: auto;
    min-height: 50vh;
  }
}

/* Móvil */
@media (max-width: 600px) {
  .container {
    padding: 1em 0.2em;
  }
  .breadcrumb-header {
    margin-bottom: 1em;
  }
  .main-container {
    gap: 1em;
  }
  .table-container,
  .information-panel-container {
    border-radius: 12px;
    box-shadow: 0 1px 4px 0 var(--clr-shadow, rgba(0,0,0,0.1));
  }
  .information-panel-container {
    margin-top: 0.5em;
  }
}
</style>
