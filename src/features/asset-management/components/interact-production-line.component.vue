<template>
  <div class="form-container">
    <div class="form-header">
      <h2>{{ title }}</h2>
    </div>

    <form @submit.prevent="onSubmit" class="form-content">
      <div class="form-section">
        <div class="form-group">
          <label class="form-label">
            {{ $t('assetManagement.forms.productionLine.fields.name.label') }}
            <span class="required">*</span>
          </label>
          <input
            type="text"
            class="form-input"
            v-model="form.name"
            :placeholder="$t('assetManagement.forms.productionLine.fields.name.placeholder')"
            @blur="validateField('name')"
          >
          <span class="form-error" v-if="errors.name">
            {{ $t('assetManagement.forms.productionLine.fields.name.required') }}
          </span>
        </div>

        <div class="form-group">
          <label class="form-label">
            {{ $t('assetManagement.forms.productionLine.fields.code.label') }}
            <span class="required">*</span>
          </label>
          <input
            type="text"
            class="form-input"
            v-model="form.code"
            :placeholder="$t('assetManagement.forms.productionLine.fields.code.placeholder')"
            @blur="validateField('code')"
          >
          <span class="form-error" v-if="errors.code">
            {{ $t('assetManagement.forms.productionLine.fields.code.required') }}
          </span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              {{ $t('assetManagement.forms.productionLine.fields.maxUnitsPerHour.label') }}
              <span class="required">*</span>
            </label>
            <input
              type="number"
              class="form-input"
              v-model="form.maxUnitsPerHour"
              :placeholder="$t('assetManagement.forms.productionLine.fields.maxUnitsPerHour.placeholder')"
              @blur="validateField('maxUnitsPerHour')"
            >
            <span class="form-error" v-if="errors.maxUnitsPerHour">
              {{ $t('assetManagement.forms.productionLine.fields.maxUnitsPerHour.required') }}
            </span>
          </div>

          <div class="form-group">
            <label class="form-label">
              {{ $t('assetManagement.forms.productionLine.fields.unit.label') }}
              <span class="required">*</span>
            </label>
            <input
              type="text"
              class="form-input"
              v-model="form.unit"
              :placeholder="$t('assetManagement.forms.productionLine.fields.unit.placeholder')"
              @blur="validateField('unit')"
            >
            <span class="form-error" v-if="errors.unit">
              {{ $t('assetManagement.forms.productionLine.fields.unit.required') }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">
            {{ $t('assetManagement.forms.productionLine.fields.plant.label') }}
            <span class="required">*</span>
          </label>
          <select
            class="form-select"
            v-model="form.plantId"
            @change="onPlantChange"
          >
            <option v-for="plant in plants" :key="plant.id" :value="plant.id">
              {{ plant.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" @click="onCancel">
          {{ $t('assetManagement.forms.buttons.cancel') }}
        </button>
        <button type="submit" class="btn-primary" :disabled="!isFormValid">
          {{ $t('assetManagement.forms.buttons.save') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  plants: {
    type: Array,
    default: () => []
  },
  productionLine: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save', 'cancel']);
const { t } = useI18n();

const form = ref({
  name: '',
  code: '',
  maxUnitsPerHour: '',
  unit: '',
  plantId: ''
});

const errors = ref({
  name: false,
  code: false,
  maxUnitsPerHour: false,
  unit: false,
  plantId: false
});

const isEditMode = computed(() => !!props.productionLine);

const isFormValid = computed(() => {
  return form.value.name &&
         form.value.code &&
         form.value.maxUnitsPerHour &&
         form.value.unit &&
         form.value.plantId &&
         !Object.values(errors.value).some(error => error);
});

const validateField = (field) => {
  errors.value[field] = !form.value[field];
};

const validateForm = () => {
  Object.keys(form.value).forEach(field => {
    validateField(field);
  });
  return !Object.values(errors.value).some(error => error);
};

const onPlantChange = () => {
  console.log('Plant ID selected:', form.value.plantId);
};

const onSubmit = () => {
  if (validateForm()) {
    emit('save', { ...form.value });
  }
};

const onCancel = () => {
  emit('cancel');
};

watch(() => props.productionLine, (newValue) => {
  if (newValue) {
    form.value = {
      name: newValue.name || '',
      code: newValue.code || '',
      maxUnitsPerHour: newValue.maxUnitsPerHour || '',
      unit: newValue.unit || '',
      plantId: newValue.plantId || ''
    };
  }
}, { immediate: true });

onMounted(() => {
  if (props.plants.length > 0 && !props.productionLine) {
    form.value.plantId = props.plants[0].id;
  }
});
</script>

<style scoped lang="scss">
.form-container {
  background: var(--surface-card);
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow: hidden;
}

.form-header {
  background: var(--surface-section);
  padding: 1.5rem;
  border-bottom: 1px solid var(--surface-border);

  h2 {
    color: var(--text-color);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
}

.form-content {
  padding: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.875rem;

  .required {
    color: var(--red-500);
    margin-left: 0.25rem;
  }
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  background: var(--surface-ground);
  color: var(--text-color);
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
  }

  &::placeholder {
    color: var(--text-color-secondary);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.form-error {
  color: var(--red-500);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: var(--primary-color);
  color: var(--primary-color-text);
  border: none;

  &:hover:not(:disabled) {
    background: var(--primary-600);
  }

  &:active:not(:disabled) {
    background: var(--primary-700);
  }
}

.btn-secondary {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--surface-border);

  &:hover:not(:disabled) {
    background: var(--surface-hover);
  }

  &:active:not(:disabled) {
    background: var(--surface-ground);
  }
}

@media (max-width: 576px) {
  .form-content {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;

    button {
      width: 100%;
    }
  }
}
</style>
