<template>
  <div class="container">
    <header class="breadcrumb-header">
      <h1>{{ $t('assetManagement.productionLines.title') }}</h1>

      <!-- Selector de plantas -->
      <div class="plant-selector-container">
        <div class="plant-selector-group">
          <label class="plant-label">{{ $t('assetManagement.productionLines.selectPlant') }}</label>
          <div class="plant-select-wrapper">
            <select v-model="selectedPlantId" @change="onPlantChange" class="plant-select">
              <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                {{ plant.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </header>

    <main class="main-container">
      <div class="search-container" :class="{'full-width': !showDetailPanel}">
        <div class="search-actions">
          <search-component
            :placeholder="$t('assetManagement.productionLines.search.placeholder')"
            :new-label="$t('assetManagement.productionLines.search.newButton')"
            :show-new-button="true"
            @action-click="newLineAction"
          />
        </div>

        <div v-if="loading && !showDetailPanel" class="loading-indicator">
          {{ $t('assetManagement.productionLines.loading.data') }}
        </div>

        <div v-if="error && !showDetailPanel" class="error-message">
          {{ error }}
          <button @click="loadProductionLines">{{ $t('assetManagement.error.retry') }}</button>
        </div>

        <div v-if="!loading && !error" class="table-container">
          <record-table
            :columns="tableColumns"
            :data="lines"
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
            {{ $t('assetManagement.productionLines.loading.details') }}
          </div>

          <div v-if="!loading && selectedLine" class="panel-content">
            <information-panel
              :header-text="'ID: ' + selectedLineId + ' | ' + selectedLine.name"
              :show-header="true"
              :show-primary-button="true"
              :primary-button-text="$t('assetManagement.buttons.edit')"
              :show-secondary-button="true"
              :secondary-button-text="selectedLine.status === 'ACTIVE' ? $t('assetManagement.buttons.deactivate') : $t('assetManagement.buttons.activate')"
              @primary-button-click="editLine"
              @secondary-button-click="toggleLineStatus"
            >
              <info-section
                :info-type="2"
                :data="infoData"
              />

              <info-container
                :title="$t('assetManagement.productionLines.details.specifications')"
                :title-type="2"
              >
                <info-section
                  :info-type="2"
                  :data="techData"
                />
              </info-container>
            </information-panel>
          </div>
        </div>
      </transition>
    </main>

    <!-- Modal para crear/editar líneas de producción -->
    <transition name="fade">
      <div v-if="showLineModal" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <interact-production-line
            :show-modal="showLineModal"
            :production-line="isEditMode ? selectedLine : null"
            :title="isEditMode ? $t('assetManagement.productionLines.modal.edit') : $t('assetManagement.productionLines.modal.new')"
            @save="saveLine"
            @cancel="closeModal"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SearchComponent from '@/shared/components/search.component.vue';
import RecordTable from '@/shared/components/record-table.component.vue';
import InformationPanel from '@/shared/components/information-panel/information-panel.component.vue';
import InfoSection from '@/shared/components/information-panel/info-section.component.vue';
import InfoContainer from '@/shared/components/information-panel/info-container.component.vue';
import InteractProductionLine from '../components/interact-production-line.component.vue';
import { ProductionLineService } from '../services/production-line.service';
import { PlantService } from '../services/plant.service';

const { t } = useI18n();
const productionLineService = new ProductionLineService();
const plantService = new PlantService();

// Estado
const selectedLineId = ref(null);
const selectedLine = ref(null);
const showDetailPanel = ref(false);
const showLineModal = ref(false);
const isEditMode = ref(false);
const loading = ref(false);
const error = ref(null);
const plants = ref([]);
const selectedPlantId = ref(null);
const productionLines = ref([]);
const lines = ref([]);

// Columnas para la tabla
const tableColumns = [
  { key: 'id', label: t('assetManagement.productionLines.columns.id'), type: 'texto' },
  { key: 'name', label: t('assetManagement.productionLines.columns.name'), type: 'texto' },
  { key: 'plantName', label: t('assetManagement.productionLines.columns.plant'), type: 'texto' },
  { key: 'capacity', label: t('assetManagement.productionLines.columns.capacity'), type: 'texto' },
  { key: 'status', label: t('assetManagement.productionLines.columns.status'), type: 'texto' },
  { key: 'details', label: t('assetManagement.productionLines.columns.details'), type: 'informacion', ctaLabel: t('assetManagement.productionLines.columns.detailsButton') }
];

// Datos para el panel de información
const infoData = ref([]);
const techData = ref([]);

// Métodos
const loadProductionLines = async () => {
  if (!selectedPlantId.value) return;
  loading.value = true;
  error.value = null;

  try {
    const response = await productionLineService.getAllProductionLines(selectedPlantId.value);
    productionLines.value = response;
    prepareTableData();
  } catch (err) {
    console.error('Error al cargar líneas de producción:', err);
    error.value = 'Error al cargar las líneas de producción';
  } finally {
    loading.value = false;
  }
};

const prepareTableData = () => {
  lines.value = productionLines.value.map(line => ({
    id: line.id,
    name: line.name,
    plantName: getPlantName(line.plantId),
    capacity: `${line.maxUnitsPerHour} ${line.unit}/hora`,
    status: getStatusText(line.status),
    details: line.id,
    original: line
  }));
};

const getPlantName = (plantId) => {
  const plant = plants.value.find(p => p.id === plantId);
  return plant ? plant.name : '';
};

const getStatusText = (status) => {
  switch(status) {
    case 'ACTIVE': return t('assetManagement.status.active');
    case 'INACTIVE': return t('assetManagement.status.inactive');
    case 'MAINTENANCE': return t('assetManagement.status.maintenance');
    default: return 'Desconocido';
  }
};

const selectProductionLine = async (id) => {
  loading.value = true;
  try {
    const line = await productionLineService.getProductionLineById(id);
    selectedLine.value = line;
    selectedLineId.value = line.id;
    updateInfoPanel(line);
    showDetailPanel.value = true;
  } catch (err) {
    console.error(`Error al cargar la línea de producción ${id}:`, err);
    error.value = 'Error al cargar los detalles de la línea';
  } finally {
    loading.value = false;
  }
};

const updateInfoPanel = (line) => {
  infoData.value = [
    { subtitle: t('assetManagement.productionLines.columns.name'), info: line.name },
    { subtitle: t('assetManagement.productionLines.columns.plant'), info: getPlantName(line.plantId) },
    { subtitle: t('assetManagement.productionLines.details.currentStatus'), info: getStatusText(line.status) },
    { subtitle: t('assetManagement.productionLines.details.capacity'), info: `${line.maxUnitsPerHour} ${line.unit}/hora` }
  ];

  techData.value = [
    { subtitle: t('assetManagement.productionLines.details.description'), info: line.code }
  ];
};

const handleTableAction = (row) => {
  if (row && row.id) {
    selectProductionLine(row.id);
  }
};

const closeDetailPanel = () => {
  showDetailPanel.value = false;
  selectedLine.value = null;
  selectedLineId.value = null;
};

const newLineAction = () => {
  isEditMode.value = false;
  showLineModal.value = true;
};

const editLine = () => {
  isEditMode.value = true;
  showLineModal.value = true;
};

const closeModal = () => {
  showLineModal.value = false;
};

const saveLine = async (lineData) => {
  loading.value = true;

  try {
    if (isEditMode.value && selectedLine.value) {
      const updatedLine = {
        ...selectedLine.value,
        ...lineData
      };
      const result = await productionLineService.updateProductionLine(updatedLine);
      const index = productionLines.value.findIndex(l => l.id === result.id);
      if (index >= 0) {
        productionLines.value[index] = result;
        if (selectedLineId.value === result.id) {
          selectedLine.value = result;
          updateInfoPanel(result);
        }
      }
    } else {
      const newLine = {
        ...lineData,
        plantId: selectedPlantId.value,
        status: 'ACTIVE'
      };
      const created = await productionLineService.createProductionLine(newLine);
      productionLines.value.push(created);
    }
    
    prepareTableData();
    showLineModal.value = false;
  } catch (err) {
    console.error('Error al guardar la línea:', err);
    error.value = isEditMode.value ? 
      'Error al actualizar la línea' : 
      'Error al crear la línea';
  } finally {
    loading.value = false;
  }
};

const toggleLineStatus = async () => {
  if (!selectedLine.value) return;

  const newStatus = selectedLine.value.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  loading.value = true;

  try {
    const updatedLine = await productionLineService.changeProductionLineStatus(
      selectedLine.value.id,
      newStatus
    );
    
    const index = productionLines.value.findIndex(l => l.id === updatedLine.id);
    if (index >= 0) {
      productionLines.value[index] = updatedLine;
      selectedLine.value = updatedLine;
      updateInfoPanel(updatedLine);
      prepareTableData();
    }
  } catch (err) {
    console.error('Error al cambiar el estado:', err);
    error.value = 'Error al cambiar el estado de la línea';
  } finally {
    loading.value = false;
  }
};

const loadPlants = async () => {
  try {
    const response = await plantService.getAll();
    plants.value = response;
    if (response.length > 0) {
      selectedPlantId.value = response[0].id;
      loadProductionLines();
    }
  } catch (err) {
    console.error('Error al cargar las plantas:', err);
    error.value = 'Error al cargar las plantas';
  }
};

const onPlantChange = () => {
  loadProductionLines();
};

// Ciclo de vida
onMounted(() => {
  loadPlants();
});
</script>

<style scoped lang="scss">
.container {
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: var(--clr-bg);
  transition: background 0.3s;
  padding: 2rem;
}

.breadcrumb-header {
  margin-bottom: 2em;

  h1 {
    color: var(--clr-text);
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0;
    margin-bottom: 0.5rem;
  }
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

  &.full-width {
    width: 100% !important;
  }
}

.table-container {
  padding: 1em;
  border: 1px solid var(--clr-shadow);
  border-radius: var(--radius-md);
  height: 100%;
  min-width: 0;
  overflow: hidden;
  transition: box-shadow 0.3s, border 0.3s;
}

.information-panel-container {
  width: 28%;
  border-radius: var(--radius-md);
  height: 100%;
  transition: box-shadow 0.3s, border 0.3s, width 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  position: relative;
  background: var(--clr-surface);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  .panel-header {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
    z-index: 2;

    .close-button {
      background: transparent;
      border: none;
      color: var(--clr-text);
      font-size: 1.5em;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
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

.plant-selector-container {
  margin: 1.5rem 0;
  width: 100%;
  background: var(--clr-surface);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.plant-selector-group {
  display: flex;
  gap: 0.5rem;
}

.plant-label {
  font-size: 0.875rem;
  color: var(--clr-text);
  font-weight: 500;
}

.plant-select-wrapper {
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.plant-select {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--clr-primary-200);
  background-color: var(--clr-surface);
  color: var(--clr-text);
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--clr-primary-300);
    box-shadow: 0 0 0 2px rgba(var(--clr-primary-300), 0.1);
  }

  &:hover {
    border-color: var(--clr-primary-300);
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

// Media queries
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
