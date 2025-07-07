<script>
import { ref, onMounted, watch } from 'vue';
import Button from '../../../shared/components/button.component.vue';

export default {
  name: 'ProductionLineFormModal',
  components: {
    Button
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    productionLineData: {
      type: Object,
      default: () => ({})
    },
    plantsList: {
      type: Array,
      default: () => []
    }
  },
  emits: ['submit', 'cancel', 'delete'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      code: '',
      capacityUnitsPerHour: '',
      status: '',
      plantId: ''
    });

    const handleSubmit = () => {
      const requiredFields = ['name', 'code', 'capacityUnitsPerHour', 'status', 'plantId'];
      const missing = requiredFields.filter(
          field => !formData.value[field] || formData.value[field].toString().trim() === ''
      );

      if (missing.length > 0) {
        alert('Please fill in all the required fields.');
        return;
      }

      emit('submit', {
        ...formData.value,
        id: props.productionLineData?.id
      });
    };

    const handleCancel = () => {
      emit('cancel');
    };

    const handleDelete = () => {
      if (confirm('Are you sure you want to delete this production line?')) {
        emit('delete', props.productionLineData.id);
      }
    };

    // Precargar datos en modo edición
    watch(
        () => props.productionLineData,
        (newVal) => {
          if (props.isEdit && newVal) {
            formData.value = {
              name: newVal.name || '',
              code: newVal.code || '',
              capacityUnitsPerHour: newVal.capacityUnitsPerHour || '',
              status: newVal.status || '',
              plantId: newVal.plantId || ''
            };
          }
        },
        { immediate: true }
    );

    return {
      formData,
      handleSubmit,
      handleCancel,
      handleDelete
    };
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Edit Production Line' : 'New Production Line' }}</h2>
        <button class="close-button" @click="handleCancel">×</button>
      </div>

      <div class="modal-content">
        <form @submit.prevent="handleSubmit" class="form-container">
          <div class="form-group">
            <label for="name">Name</label>
            <input id="name" v-model="formData.name" type="text" required placeholder="Enter name" />
          </div>

          <div class="form-group">
            <label for="code">Code</label>
            <input id="code" v-model="formData.code" type="text" required placeholder="Enter code" />
          </div>

          <div class="form-group">
            <label for="capacity">Capacity (units/hour)</label>
            <input id="capacity" v-model="formData.capacityUnitsPerHour" type="number" min="0" required />
          </div>

          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="formData.status" required>
              <option disabled value="">Select status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="READY">Ready</option>
            </select>
          </div>

          <div class="form-group">
            <label for="plant">Plant</label>
            <select id="plant" v-model="formData.plantId" required>
              <option disabled value="">Select a plant</option>
              <option v-for="plant in plantsList" :key="plant.id" :value="plant.id">
                {{ plant.name }}
              </option>
            </select>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <Button variant="outline" @clicked="handleCancel">Cancel</Button>
        <Button v-if="isEdit" variant="danger" style="background-color: var(--clr-danger);" @clicked="handleDelete">Delete</Button>
        <Button variant="primary" @clicked="handleSubmit">
          {{ isEdit ? 'Save Changes' : 'Create' }}
        </Button>
      </div>
    </div>
  </div>
</template>

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
