<template>
  <div class="modal-overlay" v-if="showModal" @click="onCancel">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditMode ? t('assetManagement.plants.modal.new') : t('assetManagement.plants.modal.edit') }}</h2>
        <button class="close-button" @click="onCancel">&times;</button>
      </div>

      <div class="modal-content">
        <form @submit.prevent="onSubmit" class="form-container">
          <div class="form-group">
            <label for="name">{{ t('assetManagement.plants.columns.name') }} <span class="required"></span></label>
            <input
                id="name"
                v-model="form.name"
                type="text"
                :class="{ 'invalid': isFieldInvalid('name') }"
                placeholder="Enter name"
            />
            <div class="error-message" v-if="isFieldInvalid('name')">
              {{ t(getErrorMessage('name')) }}
            </div>
          </div>

          <div class="form-group">
            <label for="address">{{ t('assetManagement.plants.columns.address') }} <span class="required"></span></label>
            <input
                id="address"
                v-model="form.address"
                type="text"
                :class="{ 'invalid': isFieldInvalid('address') }"
                placeholder="Enter address"
            />
            <div class="error-message" v-if="isFieldInvalid('address')">
              {{ t(getErrorMessage('address')) }}
            </div>
          </div>

          <div class="form-group">
            <label for="city">{{ t('assetManagement.plants.columns.city') }} <span class="required"></span></label>
            <input
                id="city"
                v-model="form.city"
                type="text"
                :class="{ 'invalid': isFieldInvalid('city') }"
                placeholder="Enter city"
            />
            <div class="error-message" v-if="isFieldInvalid('city')">
              {{ t(getErrorMessage('city')) }}
            </div>
          </div>

          <div class="form-group">
            <label for="country">{{ t('assetManagement.plants.columns.country') }} <span class="required"></span></label>
            <input
                id="country"
                v-model="form.country"
                type="text"
                :class="{ 'invalid': isFieldInvalid('country') }"
                placeholder="Enter country"
            />
            <div class="error-message" v-if="isFieldInvalid('country')">
              {{ t(getErrorMessage('country')) }}
            </div>
          </div>

          <div class="form-group">
            <label for="phone">{{ t('assetManagement.plants.columns.phone') }} <span class="required"></span></label>
            <input
                id="phone"
                v-model="form.phone"
                type="tel"
                :class="{ 'invalid': isFieldInvalid('phone') }"
                placeholder="Enter phone"
            />
            <div class="error-message" v-if="isFieldInvalid('phone')">
              {{ t(getErrorMessage('phone')) }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">{{ t('assetManagement.plants.columns.email') }} <span class="required"></span></label>
            <input
                id="email"
                v-model="form.email"
                type="email"
                :class="{ 'invalid': isFieldInvalid('email') }"
                placeholder="Enter email"
            />
            <div class="error-message" v-if="isFieldInvalid('email')">
              {{ t(getErrorMessage('email')) }}
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <Button variant="outline" @clicked="onCancel">
          {{ t('assetManagement.forms.buttons.cancel') }}
        </Button>
        <Button variant="primary" :disabled="!isFormValid" @clicked="onSubmit">
          {{ isEditMode ? t('assetManagement.forms.buttons.create') : t('assetManagement.forms.buttons.save') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Button from '../../../shared/components/button.component.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  showModal: Boolean,
  plantToEdit: Object,
});

const emit = defineEmits(['save', 'cancel']);

const form = ref({
  name: '',
  address: '',
  city: '',
  country: '',
  phone: '',
  email: ''
});

const touched = ref({
  name: false,
  address: false,
  city: false,
  country: false,
  phone: false,
  email: false
});

const isEditMode = computed(() => !!props.plantToEdit);

const isFormValid = computed(() => {
  return form.value.name &&
      form.value.address &&
      form.value.city &&
      form.value.country &&
      form.value.phone &&
      isValidEmail(form.value.email);
});

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isFieldInvalid = (field) => {
  if (!touched.value[field]) return false;
  if (field === 'email') return !isValidEmail(form.value.email);
  return !form.value[field];
};

const getErrorMessage = (field) => {
  if (!form.value[field]) return `assetManagement.forms.plant.fields.${field}.required`;
  if (field === 'email' && !isValidEmail(form.value[field])) return 'assetManagement.forms.plant.fields.contactEmail.invalid';
  return '';
};

const onSubmit = () => {
  Object.keys(form.value).forEach(key => touched.value[key] = true);
  if (!isFormValid.value) return;

  const formData = {
    ...form.value,
    active: true
  };
  if (isEditMode.value) {
    formData.id = props.plantToEdit.id;
    formData.active = props.plantToEdit.active;
  }
  emit('save', formData);
};

const onCancel = () => emit('cancel');

watch(() => props.plantToEdit, (plant) => {
  if (plant) {
    form.value = { ...plant };
  }
}, { immediate: true });

watch(() => props.showModal, (show) => {
  if (!show) {
    form.value = {
      name: '', address: '', city: '', country: '', phone: '', email: ''
    };
    Object.keys(touched.value).forEach(key => touched.value[key] = false);
  }
});
</script>

<style scoped lang="scss">
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
}

.modal-container {
  background: var(--clr-bg);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--clr-border);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--clr-text);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--clr-text);
  padding: 0.5rem;
}

.modal-content {
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--clr-border);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--clr-text);
}

.form-group input,
.form-group select {
  padding: 0.5rem;
  border: 1px solid var(--clr-primary-100);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--clr-text);
  background-color: var(--clr-surface);
}
</style>
