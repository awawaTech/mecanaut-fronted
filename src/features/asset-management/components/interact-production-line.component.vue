<script>
import { ref, onMounted, watch } from 'vue';
import Button from '../../../shared/components/button.component.vue';

export default {
  name: 'ProductionLineFormModal',
  components: {
    Button
  },
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    productionLine: {
      type: Object,
      default: () => null
    },
    title: {
      type: String,
      required: true
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const formData = ref({
      name: '',
      code: '',
      capacityUnitsPerHour: null
    });

    const handleSubmit = () => {
      const requiredFields = ['name', 'code', 'capacityUnitsPerHour'];
      const missing = requiredFields.filter(
          field => !formData.value[field] && formData.value[field] !== 0
      );

      if (missing.length > 0) {
        alert('Por favor, complete todos los campos requeridos.');
        return;
      }

      // Asegurarse de que capacityUnitsPerHour sea un número
      const submitData = {
        ...formData.value,
        capacityUnitsPerHour: Number(formData.value.capacityUnitsPerHour)
      };

      emit('submit', submitData);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    // Cargar datos si estamos en modo edición
    watch(
        () => props.productionLine,
        (newVal) => {
          if (newVal) {
            formData.value = {
              name: newVal.name || '',
              code: newVal.code || '',
              capacityUnitsPerHour: newVal.capacityUnitsPerHour || null
            };
          } else {
            // Resetear el formulario
            formData.value = {
              name: '',
              code: '',
              capacityUnitsPerHour: null
            };
          }
        },
        { immediate: true }
    );

    return {
      formData,
      handleSubmit,
      handleCancel
    };
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-button" @click="handleCancel">×</button>
      </div>

      <div class="modal-content">
        <form @submit.prevent="handleSubmit" class="form-container">
          <div class="form-group">
            <label for="name">Nombre</label>
            <input 
              id="name" 
              v-model="formData.name" 
              type="text" 
              required 
              placeholder="Ingrese el nombre" 
            />
          </div>

          <div class="form-group">
            <label for="code">Código</label>
            <input 
              id="code" 
              v-model="formData.code" 
              type="text" 
              required 
              placeholder="Ingrese el código" 
            />
          </div>

          <div class="form-group">
            <label for="capacity">Capacidad (unidades/hora)</label>
            <input 
              id="capacity" 
              v-model="formData.capacityUnitsPerHour" 
              type="number" 
              min="0" 
              required 
            />
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <Button variant="outline" @clicked="handleCancel">Cancelar</Button>
        <Button variant="primary" @clicked="handleSubmit">
          {{ productionLine ? 'Guardar Cambios' : 'Crear' }}
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
