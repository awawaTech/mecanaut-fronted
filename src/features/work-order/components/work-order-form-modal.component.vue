<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonComponent from '@/shared/components/button.component.vue';

export default {
  name: 'WorkOrderFormModal',
  components: {
    ButtonComponent
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    orderData: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'delete', 'cancel'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const formData = ref({
      code: '',
      date: '',
      productionLine: '',
      type: '',
      technicians: []
    });

    const availableTechnicians = ref([
      { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
      { id: 2, name: 'María López', email: 'maria@example.com' },
      { id: 3, name: 'Luis Ramírez', email: 'luis@example.com' },
      { id: 4, name: 'Ana García', email: 'ana@example.com' },
      { id: 5, name: 'Carlos Rodríguez', email: 'carlos@example.com' }
    ]);
    
    const availableMachines = ref([
      { id: 1, code: 'MT-430', name: 'Máquina Torno 430' },
      { id: 2, code: 'MT-450', name: 'Máquina Torno 450' },
      { id: 3, code: 'MT-500', name: 'Máquina Torno 500' },
      { id: 4, code: 'MT-600', name: 'Máquina Torno 600' },
      { id: 5, code: 'MT-700', name: 'Máquina Torno 700' },
      { id: 6, code: 'MT-800', name: 'Máquina Torno 800' }
    ]);

    const productionLines = ref([
      { id: 1, code: 'L-01', name: 'Línea de Producción 01' },
      { id: 2, code: 'L-02', name: 'Línea de Producción 02' }
    ]);

    const technicianRows = ref([]);

    onMounted(() => {
      if (props.orderData) {
        formData.value = {
          ...formData.value,
          ...props.orderData
        };

        technicianRows.value = (props.orderData.technicians || []).map(tech => ({
          technician: tech.name,
          machines: [...tech.machines]
        }));
      }

      if (technicianRows.value.length === 0) {
        addTechnicianRow();
      }
    });

    const addTechnicianRow = () => {
      technicianRows.value.push({
        technician: '',
        machines: []
      });
    };

    const removeTechnicianRow = (index) => {
      technicianRows.value.splice(index, 1);
    };

    const toggleMachine = (technicianIndex, machine, event) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        if (!technicianRows.value[technicianIndex].machines.includes(machine)) {
          technicianRows.value[technicianIndex].machines.push(machine);
        }
      } else {
        technicianRows.value[technicianIndex].machines = 
          technicianRows.value[technicianIndex].machines.filter(m => m !== machine);
      }
    };

    const handleSubmit = () => {
      const technicians = technicianRows.value
        .filter(row => row.technician && row.machines.length > 0)
        .map(row => ({
          name: row.technician,
          machines: [...row.machines]
        }));

      const formDataForBackend = {
        ...formData.value,
        technicians,
        id: props.orderData?.id
      };

      emit('submit', formDataForBackend);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    const handleDelete = () => {
      if (confirm(t('workOrder.form.confirmDelete'))) {
        if (props.orderData?.id) {
          emit('delete', props.orderData.id);
        }
      }
    };

    return {
      formData,
      availableTechnicians,
      availableMachines,
      productionLines,
      technicianRows,
      addTechnicianRow,
      removeTechnicianRow,
      toggleMachine,
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
        <h2>{{ isEdit ? $t('workOrder.form.title.edit') : $t('workOrder.form.title.new') }}</h2>
        <button class="close-button" @click="handleCancel" :aria-label="$t('workOrder.form.actions.cancel')">×</button>
      </div>

      <div class="modal-content">
        <form @submit.prevent="handleSubmit" class="form-container">
          <div class="form-group">
            <label for="code">{{ $t('workOrder.form.fields.code.label') }}</label>
            <input
              id="code"
              v-model="formData.code"
              type="text"
              required
              :disabled="isEdit"
              :placeholder="$t('workOrder.form.fields.code.placeholder')"
            />
          </div>

          <div class="form-group">
            <label for="date">{{ $t('workOrder.form.fields.date.label') }}</label>
            <input
              id="date"
              v-model="formData.date"
              type="date"
              required
            />
          </div>

          <div class="form-group">
            <label for="productionLine">{{ $t('workOrder.form.fields.productionLine.label') }}</label>
            <select
              id="productionLine"
              v-model="formData.productionLine"
              required
            >
              <option value="">{{ $t('workOrder.form.fields.productionLine.placeholder') }}</option>
              <option v-for="line in productionLines" :key="line.id" :value="line.code">
                {{ line.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="type">{{ $t('workOrder.form.fields.type.label') }}</label>
            <select
              id="type"
              v-model="formData.type"
              required
            >
              <option value="Preventivo">{{ $t('workOrder.form.fields.type.options.preventive') }}</option>
              <option value="Correctivo">{{ $t('workOrder.form.fields.type.options.corrective') }}</option>
            </select>
          </div>

          <div class="form-group">
            <div class="section-header">
              <label>{{ $t('workOrder.form.fields.technicians.label') }}</label>
              <button type="button" class="add-button" @click="addTechnicianRow">
                <span class="add-icon">+</span>
                {{ $t('workOrder.form.fields.technicians.add') }}
              </button>
            </div>

            <div class="technicians-container">
              <div v-if="technicianRows.length === 0" class="empty-state">
                <span class="empty-icon">👥</span>
                <p>{{ $t('workOrder.form.fields.technicians.emptyState') }}</p>
              </div>

              <div v-for="(row, i) in technicianRows" :key="i" class="technician-card">
                <div class="technician-header">
                  <h4 class="technician-title">
                    {{ $t('workOrder.form.fields.technicians.technician') }} {{ i + 1 }}
                  </h4>
                  <button
                    type="button"
                    class="delete-button"
                    @click="removeTechnicianRow(i)"
                    :disabled="technicianRows.length <= 1"
                    :aria-label="$t('workOrder.form.fields.technicians.remove')"
                  >
                    ×
                  </button>
                </div>

                <div class="technician-content">
                  <div class="form-group">
                    <label>{{ $t('workOrder.form.fields.technicians.select') }}</label>
                    <select
                      v-model="row.technician"
                    >
                      <option value="">{{ $t('workOrder.form.fields.technicians.selectPlaceholder') }}</option>
                      <option v-for="tech in availableTechnicians" :key="tech.id" :value="tech.name">
                        {{ tech.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label>{{ $t('workOrder.form.fields.technicians.machines') }}</label>
                    <div class="machines-checkboxes">
                      <div v-for="machine in availableMachines" :key="machine.id" class="checkbox-item">
                        <input
                          type="checkbox"
                          :id="`machine_${i}_${machine.code}`"
                          :checked="row.machines.includes(machine.code)"
                          @change="toggleMachine(i, machine.code, $event)"
                        />
                        <label :for="`machine_${i}_${machine.code}`">{{ machine.name }}</label>
                      </div>
                    </div>
                    <small class="hint">{{ $t('workOrder.form.fields.technicians.machinesHint') }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <ButtonComponent
          variant="outline"
          @clicked="handleCancel"
        >
          {{ $t('workOrder.form.actions.cancel') }}
        </ButtonComponent>
        
        <ButtonComponent
          v-if="isEdit"
          variant="danger"
          @clicked="handleDelete"
          :aria-label="$t('workOrder.form.actions.delete')"
        >
          {{ $t('workOrder.form.actions.delete') }}
        </ButtonComponent>
        
        <ButtonComponent
          variant="primary"
          @clicked="handleSubmit"
        >
          {{ isEdit ? $t('workOrder.form.actions.save') : $t('workOrder.form.actions.create') }}
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
    width: 700px;
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
    .form-container {
        display: flex;
        flex-direction: column;
        gap: 24px;
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

        input, select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--clr-grey-200);
            border-radius: 4px;
            background: var(--clr-bg);
            color: var(--clr-text);
            font-size: 14px;
            transition: all 0.2s ease;
            box-sizing: border-box;

            &:focus {
                outline: none;
                border-color: var(--clr-primary-500);
                box-shadow: 0 0 0 2px var(--clr-primary-100);
            }

            &:disabled {
                background: var(--clr-grey-050);
                cursor: not-allowed;
                color: var(--clr-grey-200);
            }

            &::placeholder {
                color: var(--clr-grey-200);
            }
        }
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        label {
            margin: 0;
            font-size: 16px;
            font-weight: 500;
            color: var(--clr-primary-500);
        }

        .add-button {
            background: var(--clr-primary-500);
            color: var(--clr-bg);
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;

            &:hover {
                background: var(--clr-primary-400);
                transform: translateY(-1px);
            }

            &:active {
                transform: translateY(0);
            }

            .add-icon {
                font-size: 16px;
                font-weight: bold;
            }
        }
    }

    .technicians-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .empty-state {
        background: var(--clr-surface);
        border: 2px dashed var(--clr-grey-200);
        border-radius: var(--radius-md);
        padding: 32px;
        text-align: center;
        color: var(--clr-grey-200);

        .empty-icon {
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
        }

        p {
            margin: 0;
            font-size: 14px;
        }
    }

    .technician-card {
        background: var(--clr-bg);
        border: 1px solid var(--clr-grey-200);
        border-radius: var(--radius-md);
        padding: 20px;
        box-shadow: 0 2px 4px var(--clr-shadow);
        transition: all 0.2s ease;
        border-left: 4px solid var(--clr-primary-500);

        &:hover {
            box-shadow: 0 4px 8px var(--clr-shadow);
        }

        .technician-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;

            .technician-title {
                margin: 0;
                font-size: 16px;
                font-weight: 500;
                color: var(--clr-primary-500);
            }

            .delete-button {
                background: none;
                border: none;
                color: var(--clr-danger-500);
                font-size: 20px;
                cursor: pointer;
                opacity: 0.7;
                padding: 8px;
                border-radius: 4px;
                transition: all 0.2s ease;

                &:hover:not(:disabled) {
                    opacity: 1;
                    background-color: var(--clr-danger-050);
                }

                &:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
            }
        }

        .technician-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
    }

    .machines-checkboxes {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 12px;
        margin-top: 8px;

        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
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
                cursor: pointer;

                &:checked {
                    accent-color: var(--clr-primary-500);
                }
            }

            label {
                margin: 0;
                cursor: pointer;
                font-size: 14px;
                color: var(--clr-text);
                flex: 1;
            }
        }
    }

    .hint {
        color: var(--clr-grey-200);
        font-size: 12px;
        margin-top: 4px;
        display: block;
    }
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid var(--clr-grey-100);
}
</style>
