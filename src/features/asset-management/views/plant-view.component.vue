<script>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import HeaderComponent from '@/shared/components/header.component.vue';
import RecordTable from '@/shared/components/record-table.component.vue';
import InformationPanel from '@/shared/components/information-panel/information-panel.component.vue';
import InfoSection from '@/shared/components/information-panel/info-section.component.vue';
import InfoContainer from '@/shared/components/information-panel/info-container.component.vue';
import SearchComponent from '@/shared/components/search.component.vue';
import InteractPlant from '../components/interact-plant.component.vue';
import { PlantService } from '../services/plant.service';
import { ProductionLineService } from '../services/production-line.service';

export default {
  name: 'PlantView',
  components: {
    HeaderComponent,
    RecordTable,
    InformationPanel,
    InfoSection,
    InfoContainer,
    SearchComponent,
    InteractPlant
  },
  setup() {
    const { t } = useI18n();
    const plantService = new PlantService();
    const productionLineService = new ProductionLineService();

    // Estado
    const plants = ref([]);
    const filteredPlants = ref([]);
    const selectedPlant = ref(null);
    const selectedPlantId = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const showDetailPanel = ref(false);
    const showPlantModal = ref(false);
    const isEditMode = ref(false);
    const allProductionLines = ref([]);

    // Configuración de la tabla
    const tableColumns = [
      { key: 'name', label: t('assetManagement.plants.columns.name'), type: 'texto' },
      { key: 'address', label: t('assetManagement.plants.columns.address'), type: 'texto' },
      { key: 'city', label: t('assetManagement.plants.columns.city'), type: 'texto' },
      { key: 'country', label: t('assetManagement.plants.columns.country'), type: 'texto' },
      { key: 'contactPhone', label: t('assetManagement.plants.columns.contactPhone'), type: 'texto' },
      { key: 'contactEmail', label: t('assetManagement.plants.columns.contactEmail'), type: 'texto' },
      { key: 'active', label: t('assetManagement.plants.columns.status'), type: 'texto' },
      { key: 'actions', label: t('common.actions'), type: 'informacion', ctaLabel: t('common.view') }
    ];

    // Métodos
    const loadPlants = async () => {
      loading.value = true;
      error.value = null;
      try {
        const response = await plantService.getAll();
        plants.value = response;
        filteredPlants.value = [...response];
      } catch (err) {
        console.error('Error al cargar plantas:', err);
        error.value = 'Error al cargar plantas';
      } finally {
        loading.value = false;
      }
    };

    const showPlantDetails = async (plantId) => {
      selectedPlantId.value = plantId;
      loading.value = true;
      try {
        const plant = await plantService.getById(plantId);
        selectedPlant.value = plant;
        showDetailPanel.value = true;
      } catch (err) {
        console.error(`Error al cargar la planta ${plantId}:`, err);
        error.value = 'Error al cargar la planta';
      } finally {
        loading.value = false;
      }
    };

    const getStatusLabel = (status) => {
      return status ? t('assetManagement.status.active') : t('assetManagement.status.inactive');
    };

    const closeDetailPanel = () => {
      showDetailPanel.value = false;
      selectedPlant.value = null;
      selectedPlantId.value = null;
    };

    const handleTableAction = ({ row }) => {
      showPlantDetails(row.id);
    };

    const newPlantAction = () => {
      isEditMode.value = false;
      showPlantModal.value = true;
    };

    const editPlant = () => {
      isEditMode.value = true;
      showPlantModal.value = true;
    };

    const closeModal = () => {
      showPlantModal.value = false;
    };

    const onSavePlant = async (plantData) => {
      try {
        if (isEditMode.value && selectedPlantId.value) {
          await plantService.update(selectedPlantId.value, {
            ...plantData,
            id: selectedPlantId.value
          });
        } else {
          await plantService.create(plantData);
        }
        
        showPlantModal.value = false;
        await loadPlants();
        
        if (isEditMode.value && selectedPlantId.value) {
          await showPlantDetails(selectedPlantId.value);
        }
      } catch (err) {
        console.error('Error al guardar la planta:', err);
        error.value = isEditMode.value ? 
          'Error al actualizar la planta' : 
          'Error al crear la planta';
      }
    };

    const togglePlantStatus = async () => {
      if (!selectedPlant.value || !selectedPlantId.value) return;

      const newStatus = !selectedPlant.value.active;
      try {
        await plantService.update(selectedPlantId.value, {
          id: selectedPlantId.value,
          active: newStatus
        });
        await loadPlants();
        if (selectedPlantId.value) {
          await showPlantDetails(selectedPlantId.value);
        }
      } catch (err) {
        console.error('Error al actualizar el estado:', err);
        error.value = 'Error al actualizar el estado';
      }
    };

    // Ciclo de vida
    onMounted(() => {
      loadPlants();
    });

    return {
      plants,
      filteredPlants,
      selectedPlant,
      loading,
      error,
      showDetailPanel,
      showPlantModal,
      isEditMode,
      tableColumns,
      handleTableAction,
      closeDetailPanel,
      newPlantAction,
      editPlant,
      closeModal,
      togglePlantStatus,
      getStatusLabel,
      loadPlants,
      onSavePlant
    };
  }
};
</script>

<template>
  <div class="container">
    <div class="header-main">
      <h1>{{ $t('assetManagement.breadcrumb.plants') }}</h1>
      <div class="divider"></div>
    </div>

    <main class="main-container">
      <div class="search-container" :class="{'full-width': !showDetailPanel}">
        <div class="search-actions">
          <search-component
            :placeholder="$t('assetManagement.search.plants.placeholder')"
            :new-label="$t('assetManagement.search.plants.newButton')"
            :show-new-button="true"
            @action-click="newPlantAction"
          />
        </div>

        <div v-if="loading && !showDetailPanel" class="loading-indicator">
          {{ $t('assetManagement.loading.plants') }}
        </div>

        <div v-if="error && !showDetailPanel" class="error-message">
          {{ error }}
          <button @click="loadPlants">{{ $t('assetManagement.error.retry') }}</button>
        </div>

        <div v-if="!loading && !error" class="table-container">
          <record-table
            :columns="tableColumns"
            :data="filteredPlants"
            @info-click="handleTableAction"
          />
        </div>
      </div>

      <!-- Panel de información -->
      <transition name="slide">
        <div v-if="showDetailPanel" class="information-panel-container">
          <div class="panel-header">
            <button class="close-button" @click="closeDetailPanel">
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div v-if="loading" class="loading-indicator">
            {{ $t('assetManagement.loading.plantInfo') }}
          </div>

          <div v-if="!loading && selectedPlant" class="panel-content">
            <information-panel
              :header-text="'ID: ' + selectedPlantId + ' | ' + selectedPlant.name"
              :show-header="true"
              :show-primary-button="true"
              :primary-button-text="$t('assetManagement.buttons.edit')"
              :show-secondary-button="true"
              :secondary-button-text="selectedPlant.active ? $t('assetManagement.buttons.deactivate') : $t('assetManagement.buttons.activate')"
              @primary-button-click="editPlant"
              @secondary-button-click="togglePlantStatus"
              @close-panel="closeDetailPanel"
            >
              <!-- Información básica -->
              <info-section
                :info-type="2"
                :data="[
                  { subtitle: $t('assetManagement.plants.details.name'), info: selectedPlant.name },
                  { subtitle: $t('assetManagement.plants.details.address'), info: selectedPlant.address },
                  { subtitle: $t('assetManagement.plants.details.city'), info: selectedPlant.city },
                  { subtitle: $t('assetManagement.plants.details.country'), info: selectedPlant.country },
                  { subtitle: $t('assetManagement.plants.details.contactPhone'), info: selectedPlant.contactPhone },
                  { subtitle: $t('assetManagement.plants.details.contactEmail'), info: selectedPlant.contactEmail },
                  { subtitle: $t('assetManagement.plants.details.status'), info: getStatusLabel(selectedPlant.active) }
                ]"
              />

              <!-- Líneas de producción -->
              <info-container
                :title="$t('assetManagement.plants.details.productionLines')"
                :title-type="2"
              >
              </info-container>
            </information-panel>
          </div>
        </div>
      </transition>
    </main>

    <!-- Modal para crear/editar plantas -->
    <transition name="fade">
      <div v-if="showPlantModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <interact-plant
            :show-modal="showPlantModal"
            :plant-to-edit="isEditMode ? selectedPlant : null"
            :title="isEditMode ? $t('assetManagement.plants.modal.edit') : $t('assetManagement.plants.modal.new')"
            :available-production-lines="allProductionLines"
            @save="onSavePlant"
            @cancel="closeModal"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: var(--clr-bg);
  transition: background 0.3s;
  padding: 2rem;
}

.header-main {
  align-items: center;
  width: 100%;
  margin-bottom: 2.5rem;
  padding: 0 1rem;

  h1 {
    color: var(--clr-text);
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 0.5rem;
  }

  .divider {
    margin-top: 1rem;
    height: 2px;
    background: linear-gradient(90deg, var(--clr-primary-300) 0%, var(--clr-primary-100) 100%);
    width: 100%;
    border-radius: 2px;
  }
}

.main-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2.5rem;
  min-height: calc(100vh - 200px);
  width: 100%;
  transition: gap 0.3s;
  padding: 0 1rem;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 72%;
  height: 100%;
  transition: width 0.3s ease;
  
  &.full-width {
    width: 100% !important;
  }

  .search-actions {
    margin-bottom: 1rem;
  }
}

.table-container {
  padding: 1.5rem;
  border: 1px solid var(--clr-shadow);
  border-radius: var(--radius-md);
  background: var(--clr-surface);
  height: 100%;
  min-width: 0;
  overflow: hidden;
  transition: box-shadow 0.3s, border 0.3s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.information-panel-container {
  width: 28%;
  border-radius: var(--radius-md);
  background: var(--clr-surface);
  height: 100%;
  transition: box-shadow 0.3s, border 0.3s, width 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  .panel-header {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
    
    .close-button {
      background: transparent;
      border: none;
      color: var(--clr-text);
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
      padding: 0.5rem;
      border-radius: 50%;
      
      &:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .panel-content {
    padding: 1.5rem;
  }
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  color: var(--clr-primary-400);
  font-weight: 500;
}

.error-message {
  color: var(--clr-danger);
  padding: 1em;
  border: 1px solid var(--clr-danger);
  border-radius: var(--radius-md);
  background-color: var(--clr-danger-050);
  display: flex;
  flex-direction: column;
  gap: 1em;
  
  button {
    align-self: flex-end;
    background-color: var(--clr-primary-300);
    color: white;
    border: none;
    padding: 0.5em 1em;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--clr-primary-400);
    }
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  max-width: 90%;
  width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: var(--clr-bg);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform-origin: center center;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--clr-primary-200);
    border-radius: 4px;
  }
}

// Transiciones
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
  }
}

@media (max-width: 600px) {
  .container {
    padding: 1em 0.2em;
  }
  
  .main-container {
    gap: 1em;
  }
  
  .table-container,
  .information-panel-container {
    border-radius: 12px;
    box-shadow: 0 1px 4px 0 var(--clr-shadow);
  }
  
  .modal-container {
    width: 95%;
  }
}
</style>
