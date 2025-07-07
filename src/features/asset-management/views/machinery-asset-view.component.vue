<template>
  <div class="container">
    <header class="breadcrumb-header">
      <div class="breadcrumb-card">
        <span class="breadcrumb-text">Gestión de Activos &gt; Maquinarias</span>
      </div>
    </header>

    <main class="main-container">
      <div class="search-container" :class="{ 'full-width': !showDetailPanel || showMachineryModal }">
        <div class="search-actions">
          <!-- Filtros -->
          <div class="filters-container">
            <div class="filter-group">
              <label for="plant-select" class="filter-label">Planta:</label>
              <select 
                id="plant-select"
                v-model="selectedPlant" 
                @change="onPlantChange"
                class="filter-select"
                :disabled="loadingPlants"
              >
                <option value="">{{ loadingPlants ? 'Cargando...' : 'Todas las plantas' }}</option>
                <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                  {{ plant.name }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="production-line-select" class="filter-label">Línea de Producción:</label>
              <select 
                id="production-line-select"
                v-model="selectedProductionLine" 
                @change="onProductionLineChange"
                class="filter-select"
                :disabled="loadingProductionLines || !selectedPlant"
              >
                <option value="">{{ 
                  !selectedPlant ? 'Selecciona una planta' : 
                  loadingProductionLines ? 'Cargando...' : 'Todas las líneas' 
                }}</option>
                <option v-for="line in productionLines" :key="line.id" :value="line.id">
                  {{ line.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="search-bar">
            <input type="text" placeholder="Buscar" class="search-input">
            <button class="new-button" @click="newMachineAction">+ Nueva Máquina</button>
          </div>
        </div>
        
        <div v-if="loading && !showDetailPanel" class="loading-indicator">
          Cargando datos...
        </div>
        
        <div v-if="error && !showDetailPanel" class="error-message">
          {{ error }}
          <button @click="loadMachineries">Reintentar</button>
        </div>
        
        <div v-if="!loading && !error" class="table-container">
          <table class="record-table">
            <thead>
              <tr>
                <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="machine in machines" :key="machine.id" @click="selectMachinery(machine.id)">
                <td>{{ machine.id }}</td>
                <td>{{ machine.name }}</td>
                <td>{{ machine.model }}</td>
                <td>{{ machine.manufacturer }}</td>
                <td>{{ machine.status }}</td>
                <td>{{ machine.nextMaintenance }}</td>
                <td>
                  <button class="btn-primary" @click.stop="selectMachinery(machine.id)">Ver</button>
                </td>
              </tr>
            </tbody>
          </table>
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
          Cargando información de la maquinaria...
        </div>
        
        <div v-if="!loading && selectedMachine" class="info-panel">
          <div class="panel-title">
            ID: {{ selectedMachineId }} | {{ selectedMachine.name }}
          </div>
          
          <div class="panel-actions">
            <button class="btn-primary" @click="editMachine">Editar</button>
            <button class="btn-secondary" @click="toggleMachineryStatus">
              {{ selectedMachine.status === 1 ? 'Desactivar' : 'Activar' }}
            </button>
          </div>
          
          <!-- Información básica -->
          <div class="info-section">
            <div v-for="(item, index) in infoData" :key="index" class="info-item">
              <span class="subtitle">{{ item.subtitle }}:</span>
              <span class="info">{{ item.info }}</span>
            </div>
          </div>
          
          <!-- Especificaciones técnicas -->
          <div class="info-container">
            <h3>Especificaciones técnicas:</h3>
            <div class="info-section">
              <div v-for="(item, index) in techData" :key="index" class="info-item">
                <span class="subtitle">{{ item.subtitle }}:</span>
                <span class="info">{{ item.info }}</span>
              </div>
            </div>
          </div>
          
          <!-- Historial de mantenimiento -->
          <div class="info-container">
            <h3>Historial de mantenimiento</h3>
            <div class="maintenance-list">
              <div v-for="(item, index) in maintenanceItems" :key="index" class="maintenance-item">
                <div class="maintenance-date">{{ item.date }}</div>
                <div class="maintenance-type">{{ item.type }}</div>
                <div class="maintenance-responsible">{{ item.responsible }}</div>
              </div>
            </div>
          </div>
          
          <!-- Mediciones actuales -->
          <div class="info-container">
            <h3>Mediciones actuales:</h3>
            <div class="info-section">
              <div v-for="(item, index) in measurementData" :key="index" class="info-item">
                <span class="subtitle">{{ item.subtitle }}:</span>
                <span class="info">{{ item.info }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal para crear/editar maquinaria -->
    <div v-if="showMachineryModal" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <interact-machinery
          :machinery="isEditMode ? selectedMachine : null"
          :title="isEditMode ? 'Editar Maquinaria' : 'Nueva Maquinaria'"
          :production-line-id="selectedProductionLine"
          @save="saveMachinery"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import InteractMachinery from '../components/interact-machinery.component.vue'
import { PlantApiService } from '../services/plant-api.service.js'
import { ProductionLineApiService } from '../services/production-line-api.service.js'
import { MachineryApiService } from '../services/machinery-api.service.js'

// Estado
const selectedMachineId = ref<number | null>(null)
const selectedMachine = ref<any>(null)
const showDetailPanel = ref(false)
const showMachineryModal = ref(false)
const isEditMode = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// Filtros
const selectedPlant = ref<number | null>(null)
const selectedProductionLine = ref<number | null>(null)
const plants = ref<any[]>([])
const productionLines = ref<any[]>([])
const loadingPlants = ref(false)
const loadingProductionLines = ref(false)

// Datos de máquinas desde API
const machineries = ref([])

// Columnas para la tabla
const columns = [
  { key: 'id', label: 'ID', type: 'texto' },
  { key: 'name', label: 'Nombre', type: 'texto' },
  { key: 'model', label: 'Modelo', type: 'texto' },
  { key: 'manufacturer', label: 'Fabricante', type: 'texto' },
  { key: 'status', label: 'Estado', type: 'texto' },
  { key: 'nextMaintenance', label: 'Próximo mantenimiento', type: 'texto' },
  { key: 'details', label: 'Detalles', type: 'cta', ctaLabel: 'Ver' }
]

// Datos adaptados para la tabla
const machines = computed(() => {
  return machineries.value.map(machinery => ({
    id: machinery.id,
    name: machinery.name,
    model: machinery.model,
    manufacturer: machinery.manufacturer,
    status: getStatusText(machinery.status),
    nextMaintenance: formatDate(machinery.nextMaintenanceDate),
    details: machinery.id,
    original: machinery
  }))
})

// Datos para el panel de información
const infoData = ref<{subtitle: string, info: string}[]>([])
const techData = ref<{subtitle: string, info: string}[]>([])
const maintenanceItems = ref<{date: string, type: string, responsible: string}[]>([])
const measurementData = ref<{subtitle: string, info: string}[]>([])

// Funciones auxiliares
const getStatusText = (status: string): string => {
  switch(status) {
    case 'Operational': return 'Operacional'
    case 'Maintenance': return 'En mantenimiento'
    case 'Repair': return 'En reparación'
    case 'Inactive': return 'Inactiva'
    default: return status || 'Desconocido'
  }
}

const formatDate = (date: Date): string => {
  return date ? new Date(date).toLocaleDateString('es-ES') : ''
}

// Métodos
const loadPlants = async () => {
  loadingPlants.value = true
  try {
    const response = await PlantApiService.getPlants()
    plants.value = response || []
  } catch (err) {
    console.error('Error cargando plantas:', err)
    plants.value = []
  } finally {
    loadingPlants.value = false
  }
}

const loadProductionLines = async (plantId: number) => {
  if (!plantId) {
    productionLines.value = []
    return
  }
  
  loadingProductionLines.value = true
  try {
    const response = await ProductionLineApiService.getProductionLines(plantId)
    productionLines.value = response || []
  } catch (err) {
    console.error('Error cargando líneas de producción:', err)
    productionLines.value = []
  } finally {
    loadingProductionLines.value = false
  }
}

const onPlantChange = () => {
  selectedProductionLine.value = null
  productionLines.value = []
  
  if (selectedPlant.value) {
    loadProductionLines(selectedPlant.value)
  }
  
  // Aquí podrías filtrar las maquinarias por planta
  loadMachineries()
}

const onProductionLineChange = () => {
  loadMachineries()
}

const loadMachineries = async () => {
  loading.value = true
  error.value = null
  
  try {
    const productionLineId = selectedProductionLine.value
    const machinesData = await MachineryApiService.getMachines(productionLineId)
    machineries.value = machinesData || []
  } catch (err) {
    console.error('Error cargando máquinas:', err)
    error.value = err?.message || 'Error al cargar las máquinas'
    machineries.value = []
  } finally {
    loading.value = false
  }
}

const selectMachinery = async (id: number) => {
  loading.value = true
  try {
    const machinery = await MachineryApiService.getMachineById(id)
    if (machinery) {
      selectedMachine.value = machinery
      selectedMachineId.value = machinery.id
      updateInfoPanel(machinery)
      showDetailPanel.value = true
    }
  } catch (err) {
    console.error('Error cargando máquina:', err)
    error.value = err?.message || 'Error al cargar la máquina'
  } finally {
    loading.value = false
  }
}

const updateInfoPanel = (machinery: any) => {
  infoData.value = [
    { subtitle: 'Nombre', info: machinery.name || 'No especificado' },
    { subtitle: 'Modelo', info: machinery.model || 'No especificado' },
    { subtitle: 'Estado actual', info: getStatusText(machinery.status) },
    { subtitle: 'Fabricante', info: machinery.manufacturer || 'No especificado' },
    { subtitle: 'Número de serie', info: machinery.serialNumber || 'No especificado' },
    { subtitle: 'Tipo', info: machinery.type || 'No especificado' },
    { subtitle: 'Consumo de energía', info: machinery.powerConsumption ? `${machinery.powerConsumption} kW` : 'No especificado' }
  ]
  
  techData.value = [
    { subtitle: 'Línea de producción', info: machinery.productionLineId ? `ID: ${machinery.productionLineId}` : 'No asignada' },
    { subtitle: 'Último mantenimiento', info: formatDate(machinery.lastMaintenanceDate) || 'No registrado' },
    { subtitle: 'Próximo mantenimiento', info: formatDate(machinery.nextMaintenanceDate) || 'No programado' }
  ]
  
  maintenanceItems.value = [
    { date: formatDate(machinery.lastMaintenanceDate) || 'No registrado', type: 'Último mantenimiento', responsible: 'Sistema' },
    { date: formatDate(machinery.nextMaintenanceDate) || 'No programado', type: 'Próximo mantenimiento', responsible: 'Sistema' }
  ]
  
  measurementData.value = [
    { subtitle: 'Estado', info: getStatusText(machinery.status) },
    { subtitle: 'ID de máquina', info: machinery.id.toString() }
  ]
}

const closeDetailPanel = () => {
  showDetailPanel.value = false
  selectedMachine.value = null
  selectedMachineId.value = null
}

const newMachineAction = () => {
  isEditMode.value = false
  showMachineryModal.value = true
}

const editMachine = () => {
  isEditMode.value = true
  showMachineryModal.value = true
}

const closeModal = () => {
  showMachineryModal.value = false
}

const saveMachinery = async (machineryData: any) => {
  try {
    loading.value = true
    
    const createdMachine = await MachineryApiService.createMachine(machineryData)
    
    if (selectedProductionLine.value && createdMachine.id) {
      await MachineryApiService.assignMachineToProductionLine(createdMachine.id, selectedProductionLine.value)
    }
    
    await loadMachineries()
    closeModal()
  } catch (err) {
    console.error('Error guardando máquina:', err)
    error.value = err?.message || 'Error al guardar la máquina'
  } finally {
    loading.value = false
  }
}

const toggleMachineryStatus = async () => {
  if (!selectedMachine.value) return
  
  try {
    loading.value = true
    
    const newStatus = selectedMachine.value.status === 'Operational' ? 'Inactive' : 'Operational'
    selectedMachine.value.status = newStatus
    
    updateInfoPanel(selectedMachine.value)
  } catch (err) {
    console.error('Error cambiando estado:', err)
    error.value = err?.message || 'Error al cambiar el estado'
  } finally {
    loading.value = false
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  loadPlants()
  loadMachineries()
})
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

.filters-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--clr-surface, #fff);
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--clr-shadow, rgba(0,0,0,0.1));
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 180px;
}

.filter-group label {
  font-weight: 600;
  color: var(--clr-text, #333);
  font-size: 0.85rem;
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--clr-border, #ddd);
  border-radius: var(--radius-sm, 4px);
  background-color: var(--clr-surface, #fff);
  color: var(--clr-text, #333);
  font-size: 0.85rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--clr-primary, #007bff);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.filter-select:disabled {
  background-color: var(--clr-disabled, #f5f5f5);
  color: var(--clr-text-muted, #999);
  cursor: not-allowed;
}

.search-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--clr-border, #ddd);
  border-radius: var(--radius-sm, 4px);
  background-color: var(--clr-surface, #fff);
  color: var(--clr-text, #333);
  font-size: 0.85rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--clr-primary, #007bff);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.new-button {
  padding: 0.5rem 1rem;
  background-color: var(--clr-primary, #007bff);
  color: white;
  border: none;
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.85rem;
}

.new-button:hover {
  background-color: var(--clr-primary-dark, #0056b3);
}

.breadcrumb-header {
  margin-bottom: 2em;
}

.breadcrumb-card {
  background: var(--clr-surface, #fff);
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 4px 16px 0 rgba(44, 62, 80, 0.07);
  padding: 0.75em 1.5em;
  margin-bottom: 2em;
  display: flex;
  align-items: center;
  min-height: 44px;
}

.breadcrumb-text {
  color: var(--clr-text, #333);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
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

.record-table {
  width: 100%;
  border-collapse: collapse;
}

.record-table th {
  background-color: var(--clr-primary, #007bff);
  color: white;
  padding: 1em;
  text-align: left;
  font-weight: 600;
}

.record-table tr:hover {
  background-color: var(--clr-primary-light, rgba(0, 123, 255, 0.1));
  cursor: pointer;
}

.record-table td {
  padding: 1em;
  border-bottom: 1px solid var(--clr-border, #ddd);
}

.btn-primary {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--clr-primary-400, #2E80E4) 0%, var(--clr-primary-500, #18549E) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(46, 128, 228, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--clr-primary-500, #18549E) 0%, var(--clr-primary-400, #2E80E4) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 128, 228, 0.4);
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
  background:var(--clr-surface, #fff);
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  border: 1px solid var(--clr-primary-200, #5B62B3);
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

.info-panel {
  padding: 1.5rem;
  position: relative;
}

.info-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--clr-primary-100, #6DA0E1) 0%, var(--clr-primary-300, #ECA6BB) 50%, var(--clr-primary-200, #5B62B3) 100%);
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--clr-primary-400, #2E80E4);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--clr-primary-300, #ECA6BB);
}

.panel-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--clr-primary-300, #ECA6BB);
  color: var(--clr-primary-300, #ECA6BB);
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.btn-secondary:hover {
  background-color: var(--clr-primary-300, #ECA6BB);
  color: white;
}

.info-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--clr-surface, #fff);
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid var(--clr-primary-200, #5B62B3);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.info-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.subtitle {
  font-weight: 600;
  color: var(--clr-primary-500, #18549E);
  font-size: 0.9rem;
}

.info {
  color: var(--clr-text, #383A37);
  font-weight: 500;
}

.info-container {
  margin-bottom: 1.5rem;
}

.info-container h3 {
  font-size: 1.1rem;
  color: var(--clr-primary-200, #5B62B3);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--clr-primary-300, #ECA6BB);
  position: relative;
}

.info-container h3::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 30px;
  height: 2px;
  background-color: var(--clr-primary-100, #6DA0E1);
}

.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.maintenance-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--clr-primary-300, #ECA6BB) 0%, var(--clr-primary-100, #6DA0E1) 100%);
  border-radius: var(--radius-md, 8px);
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.maintenance-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Estilos para elementos de medición con colores variados */
.measurement-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: var(--radius-md, 8px);
  background: var(--clr-surface, #fff);
  color: white;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.measurement-item:nth-child(even) {
  background:var(--clr-surface, #fff);
}

.measurement-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilos para estados de máquina */
.status-active {
  color: var(--color-success, #28a745);
  font-weight: 600;
}

.status-inactive {
  color: var(--color-error, #dc3545);
  font-weight: 600;
}

.status-maintenance {
  color: var(--color-warning, #ffc107);
  font-weight: 600;
}

/* Efectos de hover para elementos de información */
.info-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm, 4px);
  padding: 0.5rem;
  margin: 0 -0.5rem;
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
  width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: var(--clr-surface, #fff);
  border-radius: var(--radius-md, 8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform-origin: center center;
}

.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background-color: var(--clr-primary-light, rgba(0, 123, 255, 0.3));
  border-radius: 4px;
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

.error-message button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--clr-primary, #007bff);
  color: white;
  border: none;
  border-radius: var(--radius-sm, 4px);
  cursor: pointer;
  font-size: 0.85rem;
}

.error-message button:hover {
  background-color: var(--clr-primary-dark, #0056b3);
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
  
  .filters-container {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
  }
  
  .filter-group {
    min-width: unset;
    width: 100%;
    justify-content: space-between;
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
  
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }
}
</style>
