<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonComponent from '@/shared/components/button.component.vue';
import { WorkOrderService } from '../services/work-order.service';

export default {
  name: 'AssignTechniciansModal',
  components: {
    ButtonComponent
  },
  props: {
    orderData: {
      type: Object,
      required: true
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const selectedTechnicianIds = ref([]);
    const loading = ref(false);
    const loadingTechnicians = ref(false);

    const availableTechnicians = ref([]);

    const loadTechnicians = async () => {
      try {
        loadingTechnicians.value = true;
        const technicians = await WorkOrderService.getTechnicians();
        console.log('Modal - Técnicos cargados:', technicians);
        availableTechnicians.value = technicians;
      } catch (error) {
        console.error('Error cargando técnicos:', error);
        availableTechnicians.value = [];
      } finally {
        loadingTechnicians.value = false;
      }
    };

    onMounted(async () => {
      console.log('Modal - Order data recibida:', props.orderData);
      console.log('Modal - Technician IDs existentes:', props.orderData.technicianIds);
      
      await loadTechnicians();
      
      // Inicializar con los técnicos ya asignados
      if (props.orderData.technicianIds) {
        selectedTechnicianIds.value = [...props.orderData.technicianIds];
        console.log('Modal - Técnicos inicializados:', selectedTechnicianIds.value);
      }
    });

    const toggleTechnician = (technicianId, event) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        if (!selectedTechnicianIds.value.includes(technicianId)) {
          selectedTechnicianIds.value.push(technicianId);
        }
      } else {
        selectedTechnicianIds.value = selectedTechnicianIds.value.filter(id => id !== technicianId);
      }
    };

    const handleSubmit = async () => {
      try {
        loading.value = true;
        const payload = {
          orderId: props.orderData.id,
          technicianIds: selectedTechnicianIds.value
        };
        console.log('Modal - Enviando payload:', payload);
        console.log('Modal - Order ID:', payload.orderId);
        console.log('Modal - Technician IDs:', payload.technicianIds);
        emit('submit', payload);
      } catch (error) {
        console.error('Error asignando técnicos:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
      selectedTechnicianIds,
      availableTechnicians,
      loading,
      loadingTechnicians,
      toggleTechnician,
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
        <h2>{{ $t('workOrder.form.assignTechnicians.title') }}</h2>
        <button class="close-button" @click="handleCancel" :aria-label="$t('workOrder.form.actions.cancel')">×</button>
      </div>

      <div class="modal-content">
        <div class="order-info">
          <h3>{{ $t('workOrder.form.assignTechnicians.orderInfo') }}</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">{{ $t('workOrder.table.code') }}:</span>
              <span class="value">{{ orderData.code }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('workOrder.table.type') }}:</span>
              <span class="value">{{ orderData.type }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ $t('workOrder.table.date') }}:</span>
              <span class="value">{{ orderData.date }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ $t('workOrder.form.assignTechnicians.selectTechnicians') }}</label>
          
          <div v-if="loadingTechnicians" class="loading-technicians">
            <span class="loading-text">{{ $t('workOrder.form.assignTechnicians.loading') }}</span>
          </div>
          
          <div v-else-if="availableTechnicians.length === 0" class="no-technicians">
            <span class="no-technicians-text">{{ $t('workOrder.form.assignTechnicians.noTechnicians') }}</span>
          </div>
          
          <div v-else class="technicians-checkboxes">
            <div v-for="tech in availableTechnicians" :key="tech.id" class="checkbox-item">
              <input
                type="checkbox"
                :id="`technician_${tech.id}`"
                :checked="selectedTechnicianIds.includes(tech.id)"
                @change="toggleTechnician(tech.id, $event)"
              />
              <label :for="`technician_${tech.id}`">
                <div class="technician-info">
                  <span class="technician-name">{{ tech.fullName }}</span>
                  <span class="technician-details">{{ tech.username }} - {{ tech.email }}</span>
                  <span class="technician-role">Técnico</span>
                </div>
              </label>
            </div>
          </div>
          
          <small class="hint">{{ $t('workOrder.form.assignTechnicians.hint') }}</small>
        </div>

        <div v-if="selectedTechnicianIds.length > 0" class="selected-summary">
          <h4>{{ $t('workOrder.form.assignTechnicians.selectedCount', { count: selectedTechnicianIds.length }) }}</h4>
          <div class="selected-list">
            <span 
              v-for="techId in selectedTechnicianIds" 
              :key="techId"
              class="selected-technician"
            >
              {{ availableTechnicians.find(t => t.id === techId)?.fullName }}
            </span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <ButtonComponent
          variant="outline"
          @clicked="handleCancel"
        >
          {{ $t('workOrder.form.actions.cancel') }}
        </ButtonComponent>
        
        <ButtonComponent
          variant="primary"
          @clicked="handleSubmit"
          :loading="loading"
        >
          {{ $t('workOrder.form.assignTechnicians.assign') }}
        </ButtonComponent>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-container {
    background: var(--clr-bg);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 10px var(--clr-shadow);
    border: 1px solid var(--clr-grey-200);
    width: 600px;
    max-width: 95vw;
    max-height: 90vh;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--clr-primary-300);

    h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--clr-primary-500);
        letter-spacing: -0.5px;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.8rem;
        cursor: pointer;
        color: var(--clr-text);
        opacity: 0.7;
        transition: all 0.2s ease;
        padding: 4px;
        border-radius: 4px;

        &:hover {
            opacity: 1;
            background-color: var(--clr-grey-100);
        }
    }
}

.modal-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.order-info {
    background: var(--clr-surface);
    border: 1px solid var(--clr-grey-200);
    border-radius: var(--radius-md);
    padding: 16px;

    h3 {
        margin: 0 0 12px 0;
        font-size: 16px;
        font-weight: 500;
        color: var(--clr-primary-500);
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
    }

    .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
            font-size: 12px;
            color: var(--clr-grey-200);
            font-weight: 500;
        }

        .value {
            font-size: 14px;
            color: var(--clr-text);
            font-weight: 500;
        }
    }
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
        font-weight: 500;
        color: var(--clr-text);
        font-size: 14px;
        margin-bottom: 4px;
    }
}

.loading-technicians,
.no-technicians {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px;
    background: var(--clr-surface);
    border: 1px solid var(--clr-grey-200);
    border-radius: var(--radius-md);

    .loading-text,
    .no-technicians-text {
        color: var(--clr-grey-200);
        font-size: 14px;
    }
}

.technicians-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;

    .checkbox-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border: 1px solid var(--clr-grey-200);
        border-radius: 4px;
        background: var(--clr-bg);
        transition: all 0.2s ease;
        cursor: pointer;

        &:hover {
            border-color: var(--clr-primary-300);
            background: var(--clr-primary-100);
        }

        input[type="checkbox"] {
            width: auto;
            margin: 0;
            margin-top: 2px;
            cursor: pointer;

            &:checked {
                accent-color: var(--clr-primary-500);
            }
        }

        label {
            margin: 0;
            cursor: pointer;
            flex: 1;
        }

        .technician-info {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .technician-name {
                font-size: 14px;
                color: var(--clr-text);
                font-weight: 500;
            }

            .technician-details {
                font-size: 12px;
                color: var(--clr-grey-200);
            }

            .technician-role {
                font-size: 11px;
                font-weight: 500;
                padding: 2px 6px;
                border-radius: 10px;
                text-transform: uppercase;
                width: fit-content;
                background: var(--clr-primary-100);
                color: var(--clr-primary-500);
            }
        }
    }
}

.selected-summary {
    background: var(--clr-primary-100);
    border: 1px solid var(--clr-primary-300);
    border-radius: var(--radius-md);
    padding: 16px;

    h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--clr-primary-500);
    }

    .selected-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .selected-technician {
        background: var(--clr-primary-500);
        color: var(--clr-bg);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    }
}

.hint {
    color: var(--clr-grey-200);
    font-size: 12px;
    margin-top: 4px;
    display: block;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid var(--clr-grey-100);
}
</style> 