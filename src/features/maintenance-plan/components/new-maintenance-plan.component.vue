<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ModalComponent from '../../../shared/components/modal.component.vue';
import ButtonComponent from '../../../shared/components/button.component.vue';

const { t } = useI18n();

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// Estado del formulario
const activeTab = ref('general');
const formData = ref({
  name: '',
  startDate: '',
  duration: 1,
  repeatEvery: 0,
  repeatUnit: 'weeks'
});

// Métodos
const closeModal = () => {
  emit('close');
};

const saveForm = () => {
  // Aquí se validaría el formulario
  emit('save', formData.value);
};

const setTab = (tab) => {
  activeTab.value = tab;
};

// Opciones para las unidades de repetición
const repeatUnits = [
  { value: 'days', label: t('maintenance.repeatUnits.days') },
  { value: 'weeks', label: t('maintenance.repeatUnits.weeks') },
  { value: 'months', label: t('maintenance.repeatUnits.months') }
];
</script>

<template>
  <modal-component 
    :show="show" 
    :title="t('maintenance.newPlan')"
    width="600px"
    @close="closeModal"
  >
    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="['tab-button', { active: activeTab === 'general' }]" 
        @click="setTab('general')"
      >
        {{ t('maintenance.generalInfo') }}
      </button>
      <button 
        :class="['tab-button', { active: activeTab === 'detailed' }]" 
        @click="setTab('detailed')"
      >
        {{ t('maintenance.detailedInfo') }}
      </button>
    </div>
    
    <!-- Tab content -->
    <div class="tab-content">
      <!-- Información General -->
      <div v-if="activeTab === 'general'" class="form-container">
        <div class="form-group">
          <label for="name">{{ t('maintenance.name') }}</label>
          <input 
            id="name" 
            type="text" 
            v-model="formData.name" 
            class="form-control"
          />
        </div>
        
        <div class="form-group">
          <label for="startDate">{{ t('maintenance.startDate') }}</label>
          <div class="input-with-icon">
            <input 
              id="startDate" 
              type="date" 
              v-model="formData.startDate" 
              class="form-control"
            />
            <i class="pi pi-calendar"></i>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="duration">{{ t('maintenance.duration') }}</label>
            <div class="input-with-addon">
              <input 
                id="duration" 
                type="number" 
                v-model="formData.duration" 
                min="1" 
                class="form-control"
              />
              <span class="input-addon">{{ t('maintenance.days') }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="repeatEvery">{{ t('maintenance.repeatEvery') }}</label>
            <div class="input-with-addon">
              <input 
                id="repeatEvery" 
                type="number" 
                v-model="formData.repeatEvery" 
                min="0" 
                class="form-control"
              />
              <select 
                v-model="formData.repeatUnit" 
                class="input-addon-select"
              >
                <option 
                  v-for="unit in repeatUnits" 
                  :key="unit.value" 
                  :value="unit.value"
                >
                  {{ unit.label }}
                </option>
              </select>
            </div>
            <small class="help-text">
              {{ t('maintenance.repeatHelpText') }}
            </small>
          </div>
        </div>
      </div>
      
      <!-- Información Detallada (aún no implementado) -->
      <div v-else class="detailed-info-placeholder">
        <p>{{ t('maintenance.detailedInfoComingSoon') }}</p>
      </div>
    </div>
    
    <template #footer>
      <div class="button-group">
        <button-component 
          variant="secondary" 
          @clicked="closeModal"
        >
          {{ t('common.cancel') }}
        </button-component>
        <button-component 
          variant="primary" 
          @clicked="saveForm"
        >
          <span v-if="activeTab === 'general'">{{ t('common.continue') }}</span>
          <span v-else>{{ t('common.save') }}</span>
        </button-component>
      </div>
    </template>
  </modal-component>
</template>

<style scoped lang="scss">
.tabs {
  display: flex;
  border-bottom: 1px solid var(--surface-border);
  margin-bottom: 1.5rem;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-color-secondary);
  transition: all 0.2s;
  
  &.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }
  
  &:hover:not(.active) {
    color: var(--text-color);
    background-color: var(--surface-hover);
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  
  .form-group {
    flex: 1;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: 600;
    color: var(--text-color);
    font-size: 0.95rem;
  }
  
  .form-control {
    padding: 0.75rem 1rem;
    border: 1px solid var(--surface-border);
    border-radius: 8px;
    font-size: 1rem;
    background-color: var(--surface-card);
    color: var(--text-color);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
    }
  }
  
  .help-text {
    color: var(--text-color-secondary);
    font-size: 0.85rem;
    margin-top: 0.3rem;
  }
}

.input-with-icon {
  position: relative;
  
  .form-control {
    padding-right: 2.5rem;
  }
  
  i {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
  }
}

.input-with-addon {
  display: flex;
  align-items: center;
  
  .form-control {
    flex: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  .input-addon {
    background-color: var(--surface-ground);
    padding: 0.75rem 1rem;
    border: 1px solid var(--surface-border);
    border-left: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    color: var(--text-color-secondary);
    white-space: nowrap;
  }
  
  .input-addon-select {
    background-color: var(--surface-ground);
    padding: 0.75rem 1rem;
    border: 1px solid var(--surface-border);
    border-left: none;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    color: var(--text-color);
    
    &:focus {
      outline: none;
    }
  }
}

.detailed-info-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: var(--surface-ground);
  border-radius: 8px;
  
  p {
    color: var(--text-color-secondary);
    font-style: italic;
  }
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style> 