<template>
  <div class="maintenance-plan-container">
    <div class="search-container">
      <Search 
        :filters="filters"
        @search="handleSearch"
        @filter-change="handleFilterChange"
        @action-click="showNewPlanModal"
      />
    </div>
    
    <div class="table-container" v-if="maintenancePlans.length > 0">
      <RecordTable 
        :data="maintenancePlans"
        :columns="tableColumns"
        @ctaClick="handleRowAction"
      />
    </div>
    <div v-else class="empty-state">
      <i class="pi pi-calendar"></i>
      <p>No hay planes de mantenimiento disponibles</p>
    </div>
    
    <!-- Modal de creación de plan de mantenimiento -->
    <NewMaintenancePlan 
      :show="showModal" 
      @close="closeModal"
      @save="savePlan"
    />
  </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import Search from '../../../shared/components/search.component.vue';
import RecordTable from '../../../shared/components/record-table.component.vue';
import NewMaintenancePlan from '../components/new-maintenance-plan.component.vue';
import { MaintenancePlanService } from '../services/maintenance-plan.service';

export default {
  name: "MaintenancePlanView",
  components: {
    Search,
    RecordTable,
    NewMaintenancePlan
  },
  setup() {
    // Estado
    const maintenancePlans = ref([]);
    const isLoading = ref(false);
    const error = ref(null);
    const showModal = ref(false);
    
    // Servicio
    const maintenancePlanService = new MaintenancePlanService();
    
    // Configuración de la tabla
    const tableColumns = [
      { 
        key: 'planId', 
        label: 'ID',
        type: 'texto'
      },
      { 
        key: 'productionLineId', 
        label: 'Línea de Producción',
        type: 'texto'
      },
      { 
        key: 'startDate', 
        label: 'Fecha de Inicio',
        type: 'texto'
      },
      { 
        key: 'durationDays', 
        label: 'Duración (días)',
        type: 'numero'
      },
      {
        key: 'actions',
        label: 'Acciones',
        type: 'cta',
        ctaLabel: 'Ver detalle',
        ctaVariant: 'primary'
      }
    ];
    
    // Filtros para el componente de búsqueda
    const filters = [
      {
        value: 'productionLine',
        label: 'Línea de Producción',
        options: [
          { value: '', label: 'Todas' },
          { value: '101', label: 'Línea 101' },
          { value: '102', label: 'Línea 102' }
        ]
      },
      {
        value: 'startDate',
        label: 'Fecha de Inicio',
        options: [
          { value: '', label: 'Todas' },
          { value: 'today', label: 'Hoy' },
          { value: 'week', label: 'Esta semana' },
          { value: 'month', label: 'Este mes' }
        ]
      },
      {
        value: 'status',
        label: 'Estado',
        options: [
          { value: '', label: 'Todos' },
          { value: 'active', label: 'Activo' },
          { value: 'completed', label: 'Completado' },
          { value: 'pending', label: 'Pendiente' }
        ]
      }
    ];
    
    // Métodos
    const loadMaintenancePlans = async () => {
      try {
        isLoading.value = true;
        error.value = null;
        
        const plans = await maintenancePlanService.getAllPlans();
        
        // Agregar un id único para cada fila si no tiene un planId
        maintenancePlans.value = plans.map((plan, index) => {
          // Formatear la fecha para mostrarla correctamente
          const formattedPlan = {
            ...plan,
            startDate: new Date(plan.startDate).toLocaleDateString(),
            id: plan.planId || `plan-${index}`
          };
          return formattedPlan;
        });
        
        console.log('Planes cargados:', maintenancePlans.value);
      } catch (err) {
        error.value = 'Error al cargar los planes de mantenimiento';
        console.error(error.value, err);
      } finally {
        isLoading.value = false;
      }
    };
    
    const handleSearch = (searchTerm) => {
      console.log('Búsqueda:', searchTerm);
      // Implementar lógica de búsqueda
    };
    
    const handleFilterChange = (filters) => {
      console.log('Filtros cambiados:', filters);
      // Implementar lógica de filtrado
    };
    
    const showNewPlanModal = () => {
      showModal.value = true;
    };
    
    const closeModal = () => {
      showModal.value = false;
    };
    
    const savePlan = (planData) => {
      console.log('Guardando plan:', planData);
      // Aquí se implementaría la lógica para guardar el plan
      closeModal();
      // Recargar los planes después de guardar uno nuevo
      loadMaintenancePlans();
    };
    
    const handleRowAction = ({ row, column }) => {
      console.log('Acción en fila:', row, 'columna:', column);
      // Navegar al detalle del plan o realizar acción según el botón
    };
    
    // Ciclo de vida
    onMounted(() => {
      loadMaintenancePlans();
    });
    
    return {
      maintenancePlans,
      isLoading,
      error,
      tableColumns,
      filters,
      showModal,
      handleSearch,
      handleFilterChange,
      handleRowAction,
      showNewPlanModal,
      closeModal,
      savePlan
    };
  }
};
</script>
  
<style scoped lang="scss">
.maintenance-plan-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  .search-container {
    background-color: var(--surface-card);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .table-container {
    background-color: var(--surface-card);
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--surface-card);
    border-radius: 8px;
    padding: 3rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    
    i {
      font-size: 3rem;
      color: var(--text-color-secondary);
      margin-bottom: 1rem;
    }
    
    p {
      color: var(--text-color-secondary);
      font-size: 1.2rem;
    }
  }
}
</style>
  