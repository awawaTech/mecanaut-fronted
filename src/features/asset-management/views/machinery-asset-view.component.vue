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
                <td>{{ machine.brand }}</td>
                <td>{{ machine.status }}</td>
                <td>{{ machine.lastMaintenance }}</td>
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
          @save="saveMachinery"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import InteractMachinery from '../components/interact-machinery.component.vue'

// Estado
const selectedMachineId = ref<number | null>(null)
const selectedMachine = ref<any>(null)
const showDetailPanel = ref(false)
const showMachineryModal = ref(false)
const isEditMode = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// Datos hardcodeados
const machineries = ref([
  {
    id: 1,
    name: 'Máquina 1',
    model: 'Modelo A',
    brand: 'Marca X',
    status: 1,
    serialNumber: 'SN001',
    productionCapacity: 100,
    recommendations: 'Mantenimiento mensual',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-15'),
    measurements: [
      { id: 1, name: 'Temperatura', unit: '°C', value: 25, lastUpdated: new Date() },
      { id: 2, name: 'Presión', unit: 'bar', value: 2.5, lastUpdated: new Date() }
    ]
  },
  // Agrega más máquinas según necesites
])

// Columnas para la tabla
const columns = [
  { key: 'id', label: 'ID', type: 'texto' },
  { key: 'name', label: 'Nombre', type: 'texto' },
  { key: 'model', label: 'Modelo', type: 'texto' },
  { key: 'brand', label: 'Marca', type: 'texto' },
  { key: 'status', label: 'Estado', type: 'texto' },
  { key: 'lastMaintenance', label: 'Último mantenimiento', type: 'texto' },
  { key: 'details', label: 'Detalles', type: 'cta', ctaLabel: 'Ver' }
]

// Datos adaptados para la tabla
const machines = computed(() => {
  return machineries.value.map(machinery => ({
    id: machinery.id,
    name: machinery.name,
    model: machinery.model,
    brand: machinery.brand,
    status: getStatusText(machinery.status),
    lastMaintenance: formatDate(machinery.updatedAt),
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
const getStatusText = (status: number): string => {
  switch(status) {
    case 1: return 'Activo'
    case 2: return 'Inactivo'
    case 3: return 'En mantenimiento'
    case 4: return 'En reparación'
    default: return 'Desconocido'
  }
}

const formatDate = (date: Date): string => {
  return date ? new Date(date).toLocaleDateString('es-ES') : ''
}

// Métodos
const loadMachineries = () => {
  loading.value = true
  error.value = null
  // Simulamos una carga
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const selectMachinery = (id: number) => {
  loading.value = true
  const machinery = machineries.value.find(m => m.id === id)
  if (machinery) {
    selectedMachine.value = machinery
    selectedMachineId.value = machinery.id
    updateInfoPanel(machinery)
    showDetailPanel.value = true
  }
  loading.value = false
}

const updateInfoPanel = (machinery: any) => {
  infoData.value = [
    { subtitle: 'Nombre', info: machinery.name },
    { subtitle: 'Modelo', info: machinery.model },
    { subtitle: 'Estado actual', info: getStatusText(machinery.status) },
    { subtitle: 'Marca', info: machinery.brand },
    { subtitle: 'Número de serie', info: machinery.serialNumber },
    { subtitle: 'Fecha actualización', info: formatDate(machinery.updatedAt) }
  ]
  
  techData.value = [
    { subtitle: 'Capacidad de producción', info: `${machinery.productionCapacity} unidades/hora` },
    { subtitle: 'Recomendaciones', info: machinery.recommendations }
  ]
  
  maintenanceItems.value = [
    { date: formatDate(new Date(machinery.createdAt)), type: 'Preventivo', responsible: 'Técnico Asignado' },
    { date: formatDate(machinery.updatedAt), type: 'Correctivo', responsible: 'Supervisor' }
  ]
  
  measurementData.value = machinery.measurements.map((m: any) => ({
    subtitle: m.name,
    info: `${m.value} ${m.unit}`
  }))
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

const saveMachinery = (machineryData: any) => {
  // Simulamos guardar
  console.log('Guardando maquinaria:', machineryData)
  closeModal()
}

const toggleMachineryStatus = () => {
  if (!selectedMachine.value) return
  
  const newStatus = selectedMachine.value.status === 1 ? 2 : 1
  selectedMachine.value.status = newStatus
  updateInfoPanel(selectedMachine.value)
}
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: var(--clr-bg);
  transition: background 0.3s;
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
  
  &.full-width {
    width: 100% !important;
  }
}

.search-bar {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--clr-shadow);
  border-radius: var(--radius-md);
  font-size: 1rem;
}

.new-button {
  padding: 0.5rem 1rem;
  background-color: var(--clr-primary-300);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--clr-primary-400);
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

.record-table {
  width: 100%;
  border-collapse: collapse;
  
  th {
    background-color: var(--clr-primary-400);
    color: white;
    padding: 1em;
    text-align: left;
  }
  
  tr:hover {
    background-color: var(--clr-primary-100);
    cursor: pointer;
  }
  
  td {
    padding: 1em;
    border-bottom: 1px solid var(--clr-shadow);
  }
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
  transition: all 0.3s ease;
  background-color: var(--clr-bg);
  border: 1px solid var(--clr-shadow);
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
  color: var(--clr-text);
  font-size: 1.5em;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
}

.info-panel {
  padding: 1.5rem;
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--clr-primary-400);
  margin-bottom: 1rem;
}

.panel-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--clr-primary-300);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--clr-primary-400);
  }
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--clr-primary-300);
  color: var(--clr-primary-300);
  
  &:hover {
    background-color: var(--clr-primary-100);
  }
}

.info-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--clr-bg-secondary);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.subtitle {
  font-weight: 600;
  color: var(--clr-primary-500);
}

.info {
  color: var(--clr-text-secondary);
}

.info-container {
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.1rem;
    color: var(--clr-primary-400);
    margin-bottom: 1rem;
  }
}

.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.maintenance-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: var(--clr-bg-secondary);
  border-radius: var(--radius-md);
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

.loading-indicator {
  text-align: center;
  padding: 2rem;
  color: var(--clr-text-secondary);
}

.error-message {
  text-align: center;
  padding: 2rem;
  color: var(--clr-danger);
  
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--clr-primary-300);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    
    &:hover {
      background-color: var(--clr-primary-400);
    }
  }
}

.breadcrumb-card {
  background: var(--clr-bg);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px 0 rgba(44, 62, 80, 0.07);
  padding: 0.75em 1.5em;
  margin-bottom: 2em;
  display: flex;
  align-items: center;
  min-height: 44px;
}

.breadcrumb-text {
  color: var(--clr-primary-100);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
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
  
  .breadcrumb-header {
    margin-bottom: 1em;
  }
  
  .main-container {
    gap: 1em;
  }
  
  .table-container,
  .information-panel-container {
    border-radius: 12px;
    box-shadow: 0 1px 4px 0 var(--clr-shadow);
  }
  
  .information-panel-container {
    margin-top: 0.5em;
  }
  
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }
}

// Tema oscuro
[data-theme='dark'] {
  .modal-overlay {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  .modal-container {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
  
  .search-input {
    border-color: #444;
    background-color: var(--clr-bg);
    color: var(--clr-text);
  }
  
  .table-container {
    border-color: #444;
  }
  
  .record-table td {
    border-bottom-color: #333;
  }
  
  .info-section {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .maintenance-item {
    background-color: rgba(255, 255, 255, 0.05);
  }
}


</style>
