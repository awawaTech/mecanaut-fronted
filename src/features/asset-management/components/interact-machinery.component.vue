<template>
  <div class="machinery-form-container">
    <h2 class="form-title">{{ title }}</h2>

    <form @submit.prevent="onSubmit" class="machinery-form">
      <div class="form-row">
        <label for="name">Nombre <span class="required">*</span></label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          class="form-input" 
          :class="{ invalid: errors.name && touched.name }"
        >
      </div>
      <div class="form-row">
        <label for="manufacturer">Fabricante <span class="required">*</span></label>
        <input 
          type="text" 
          id="manufacturer" 
          v-model="formData.manufacturer" 
          class="form-input" 
          :class="{ invalid: errors.manufacturer && touched.manufacturer }"
        >
      </div>
      <div class="form-row">
        <label for="serialNumber">N° de Serie <span class="required">*</span></label>
        <input 
          type="text" 
          id="serialNumber" 
          v-model="formData.serialNumber" 
          class="form-input" 
          :class="{ invalid: errors.serialNumber && touched.serialNumber }"
        >
      </div>
      <div class="form-row">
        <label for="model">Modelo <span class="required">*</span></label>
        <input 
          type="text" 
          id="model" 
          v-model="formData.model" 
          class="form-input" 
          :class="{ invalid: errors.model && touched.model }"
        >
      </div>


      <div class="form-row">
        <label for="type">Tipo de máquina <span class="required">*</span></label>
        <input 
          type="text" 
          id="type" 
          v-model="formData.type" 
          class="form-input" 
          :class="{ invalid: errors.type && touched.type }"
        >
      </div>
      <div class="form-row">
        <label for="powerConsumption">
          Consumo de energía (kW) <span class="required">*</span>
        </label>
        <input 
          type="number" 
          id="powerConsumption" 
          v-model="formData.powerConsumption" 
          class="form-input"
          :class="{ invalid: errors.powerConsumption && touched.powerConsumption }"
          min="0"
          step="0.1"
        >
      </div>

      <div 
        class="measurements-section" 
        :class="{ invalid: errors.metrics && touched.metrics }"
      >
        <div class="measurements-header">
          <div class="header-cell name-header">Métrica</div>
          <div class="header-cell unit-header">Unidad</div>
          <div class="header-cell value-header">Valor</div>
          <div v-if="!isEditMode" class="header-cell action-header"></div>
        </div>

        <div class="measurements-list">
          <div 
            v-for="(metric, index) in formData.metrics" 
            :key="index" 
            class="measurement-row"
          >
            <div class="measurement-cell name-cell">
              <select 
                v-model.number="metric.metricId" 
                class="form-input" 
                :disabled="isEditMode"
                :class="{ invalid: errors.metrics?.[index]?.metricId && touched.metrics?.[index]?.metricId }"
              >
                <option value="">Seleccionar métrica</option>
                <option v-for="availableMetric in availableMetrics" :key="availableMetric.id" :value="availableMetric.id">
                  {{ availableMetric.name }}
                </option>
              </select>
            </div>
            <div class="measurement-cell unit-cell">
              <div class="unit-display">
                {{ getMetricUnit(metric.metricId) || 'Seleccione métrica' }}
              </div>
            </div>
            <div class="measurement-cell value-cell">
              <input 
                type="number" 
                v-model="metric.value" 
                class="form-input"
                placeholder="Valor"
                min="0"
                step="0.01"
                :class="{ invalid: errors.metrics?.[index]?.value && touched.metrics?.[index]?.value }"
              >
            </div>
            <div v-if="!isEditMode" class="measurement-cell action-cell">
              <button 
                type="button" 
                class="remove-btn" 
                @click="removeMetric(index)" 
                v-if="formData.metrics.length > 1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div 
          class="measurements-error"
          v-if="errors.metrics?.atLeastOne && touched.metrics"
        >
          Debe agregar al menos una métrica válida.
        </div>
        <button 
          type="button" 
          class="add-measurement-btn" 
          @click="addMetric"
          v-if="!isEditMode"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Agregar Métrica
        </button>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="onCancel">Cancelar</button>
        <button type="submit" class="btn-save">Guardar</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { MachineryApiService } from '../services/machinery-api.service'

interface Props {
  machinery?: any
  title?: string
  productionLineId?: number
}

const props = withDefaults(defineProps<Props>(), {
  machinery: null,
  title: 'Nueva Maquinaria',
  productionLineId: null
})

const emit = defineEmits(['save', 'cancel'])

const isEditMode = computed(() => !!props.machinery)

// Métricas predefinidas disponibles
const availableMetrics = ref(MachineryApiService.getAvailableMetrics())

// Creamos un objeto reactivo para los datos del formulario
const formData = ref({
  name: '',
  manufacturer: '',
  serialNumber: '',
  model: '',
  type: '',
  powerConsumption: null,
  plantId: null,
  metrics: [{ metricId: '', value: '', measuredAt: new Date().toISOString() }]
})

const schema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  manufacturer: yup.string().required('El fabricante es requerido'),
  serialNumber: yup.string().required('El número de serie es requerido'),
  model: yup.string().required('El modelo es requerido'),
  type: yup.string().required('El tipo es requerido'),
  powerConsumption: yup.number()
    .required('El consumo de energía es requerido')
    .min(0, 'El consumo debe ser mayor o igual a 0'),
  plantId: yup.number().nullable(),
  metrics: yup.array().of(
    yup.object({
      metricId: yup.number().required('Debe seleccionar una métrica'),
      value: yup.number().required('El valor es requerido').min(0, 'El valor debe ser mayor o igual a 0'),
      measuredAt: yup.string().required('La fecha de medición es requerida')
    })
  ).min(1, 'Debe agregar al menos una métrica válida')
})

const { handleSubmit, errors, touched } = useForm({
  validationSchema: schema,
  initialValues: formData.value
})

onMounted(() => {
  if (isEditMode.value && props.machinery) {
    formData.value = {
      name: props.machinery.name || '',
      manufacturer: props.machinery.manufacturer || '',
      serialNumber: props.machinery.serialNumber || '',
      model: props.machinery.model || '',
      type: props.machinery.type || '',
      powerConsumption: props.machinery.powerConsumption || null,
      plantId: props.machinery.plantId || null,
      metrics: props.machinery.metrics?.length > 0 
        ? props.machinery.metrics 
        : [{ metricId: '', value: '', measuredAt: new Date().toISOString() }]
    }
  }
})

const addMetric = () => {
  if (!isEditMode.value) {
    formData.value.metrics.push({ 
      metricId: '', 
      value: '', 
      measuredAt: new Date().toISOString() 
    })
  }
}

const removeMetric = (index: number) => {
  if (!isEditMode.value && formData.value.metrics.length > 1) {
    formData.value.metrics.splice(index, 1)
  }
}

const getMetricUnit = (metricId) => {
  if (!metricId || metricId === '') return ''
  const metric = availableMetrics.value.find(m => m.id === metricId)
  return metric ? metric.unit : ''
}

// Watcher para actualizar automáticamente las fechas de medición
watch(() => formData.value.metrics, (newMetrics) => {
  newMetrics.forEach((metric, index) => {
    if (metric.metricId && !metric.measuredAt) {
      formData.value.metrics[index].measuredAt = new Date().toISOString()
    }
  })
}, { deep: true })

const onSubmit = handleSubmit(async (values) => {
  console.log('1. Iniciando onSubmit con valores:', values)
  
  try {
    console.log('2. Entrando al try-catch')
    
    // Filtrar métricas válidas
    const validMetrics = formData.value.metrics
      .filter(m => m.metricId && m.value !== null && m.value !== '')
      .map(m => ({
        metricId: parseInt(m.metricId),
        value: parseFloat(m.value),
        measuredAt: m.measuredAt || new Date().toISOString()
      }))
    
    console.log('3. Métricas válidas procesadas:', validMetrics)

    const machineData = {
      serialNumber: formData.value.serialNumber,
      name: formData.value.name,
      manufacturer: formData.value.manufacturer,
      plantId: 1,
      model: formData.value.model,
      type: formData.value.type,
      powerConsumption: parseFloat(formData.value.powerConsumption),
      metrics: validMetrics
    }
    
    console.log('4. Datos de máquina preparados:', machineData)
    console.log('5. Intentando crear máquina con MachineryApiService')
    
    const createdMachine = await MachineryApiService.createMachine(machineData)
    console.log('6. Respuesta de creación de máquina:', createdMachine)
    
    if (!createdMachine || !createdMachine.id) {
      console.log('7A. Error: No hay ID en la respuesta', createdMachine)
      throw new Error('No se recibió ID de la máquina creada')
    }
    
    console.log('7B. ID de máquina recibido:', createdMachine.id)
    
    if (props.productionLineId) {
      console.log('8. Intentando asignar a línea de producción:', {
        machineId: createdMachine.id,
        lineId: props.productionLineId
      })
      
      await MachineryApiService.assignMachineToProductionLine(
        createdMachine.id, 
        props.productionLineId
      )
      console.log('9. Asignación completada')
    } else {
      console.log('8A. No hay productionLineId, saltando asignación')
    }

    console.log('10. Emitiendo evento save')
    emit('save', createdMachine)
    console.log('11. Evento save emitido')
    
  } catch (error) {
    console.log('ERROR. Entrando al catch con error:', error)
    console.error('ERROR detallado:', {
      mensaje: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
})

const onCancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
*{
    font-family: "Montserrat" !important; 
}
.machinery-form-container {
  width: 100%;
  background-color: var(--clr-bg);
  border-radius: var(--radius-md);
  padding: 1.5em;
  box-shadow: 0 2px 10px var(--clr-shadow);
}


.form-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--clr-primary-400);
  font-size: 1.5rem;
  font-weight: 600;
}

.machinery-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: var(--clr-text);
    font-weight: 500;
    font-size: 0.9rem;
  }
}

.form-input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  width: 100%;
  background-color: var(--clr-bg);
  color: var(--clr-text);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--clr-primary-300);
    box-shadow: 0 0 0 2px rgba(var(--clr-primary-300), 0.1);
  }

  &.with-unit {
    padding-right: 3rem;
  }
  
  &[readonly] {
    background-color: var(--clr-surface);
    cursor: default;
    opacity: 0.9;
  }
}

.measurements-section {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
  background-color: var(--clr-bg);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 2px 8px var(--clr-shadow);
  }
}

.measurements-header {
  display: flex;
  background-color: var(--clr-primary-400);
  color: white;
  padding: 0.6rem 1rem;
  font-weight: 500;
}

.header-cell {
  flex: 1;
  
  &.unit-header {
    flex: 0 0 80px;
    text-align: center;
  }
  
  &.value-header {
    flex: 0 0 100px;
    text-align: center;
  }
  
  &.action-header {
    flex: 0 0 50px;
  }
}

.measurements-list {
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--clr-primary-200);
    border-radius: 3px;
  }
}

.measurement-row {
  display: flex;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--clr-surface);
  }
}

.measurement-cell {
  padding: 0.5rem;
  flex: 1;
  
  .form-input {
    border: 1px solid transparent;
    border-radius: 4px;
    padding: 0.5rem;
    background-color: transparent;
    
    &:focus {
      background-color: var(--clr-bg);
      border-color: var(--clr-primary-300);
    }
  }
  
  &.unit-cell {
    flex: 0 0 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &.value-cell {
    flex: 0 0 100px;
  }
  
  &.action-cell {
    flex: 0 0 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.remove-btn {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ff5252;
  opacity: 0.5;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 82, 82, 0.1);
    opacity: 1;
  }
  
  svg {
    stroke: currentColor;
  }
}

.unit-display {
  padding: 0.5rem;
  background-color: var(--clr-surface, #f5f5f5);
  border-radius: 4px;
  font-size: 0.85rem;
  color: var(--clr-text, #333);
  text-align: center;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
}

.add-measurement-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--clr-primary-300);
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
  
  &:hover {
    background-color: var(--clr-surface);
    color: var(--clr-primary-400);
  }
  
  svg {
    stroke: currentColor;
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel, .btn-save {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  
  &:active {
    transform: translateY(1px);
  }
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid #ddd;
  color: var(--clr-text);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.btn-save {
  background-color: var(--clr-primary-300);
  border: none;
  color: white;
  
  &:hover {
    background-color: var(--clr-primary-400);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

.required {
  color: var(--clr-danger, #e53935);
  font-weight: bold;
  margin-left: 2px;
  font-size: 1em;
}

.optional {
  color: var(--clr-primary-300);
  font-size: 0.95em;
  margin-left: 4px;
}

.form-input.invalid {
  border-color: var(--clr-danger, #e53935);
  background-color: #fff6f6;
}

.measurements-section.invalid {
  border-color: var(--clr-danger, #e53935);
}

.measurements-error {
  color: var(--clr-danger, #e53935);
  font-size: 0.95em;
  margin: 0.5em 0 0 1em;
}

// Soporte para tema oscuro
[data-theme='dark'] {
  .form-input {
    border-color: #444;
    
    &:focus {
      border-color: var(--clr-primary-200);
    }
    
    &[readonly] {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
  
  .measurements-section {
    border-color: #444;
  }
  
  .measurement-row {
    border-bottom-color: #333;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
  
  .btn-cancel {
    border-color: #444;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
  
  .remove-btn:hover {
    background-color: rgba(255, 82, 82, 0.2);
  }
}

// Media queries para responsive
@media (max-width: 576px) {
  .machinery-form-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
