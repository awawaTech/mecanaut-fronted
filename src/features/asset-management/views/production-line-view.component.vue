<template>
  <div class="container">
    <div class="header-main">
      <h1>{{ $t('assetManagement.productionLines.title') }}</h1>
      <div class="divider"></div>
    </div>

    <!-- Selector de plantas -->
    <div class="plant-selector">
      <label for="plant-select">{{ $t('assetManagement.productionLines.selectPlant') }}</label>
      <select 
        id="plant-select"
        v-model="selectedPlantId" 
        @change="onPlantChange"
        class="plant-select"
      >
        <option disabled :value="null">Select a plant</option>
        <option v-for="plant in plants" :key="plant.id" :value="plant.id">
          {{ plant.name }}
        </option>
      </select>
    </div>

    <div class="main-content">
      <div class="left-container">
        <div v-if="loading" class="loading-indicator">
          {{ $t('assetManagement.productionLines.loading.data') }}
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
          <button @click="loadProductionLines">{{ $t('assetManagement.error.retry') }}</button>
        </div>

        <div v-if="!loading && !error">
          <RecordTable
            :columns="tableColumns"
            :data="lines"
            :searchable-columns="['name', 'code']"
            search-placeholder="Buscar por nombre o código..."
            :show-new-button="true"
            :new-label="$t('assetManagement.productionLines.search.newButton')"
            @info-click="handleTableAction"
            @new-click="newLineAction"
          />
        </div>
      </div>

      <div class="right-container" :class="{ 'show-panel': showDetailPanel }">
        <div v-if="loading" class="loading-indicator">
          {{ $t('assetManagement.productionLines.loading.details') }}
        </div>

        <information-panel 
          v-if="!loading && selectedLine"
          class="info-panel"
        >
          <template #header>
            <div class="panel-header">
              <h2>{{ 'ID: ' + selectedLineId + ' | ' + selectedLine.name }}</h2>
            </div>
          </template>

          <info-section
            :info-type="2"
            :title="$t('assetManagement.productionLines.details.general')"
            :data="infoData"
          />

          <info-section
            :info-type="2"
            :title="$t('assetManagement.productionLines.details.specifications')"
            :data="techData"
          />

          <div class="panel-actions">
            <div class="actions-row">
              <ButtonComponent
                variant="secondary"
                size="sm"
                icon-left="pi pi-times"
                @click="closeDetailPanel"
              >
                {{ $t('common.close') }}
              </ButtonComponent>
            </div>
          </div>
        </information-panel>
      </div>
    </div>

    <!-- Modal para crear/editar líneas de producción -->
    <interact-production-line
      v-if="showLineModal"
      :show-modal="showLineModal"
      :production-line="isEditMode ? selectedLine : null"
      :title="isEditMode ? $t('assetManagement.productionLines.modal.edit') : $t('assetManagement.productionLines.modal.new')"
      @submit="saveLine"
      @cancel="closeModal"
    />
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
import { ProductionLineApiService } from '../services/production-line-api.service.js';
import AuthService from "@/features/authentication/services/auth.service.js";
import {PlantApiService} from "@/features/asset-management/services/plant-api.service.js";
import ProductionLineFormModal from "@/features/asset-management/components/interact-production-line.component.vue";
import ButtonComponent from '@/shared/components/button.component.vue';


const { t } = useI18n();

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
const showCreateModal = ref(false);
const showEditModal = ref(false);

// Columnas para la tabla
const getTableColumns = () => [
  { key: 'id', label: t('assetManagement.productionLines.columns.id'), type: 'texto' },
  { key: 'name', label: t('assetManagement.productionLines.columns.name'), type: 'texto' },
  { key: 'plantName', label: t('assetManagement.productionLines.columns.plant'), type: 'texto' },
  { key: 'capacityUnitsPerHour', label: t('assetManagement.productionLines.columns.capacity'), type: 'texto' },
  { key: 'status', label: t('assetManagement.productionLines.columns.status'), type: 'texto' },
  { key: 'details', label: t('assetManagement.productionLines.columns.details'), type: 'informacion', ctaLabel: t('assetManagement.productionLines.columns.detailsButton') }
];

const tableColumns = computed(() => getTableColumns());

// Datos para el panel de información
const infoData = ref([]);
const techData = ref([]);


// Métodos

const loadData = async () => {
  const plantList = await PlantApiService.getPlants();
  console.log('🌱 Plantas cargadas:', plantList);
  plants.value = plantList;
  selectedPlantId.value = plantList[0]?.id ?? null;
  await loadProductionLines();
};
const loadProductionLines = async () => {
  if (!selectedPlantId.value) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await ProductionLineApiService.getProductionLines(selectedPlantId.value);

    // 🧠 Asegúrate de que response contiene id, name, plantId...
    console.log('🔄 Línea de producción cruda:', response);

    productionLines.value = response.map(l => ({
      id: l.id,
      name: l.name,
      code: l.code,
      plantId: l.plantId,
      capacityUnitsPerHour: l.capacityUnitsPerHour,
      unit: l.unit,
      status: l.status
    }));

    prepareTableData();
  } catch (err) {
    console.error('❌ Error al cargar líneas de producción:', err);
    error.value = 'Error al cargar las líneas de producción. Ver consola para más detalles.';
    productionLines.value = [];
    lines.value = [];
  } finally {
    loading.value = false;
  }
};

const getPlantName = (plantId) => {
  const plant = plants.value.find(p => p.id === plantId);
  return plant ? plant.name : 'Desconocido';
};

const prepareTableData = () => {
  console.log('⏳ Entrando a prepareTableData con:', productionLines.value);

  lines.value = [];

  for (const line of productionLines.value) {
    console.log('📦 Procesando línea:', line);

    try {
      const processed = {
        id: line.id,
        name: line.name,
        plantName: getPlantName(line.plantId),
        capacityUnitsPerHour: `${line.capacityUnitsPerHour || 0} unidades/hora`,
        status: getStatusText(line.status),
        details: line.id,
        original: line
      };

      lines.value.push(processed);
    } catch (err) {
      console.error('❌ Error al procesar una línea:', err, line);
    }
  }

  console.log('✅ Resultado final de lines.value:', lines.value);
};

const getStatusText = (status) => {
  switch(status.toUpperCase()) {
    case 'ACTIVE': return t('assetManagement.status.active');
    case 'INACTIVE': return t('assetManagement.status.inactive');
    case 'MAINTENANCE': return t('assetManagement.status.maintenance');
    case 'READY': return 'Ready'; // o una traducción si tienes
    default: return status || 'Desconocido';
  }
};

const selectProductionLine = async (id) => {
  loading.value = true;
  try {
    const line = await ProductionLineApiService.getProductionLineById(id);
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
    { subtitle: t('assetManagement.productionLines.details.capacity'), info: `${line.capacityUnitsPerHour} ${line.unit}/hora` }
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
  if (!selectedPlantId.value) {
    error.value = 'Por favor, seleccione una planta primero';
    return;
  }
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
        ...lineData,
        plantId: selectedPlantId.value
      };
      const result = await ProductionLineApiService.updateProductionLine(updatedLine);
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
        plantId: selectedPlantId.value
      };
      const created = await ProductionLineApiService.createProductionLine(newLine);
      productionLines.value.push(created);
      await loadProductionLines();
    }

    prepareTableData();
    showLineModal.value = false;
  } catch (err) {
    console.error('Error al guardar la línea:', err);
    error.value = isEditMode.value
        ? 'Error al actualizar la línea'
        : 'Error al crear la línea';
  } finally {
    loading.value = false;
  }
};
const toggleLineStatus = async () => {
  if (!selectedLine.value) return;

  const newStatus = selectedLine.value.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  loading.value = true;

  try {
    const updatedLine = await ProductionLineApiService.changeProductionLineStatus(
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

const onPlantChange = () => {
  loadProductionLines();
};

// Ciclo de vida
onMounted(async () => {
  try {

    if (AuthService.isAuthenticated()) {
      const token = AuthService.getToken();
      AuthService.setAuthToken(token);
      await loadData();
    } else {
      console.warn("🔐 Usuario no autenticado. Redirigiendo a login...");
      window.location.href = '/authentication/sign-in';
    }
  } catch (error) {
    console.error("❌ Error al cargar datos con usuario autenticado:", error.message);
  }
});
</script>

<style scoped>
* {
  font-family: var(--font-family-base);
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  height: 100%;
}

.header-main {
  width: 100%;
}

.header-main h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-color);
}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--surface-border);
  margin: 10px 0;
}

.plant-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

.plant-selector label {
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
}

.plant-select {
  padding: 8px 12px;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  background: var(--surface-ground);
  color: var(--text-color);
  font-size: 14px;
  min-width: 200px;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.plant-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-alpha-20);
}

.plant-select:hover {
  border-color: var(--primary-color);
}

.main-content {
  display: flex;
  gap: 20px;
  height: calc(100% - 80px);
}

.left-container {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-container {
  flex: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 0;
}

.right-container.show-panel {
  flex: 1;
  width: auto;
}

.info-panel {
  height: 100%;
  transition: all 0.3s ease;
  min-width: 350px;
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em;
  color: var(--primary-color);
  font-weight: 500;
}

.error-message {
  color: var(--red-500);
  padding: 1.5rem;
  border: 1px solid var(--red-200);
  border-radius: 8px;
  background-color: var(--red-50);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message button {
  align-self: flex-end;
  background-color: var(--primary-color);
  color: var(--primary-color-text);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.error-message button:hover {
  background-color: var(--primary-600);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.panel-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-color);
}

.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.actions-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.actions-row:first-child {
  justify-content: center;
}

.actions-row:last-child {
  justify-content: space-between;
}

:deep(.button-component) {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Estados de líneas */
.active { color: var(--green-500); }
.inactive { color: var(--red-500); }
.maintenance { color: var(--orange-500); }

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .right-container.show-panel {
    width: 100%;
  }

  .info-panel {
    min-width: unset;
  }
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .plant-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .plant-select {
    width: 100%;
  }
}
</style>
