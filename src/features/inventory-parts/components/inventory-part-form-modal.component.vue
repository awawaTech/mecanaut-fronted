<script>
import { ref, onMounted } from 'vue';
import Button from '../../../shared/components/button.component.vue';

export default {
    name: 'InventoryPartFormModal',
    
    components: {
        Button
    },

    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        partData: {
            type: Object,
            default: () => ({})
        }
    },

    emits: ['submit', 'cancel', 'delete'],

    setup(props, { emit }) {
        const formData = ref({
            code: '',
            name: '',
            description: '',
            currentStock: 0,
            minStock: 0,
            unitPrice: 0
        });

        const handleSubmit = () => {
            emit('submit', {
                ...formData.value,
                id: props.partData?.id
            });
        };

        const handleCancel = () => {
            emit('cancel');
        };

        const handleDelete = () => {
            if (confirm('¿Está seguro de eliminar este repuesto?')) {
                emit('delete', props.partData.id);
            }
        };

        onMounted(() => {
            if (props.isEdit && props.partData) {
                formData.value = {
                    code: props.partData.code,
                    name: props.partData.name,
                    description: props.partData.description,
                    currentStock: props.partData.currentStock,
                    minStock: props.partData.minStock,
                    unitPrice: props.partData.unitPrice
                };
            }
        });

        return {
            formData,
            handleSubmit,
            handleCancel,
            handleDelete
        };
    }
}
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-container">
            <div class="modal-header">
                <h2>{{ isEdit ? 'Editar Repuesto' : 'Nuevo Repuesto' }}</h2>
                <button class="close-button" @click="handleCancel">×</button>
            </div>
            
            <div class="modal-content">
                <form @submit.prevent="handleSubmit" class="form-container">
                    <div class="form-group">
                        <label for="code">Código</label>
                        <input 
                            id="code"
                            v-model="formData.code"
                            type="text"
                            required
                            :disabled="isEdit"
                            placeholder="Ingrese el código"
                        />
                    </div>
                    <div class="form-group">
                        <label for="name">Nombre</label>
                        <input 
                            id="name"
                            v-model="formData.name"
                            type="text"
                            required
                            :disabled="isEdit"
                            placeholder="Ingrese el nombre"
                        />
                    </div>
                    <div class="form-group">
                        <label for="description">Descripción</label>
                        <textarea 
                            id="description"
                            v-model="formData.description"
                            rows="3"
                            placeholder="Ingrese la descripción"
                        ></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="currentStock">Stock Actual</label>
                            <input 
                                id="currentStock"
                                v-model.number="formData.currentStock"
                                type="number"
                                required
                                min="0"
                            />
                        </div>
                        <div class="form-group">
                            <label for="minStock">Stock Mínimo</label>
                            <input 
                                id="minStock"
                                v-model.number="formData.minStock"
                                type="number"
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="unitPrice">Precio Unitario</label>
                        <input 
                            id="unitPrice"
                            v-model.number="formData.unitPrice"
                            type="number"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <Button
                    variant="outline"
                    @clicked="handleCancel"
                >
                    Cancelar
                </Button>
                <Button style="background-color: var(--clr-danger);"
                    v-if="isEdit"
                    variant="danger"
                    @clicked="handleDelete"
                >
                    Eliminar
                </Button>
                <Button
                    variant="primary"
                    @clicked="handleSubmit"
                >
                    {{ isEdit ? 'Guardar Cambios' : 'Crear' }}
                </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
.form-group textarea {
    padding: 0.5rem;
    border: 1px solid var(--clr-primary-100);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    color: var(--clr-text);
    background-color: var(--clr-surface);
}

.form-group input:disabled {
    background-color: var(--clr-disabled);
    cursor: not-allowed;
}

.form-row {
    display: flex;
    gap: 1rem;
}

.form-row .form-group {
    flex: 1;
}

input[type="number"] {
    -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
