<template>
  <div class="container">
    <div class="header-main">
      <h1>Métricas de Máquina</h1>
      <div class="divider"></div>
    </div>

    <main class="main-container">
      <!-- Selectores -->
      <div class="selectors-container">
        <div class="selector-group">
          <label for="plant-select">Planta:</label>
          <select 
            id="plant-select" 
            v-model="selectedPlantId" 
            @change="onPlantChange"
            :disabled="loadingPlants"
            class="selector-input"
          >
            <option value="">Seleccionar planta</option>
            <option 
              v-for="plant in plants" 
              :key="plant.id" 
              :value="plant.id"
            >
              {{ plant.name }}
            </option>
          </select>
        </div>

        <div class="selector-group">
          <label for="production-line-select">Línea de Producción:</label>
          <select 
            id="production-line-select" 
            v-model="selectedProductionLineId" 
            @change="onProductionLineChange"
            :disabled="!selectedPlantId || loadingProductionLines"
            class="selector-input"
          >
            <option value="">Seleccionar línea de producción</option>
            <option 
              v-for="line in productionLines" 
              :key="line.id" 
              :value="line.id"
            >
              {{ line.name }}
            </option>
          </select>
        </div>

        <div class="selector-group">
          <label for="machinery-select">Maquinaria:</label>
          <select 
            id="machinery-select" 
            v-model="selectedMachineryId" 
            @change="onMachineryChange"
            :disabled="!selectedProductionLineId || loadingMachineries"
            class="selector-input"
          >
            <option value="">Seleccionar maquinaria</option>
            <option 
              v-for="machinery in machineries" 
              :key="machinery.id" 
              :value="machinery.id"
            >
              {{ machinery.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Indicadores de carga -->
      <div v-if="loadingPlants" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i>
        Cargando plantas...
      </div>

      <div v-if="loadingProductionLines" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i>
        Cargando líneas de producción...
      </div>

      <div v-if="loadingMachineries" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i>
        Cargando maquinarias...
      </div>

      <div v-if="loadingParameters" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i>
        Cargando parámetros...
      </div>

      <!-- Métricas de la maquinaria -->
      <div v-if="selectedMachineryId && parameters.length > 0" class="parameters-container">
        <h2>Métricas de {{ selectedMachinery?.name }}</h2>
        
        <div class="parameters-grid">
          <div 
            v-for="parameter in parameters" 
            :key="parameter.metricId" 
            class="parameter-card"
          >
            <div class="parameter-header">
              <h3>{{ parameter.metricName }}</h3>
              <span class="parameter-unit">{{ parameter.unit }}</span>
            </div>
            
            <div class="parameter-info">
              <div class="info-row">
                <span class="label">Valor actual:</span>
                <span class="value">{{ parameter.value || 'Sin datos' }}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Última medición:</span>
                <span class="value">{{ formatDate(parameter.measuredAt) || 'Sin datos' }}</span>
              </div>
            </div>

            <div class="parameter-input-section">
              <label :for="'parameter-' + parameter.metricId">Actualizar valor:</label>
              <div class="input-group">
                <input 
                  :id="'parameter-' + parameter.metricId"
                  v-model="parameterValues[parameter.metricId]"
                  type="number"
                  step="0.01"
                  class="parameter-input"
                  :placeholder="`Ingrese nuevo valor en ${parameter.unit}`"
                />
                <button 
                  @click="saveParameterValue(parameter.metricId)"
                  :disabled="!parameterValues[parameter.metricId] || savingParameter === parameter.metricId"
                  class="save-button"
                >
                  <i v-if="savingParameter === parameter.metricId" class="pi pi-spin pi-spinner"></i>
                  <span v-else>Actualizar</span>
                </button>
              </div>
              
              <div v-if="parameterErrors[parameter.metricId]" class="error-message">
                {{ parameterErrors[parameter.metricId] }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay métricas -->
      <div v-if="selectedMachineryId && !loadingParameters && parameters.length === 0" class="no-parameters">
        <i class="pi pi-info-circle"></i>
        <p>No se encontraron métricas para esta maquinaria.</p>
      </div>

      <!-- Mensaje inicial -->
      <div v-if="!selectedMachineryId && !loadingPlants" class="initial-message">
        <i class="pi pi-cog"></i>
        <p>Selecciona una planta, línea de producción y maquinaria para ver sus métricas.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { MachineParametersService } from '../services/machine-parameters.service.js';

// Estado reactivo
const plants = ref([]);
const productionLines = ref([]);
const machineries = ref([]);
const parameters = ref([]);
const parameterValues = ref({});
const parameterErrors = ref({});

// IDs seleccionados
const selectedPlantId = ref('');
const selectedProductionLineId = ref('');
const selectedMachineryId = ref('');

// Estados de carga
const loadingPlants = ref(false);
const loadingProductionLines = ref(false);
const loadingMachineries = ref(false);
const loadingParameters = ref(false);
const savingParameter = ref(null);

// Computed
const selectedPlant = computed(() => {
  return plants.value.find(plant => plant.id === selectedPlantId.value);
});

const selectedProductionLine = computed(() => {
  return productionLines.value.find(line => line.id === selectedProductionLineId.value);
});

const selectedMachinery = computed(() => {
  return machineries.value.find(machinery => machinery.id === selectedMachineryId.value);
});

// Métodos
const loadPlants = async () => {
  loadingPlants.value = true;
  try {
    plants.value = await MachineParametersService.getPlants();
  } catch (error) {
    console.error('Error loading plants:', error);
  } finally {
    loadingPlants.value = false;
  }
};

const loadProductionLines = async (plantId) => {
  if (!plantId) {
    productionLines.value = [];
    return;
  }

  loadingProductionLines.value = true;
  try {
    productionLines.value = await MachineParametersService.getProductionLinesByPlant(plantId);
  } catch (error) {
    console.error('Error loading production lines:', error);
  } finally {
    loadingProductionLines.value = false;
  }
};

const loadMachineries = async (productionLineId) => {
  if (!productionLineId) {
    machineries.value = [];
    return;
  }

  loadingMachineries.value = true;
  try {
    machineries.value = await MachineParametersService.getMachineriesByProductionLine(productionLineId);
  } catch (error) {
    console.error('Error loading machineries:', error);
  } finally {
    loadingMachineries.value = false;
  }
};

const loadParameters = async (machineryId) => {
  if (!machineryId) {
    parameters.value = [];
    return;
  }

  loadingParameters.value = true;
  try {
    parameters.value = await MachineParametersService.getMachineParameters(machineryId);
    // Inicializar valores de métricas
    parameters.value.forEach(metric => {
      parameterValues.value[metric.metricId] = metric.value || '';
    });
  } catch (error) {
    console.error('Error cargando métricas:', error);
  } finally {
    loadingParameters.value = false;
  }
};

const saveParameterValue = async (metricId) => {
  const value = parameterValues.value[metricId];
  const metric = parameters.value.find(m => m.metricId === metricId);
  
  // Validación
  if (!value || value === '') {
    parameterErrors.value[metricId] = 'El valor es requerido';
    return;
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    parameterErrors.value[metricId] = 'El valor debe ser un número válido';
    return;
  }

  savingParameter.value = metricId;
  parameterErrors.value[metricId] = '';

  try {
    await MachineParametersService.saveParameterValue(selectedMachineryId.value, metricId, numValue);
    
    // Actualizar la métrica con el nuevo valor y fecha actual
    const updatedMetric = parameters.value.find(m => m.metricId === metricId);
    if (updatedMetric) {
      updatedMetric.value = numValue;
      updatedMetric.measuredAt = new Date().toISOString();
    }

    // Limpiar el valor del input después de guardar exitosamente
    parameterValues.value[metricId] = '';

    // Mostrar mensaje de éxito (podrías usar un toast aquí)
    console.log('Métrica actualizada exitosamente');
  } catch (error) {
    parameterErrors.value[metricId] = 'Error al actualizar la métrica';
    console.error('Error actualizando métrica:', error);
  } finally {
    savingParameter.value = null;
  }
};

// Event handlers
const onPlantChange = () => {
  selectedProductionLineId.value = '';
  selectedMachineryId.value = '';
  parameters.value = [];
  parameterValues.value = {};
  parameterErrors.value = {};
  
  if (selectedPlantId.value) {
    loadProductionLines(selectedPlantId.value);
  } else {
    productionLines.value = [];
    machineries.value = [];
  }
};

const onProductionLineChange = () => {
  selectedMachineryId.value = '';
  parameters.value = [];
  parameterValues.value = {};
  parameterErrors.value = {};
  
  if (selectedProductionLineId.value) {
    loadMachineries(selectedProductionLineId.value);
  } else {
    machineries.value = [];
  }
};

const onMachineryChange = () => {
  parameters.value = [];
  parameterValues.value = {};
  parameterErrors.value = {};
  
  if (selectedMachineryId.value) {
    loadParameters(selectedMachineryId.value);
  }
};

// Utilidades
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('es-ES');
};

// Inicialización
onMounted(() => {
  loadPlants();
});
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-main {
  width: 100%;
  margin-bottom: 20px;
}

.header-main h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--clr-text);
}

.divider {
  width: 100%;
  height: 1px;
  background-color: var(--clr-primary-100);
  margin: 10px 0;
}

.main-container {
  background: var(--clr-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selectors-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--clr-border);
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
    color: var(--clr-text);
    font-size: 0.9rem;
  }

  .selector-input {
    padding: 12px;
    border: 1px solid var(--clr-border);
    border-radius: 8px;
    background: var(--clr-bg);
    color: var(--clr-text);
    font-size: 0.95rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--clr-primary-200);
    }

    &:disabled {
      background: var(--clr-bg-secondary);
      color: var(--clr-text-secondary);
      cursor: not-allowed;
    }
  }
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: var(--clr-text-secondary);
  font-size: 1.1rem;

  i {
    font-size: 1.2rem;
  }
}

.parameters-container {
  h2 {
    margin-bottom: 24px;
    color: var(--clr-text);
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.parameters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.parameter-card {
  background: var(--clr-bg-secondary);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 20px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.parameter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--clr-border);

  h3 {
    margin: 0;
    color: var(--clr-text);
    font-size: 1.2rem;
    font-weight: 600;
  }

  .parameter-unit {
    background: var(--clr-primary-100);
    color: var(--clr-bg);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 500;
  }
}

.parameter-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .label {
    font-weight: 500;
    color: var(--clr-text-secondary);
    font-size: 0.9rem;
  }

  .value {
    color: var(--clr-text);
    font-size: 0.9rem;
  }
}

.parameter-input-section {
  label {
    display: block;
    font-weight: 500;
    color: var(--clr-text);
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .input-group {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }

  .parameter-input {
    flex: 1;
    padding: 12px;
    border: 1px solid var(--clr-border);
    border-radius: 8px;
    background: var(--clr-bg);
    color: var(--clr-text);
    font-size: 0.95rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--clr-primary-200);
    }

    &::placeholder {
      color: var(--clr-text-secondary);
    }
  }

  .save-button {
    padding: 12px 20px;
    background: var(--clr-primary-200);
    color: var(--clr-bg);
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 100px;
    justify-content: center;

    &:hover:not(:disabled) {
      background: var(--clr-primary-100);
    }

    &:disabled {
      background: var(--clr-bg-secondary);
      color: var(--clr-text-secondary);
      cursor: not-allowed;
    }

    i {
      font-size: 0.9rem;
    }
  }

  .error-message {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 4px;
  }
}

.no-parameters,
.initial-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: var(--clr-text-secondary);

  i {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  p {
    font-size: 1.1rem;
    margin: 0;
  }
}

// Responsive
@media (max-width: 768px) {
  .selectors-container {
    grid-template-columns: 1fr;
  }

  .parameters-grid {
    grid-template-columns: 1fr;
  }

  .input-group {
    flex-direction: column;
  }

  .save-button {
    width: 100%;
  }
}
</style>
