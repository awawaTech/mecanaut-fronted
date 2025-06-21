<template>
  <div class="modal-overlay" v-if="showModal" @click="onCancel">
    <div class="modal-container" @click.stop>
      <div class="plant-form-container">
        <h2 class="form-title">{{ title }}</h2>

        <form @submit.prevent="onSubmit" class="plant-form">
          <div class="form-row">
            <label for="name">{{ $t('assetManagement.forms.plant.fields.name.label') }} <span class="required">*</span></label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="form-input"
              :class="{ 'invalid': isFieldInvalid('name') }"
            >
            <div class="error-message" v-if="isFieldInvalid('name')">
              {{ $t(getErrorMessage('name')) }}
            </div>
          </div>

          <div class="form-row">
            <label for="address">{{ $t('assetManagement.forms.plant.fields.address.label') }} <span class="required">*</span></label>
            <input
              type="text"
              id="address"
              v-model="form.address"
              class="form-input"
              :class="{ 'invalid': isFieldInvalid('address') }"
            >
            <div class="error-message" v-if="isFieldInvalid('address')">
              {{ $t(getErrorMessage('address')) }}
            </div>
          </div>

          <div class="form-row">
            <label for="city">{{ $t('assetManagement.forms.plant.fields.city.label') }} <span class="required">*</span></label>
            <input
              type="text"
              id="city"
              v-model="form.city"
              class="form-input"
              :class="{ 'invalid': isFieldInvalid('city') }"
            >
            <div class="error-message" v-if="isFieldInvalid('city')">
              {{ $t(getErrorMessage('city')) }}
            </div>
          </div>

          <div class="form-row">
            <label for="country">{{ $t('assetManagement.forms.plant.fields.country.label') }} <span class="required">*</span></label>
            <input
              type="text"
              id="country"
              v-model="form.country"
              class="form-input"
              :class="{ 'invalid': isFieldInvalid('country') }"
            >
            <div class="error-message" v-if="isFieldInvalid('country')">
              {{ $t(getErrorMessage('country')) }}
            </div>
          </div>

          <div class="form-row">
            <label for="contactPhone">{{ $t('assetManagement.forms.plant.fields.contactPhone.label') }} <span class="required">*</span></label>
            <input
              type="tel"
              id="contactPhone"
              v-model="form.contactPhone"
              class="form-input"
              :class="{ 'invalid': isFieldInvalid('contactPhone') }"
            >
            <div class="error-message" v-if="isFieldInvalid('contactPhone')">
              {{ $t(getErrorMessage('contactPhone')) }}
            </div>
          </div>

          <div class="form-row">
            <label for="contactEmail">{{ $t('assetManagement.forms.plant.fields.contactEmail.label') }} <span class="required">*</span></label>
            <input
              type="email"
              id="contactEmail"
              v-model="form.contactEmail"
              class="form-input"
              :class="{ 'invalid': isFieldInvalid('contactEmail') }"
            >
            <div class="error-message" v-if="isFieldInvalid('contactEmail')">
              {{ $t(getErrorMessage('contactEmail')) }}
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="onCancel">{{ $t('assetManagement.forms.buttons.cancel') }}</button>
            <button type="submit" class="btn-save" :disabled="!isFormValid">{{ $t('assetManagement.forms.buttons.save') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  plantToEdit: {
    type: Object,
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  availableProductionLines: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['save', 'cancel']);

const form = ref({
  name: '',
  address: '',
  city: '',
  country: '',
  contactPhone: '',
  contactEmail: ''
});

const touched = ref({
  name: false,
  address: false,
  city: false,
  country: false,
  contactPhone: false,
  contactEmail: false
});

const isEditMode = computed(() => !!props.plantToEdit);

const isFormValid = computed(() => {
  return form.value.name &&
         form.value.address &&
         form.value.city &&
         form.value.country &&
         form.value.contactPhone &&
         isValidEmail(form.value.contactEmail);
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isFieldInvalid = (field) => {
  if (!touched.value[field]) return false;
  
  if (field === 'contactEmail') {
    return !form.value[field] || !isValidEmail(form.value[field]);
  }
  return !form.value[field];
};

const getErrorMessage = (field) => {
  if (!form.value[field]) {
    return `assetManagement.forms.plant.fields.${field}.required`;
  }
  if (field === 'contactEmail' && !isValidEmail(form.value[field])) {
    return 'assetManagement.forms.plant.fields.contactEmail.invalid';
  }
  return '';
};

const onSubmit = () => {
  Object.keys(form.value).forEach(key => {
    touched.value[key] = true;
  });

  if (isFormValid.value) {
    const formData = {
      ...form.value
    };

    if (isEditMode.value && props.plantToEdit) {
      formData.id = props.plantToEdit.id;
    }

    emit('save', formData);
  }
};

const onCancel = () => {
  emit('cancel');
};

watch(() => props.plantToEdit, (newPlant) => {
  if (newPlant) {
    form.value = {
      name: newPlant.name || '',
      address: newPlant.address || '',
      city: newPlant.city || '',
      country: newPlant.country || '',
      contactPhone: newPlant.contactPhone || '',
      contactEmail: newPlant.contactEmail || ''
    };
  }
}, { immediate: true });

watch(() => props.showModal, (show) => {
  if (!show) {
    // Reset form when modal closes
    form.value = {
      name: '',
      address: '',
      city: '',
      country: '',
      contactPhone: '',
      contactEmail: ''
    };
    Object.keys(touched.value).forEach(key => {
      touched.value[key] = false;
    });
  }
});
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-container {
  width: 90%;
  max-width: 600px;
  background-color: var(--color-background);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  animation: slideDown 0.3s ease-in-out;
}

.plant-form-container {
  width: 100%;
  background-color: var(--clr-bg);
  border-radius: var(--radius-md);
  padding: 1.5em;
  box-shadow: 0 2px 10px var(--clr-shadow);
}

* {
  font-family: var(--font-family-primary);
}

.form-title {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--clr-primary-400);
  font-size: 1.5rem;
  font-weight: 600;
}

.plant-form {
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

.required {
  color: var(--clr-danger, #e53935);
  font-weight: bold;
  margin-left: 2px;
  font-size: 1em;
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

  &.invalid {
    border-color: var(--clr-danger, #e53935);
    background-color: #fff6f6;
  }
}

.error-message {
  color: var(--clr-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-cancel {
  background-color: transparent;
  border: 1px solid #ddd;
  color: var(--clr-text);
  
  &:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.btn-save {
  background-color: var(--clr-primary-300);
  border: none;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: var(--clr-primary-400);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Soporte para tema oscuro
[data-theme='dark'] {
  .form-input {
    border-color: #444;
    
    &:focus {
      border-color: var(--clr-primary-200);
    }
    
    &.invalid {
      background-color: rgba(229, 57, 53, 0.1);
    }
  }
  
  .btn-cancel {
    border-color: #444;
    
    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
}

// Media queries para responsive
@media (max-width: 576px) {
  .plant-form-container {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
