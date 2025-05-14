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
        <label for="brand">Marca <span class="required">*</span></label>
        <input 
          type="text" 
          id="brand" 
          v-model="formData.brand" 
          class="form-input" 
          :class="{ invalid: errors.brand && touched.brand }"
        >
      </div>
      <div class="form-row">
        <label for="serial_number">N° de Serie <span class="required">*</span></label>
        <input 
          type="text" 
          id="serial_number" 
          v-model="formData.serial_number" 
          class="form-input" 
          :class="{ invalid: errors.serial_number && touched.serial_number }"
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
        <label for="production_capacity">Capacidad de producción <span class="optional">(opcional)</span></label>
        <input 
          type="number" 
          id="production_capacity" 
          v-model="formData.production_capacity" 
          class="form-input"
        >
      </div>
      <div class="form-row">
        <label for="recommendations">Recomendaciones <span class="optional">(opcional)</span></label>
        <input 
          type="text" 
          id="recommendations" 
          v-model="formData.recommendations" 
          class="form-input"
        >
      </div>

      <div 
        class="measurements-section" 
        :class="{ invalid: errors.measurements && touched.measurements }"
      >
        <div class="measurements-header">
          <div class="header-cell name-header">Nombre</div>
          <div class="header-cell unit-header">Unidad</div>
          <div v-if="!isEditMode" class="header-cell action-header"></div>
        </div>

        <div class="measurements-list">
          <div 
            v-for="(measurement, index) in formData.measurements" 
            :key="index" 
            class="measurement-row"
          >
            <div class="measurement-cell name-cell">
              <input 
                type="text" 
                v-model="measurement.name" 
                class="form-input" 
                placeholder="Nombre de la medida"
                :readonly="isEditMode"
                :class="{ invalid: errors.measurements?.[index]?.name && touched.measurements?.[index]?.name }"
              >
            </div>
            <div class="measurement-cell unit-cell">
              <input 
                type="text" 
                v-model="measurement.unit" 
                class="form-input"
                placeholder="Unidad"
                :readonly="isEditMode"
                :class="{ invalid: errors.measurements?.[index]?.unit && touched.measurements?.[index]?.unit }"
              >
            </div>
            <div v-if="!isEditMode" class="measurement-cell action-cell">
              <button 
                type="button" 
                class="remove-btn" 
                @click="removeMeasurement(index)" 
                v-if="formData.measurements.length > 1"
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
          v-if="errors.measurements?.atLeastOne && touched.measurements"
        >
          Debe agregar al menos una medida válida.
        </div>
        <button 
          type="button" 
          class="add-measurement-btn" 
          @click="addMeasurement"
          v-if="!isEditMode"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Agregar Medida
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
import { ref, computed, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

interface Props {
  machinery?: any
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  machinery: null,
  title: 'Nueva Maquinaria'
})

const emit = defineEmits(['save', 'cancel'])

const isEditMode = computed(() => !!props.machinery)

// Creamos un objeto reactivo para los datos del formulario
const formData = ref({
  name: '',
  brand: '',
  serial_number: '',
  model: '',
  production_capacity: null,
  recommendations: '',
  measurements: [{ name: '', unit: '', value: 0, lastUpdated: new Date() }]
})

const schema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  brand: yup.string().required('La marca es requerida'),
  serial_number: yup.string().required('El número de serie es requerido'),
  model: yup.string().required('El modelo es requerido'),
  production_capacity: yup.number().nullable(),
  recommendations: yup.string().nullable(),
  measurements: yup.array().of(
    yup.object({
      name: yup.string().required('El nombre de la medida es requerido'),
      unit: yup.string().required('La unidad es requerida'),
      value: yup.number().default(0),
      lastUpdated: yup.date().default(() => new Date())
    })
  ).min(1, 'Debe agregar al menos una medida válida')
})

const { handleSubmit, errors, touched } = useForm({
  validationSchema: schema,
  initialValues: formData.value
})

onMounted(() => {
  if (isEditMode.value && props.machinery) {
    formData.value = {
      name: props.machinery.name || '',
      brand: props.machinery.brand || '',
      serial_number: props.machinery.serialNumber || '',
      model: props.machinery.model || '',
      production_capacity: props.machinery.productionCapacity || null,
      recommendations: props.machinery.recommendations || '',
      measurements: props.machinery.measurements?.length > 0 
        ? props.machinery.measurements 
        : [{ name: '', unit: '', value: 0, lastUpdated: new Date() }]
    }
  }
})

const addMeasurement = () => {
  if (!isEditMode.value) {
    formData.value.measurements.push({ 
      name: '', 
      unit: '', 
      value: 0, 
      lastUpdated: new Date() 
    })
  }
}

const removeMeasurement = (index: number) => {
  if (!isEditMode.value && formData.value.measurements.length > 1) {
    formData.value.measurements.splice(index, 1)
  }
}

const onSubmit = handleSubmit((values) => {
  emit('save', formData.value)
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
    flex: 0 0 120px;
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
    flex: 0 0 120px;
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
