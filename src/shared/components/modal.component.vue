<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import ButtonComponent from './button.component.vue';

export default {
  name: 'ModalComponent',
  components: {
    ButtonComponent
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '500px'
    },
    hideCloseButton: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const modalRef = ref(null);

    // Cerrar modal al hacer clic fuera
    const handleOutsideClick = (event) => {
      if (modalRef.value && !modalRef.value.contains(event.target)) {
        emit('close');
      }
    };

    // Cerrar modal con tecla ESC
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        emit('close');
      }
    };

    watch(() => props.show, (newVal) => {
      if (newVal) {
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        setTimeout(() => {
          document.addEventListener('mousedown', handleOutsideClick);
          document.addEventListener('keydown', handleKeyDown);
        }, 100);
      } else {
        document.body.style.overflow = 'auto';
        document.removeEventListener('mousedown', handleOutsideClick);
        document.removeEventListener('keydown', handleKeyDown);
      }
    });

    onMounted(() => {
      if (props.show) {
        document.body.style.overflow = 'hidden';
        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);
      }
    });

    onUnmounted(() => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    });

    const closeModal = () => {
      emit('close');
    };

    const confirmModal = () => {
      emit('confirm');
    };

    return {
      modalRef,
      closeModal,
      confirmModal
    };
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop">
      <div 
        ref="modalRef" 
        class="modal-container" 
        :style="{ maxWidth: width }"
      >
        <div class="modal-header">
          <h3 class="modal-title">{{ title }}</h3>
          <button v-if="!hideCloseButton" class="close-button" @click="closeModal">
            <i class="pi pi-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <div class="modal-footer">
          <slot name="footer">
            <div class="button-group">
              <button-component 
                variant="secondary" 
                @clicked="closeModal"
              >
                Cancelar
              </button-component>
              <button-component 
                variant="primary" 
                @clicked="confirmModal"
              >
                Aceptar
              </button-component>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease;
}

.modal-container {
  background-color: var(--surface-card);
  border-radius: 16px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--surface-border);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--surface-hover);
  }
  
  i {
    font-size: 1.2rem;
  }
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 130px); /* Ajustar según necesidad */
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--surface-border);
  display: flex;
  justify-content: flex-end;
}

.button-group {
  display: flex;
  gap: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style> 