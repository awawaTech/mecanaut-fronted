<script>
import { ref, onMounted } from 'vue';
import Button from '../../../shared/components/button.component.vue';
import { InventoryPartsApiService } from '../../inventory-parts/services/inventory-parts-api.service';

export default {
    name: 'PurchaseOrderFormModal',
    
    components: {
        Button
    },

    props: {
        isEdit: {
            type: Boolean,
            default: false
        },
        orderData: {
            type: Object,
            default: () => ({})
        },
        plantId: {
            type: Number,
            required: true
        }
    },

    emits: ['submit', 'cancel', 'delete'],

    setup(props, { emit }) {
        const formData = ref({
            orderNumber: '',
            inventoryPartId: '',
            quantity: 0,
            totalPrice: 0,
            deliveryDate: ''
        });

        const inventoryParts = ref([]);
        const loadingParts = ref(false);

        const loadInventoryParts = async () => {
            try {
                loadingParts.value = true;
                const data = await InventoryPartsApiService.getParts(props.plantId);
                inventoryParts.value = data;
            } catch (error) {
                console.error('Error cargando partes de inventario:', error);
            } finally {
                loadingParts.value = false;
            }
        };

        const handleSubmit = () => {
            // Validar que todos los campos requeridos estén completos
            if (!formData.value.orderNumber || !formData.value.inventoryPartId || !formData.value.quantity || !formData.value.deliveryDate) {
                alert('Por favor complete todos los campos requeridos');
                return;
            }

            emit('submit', {
                ...formData.value,
                id: props.orderData?.id
            });
        };

        const handleCancel = () => {
            emit('cancel');
        };

        const handleDelete = () => {
            if (confirm('¿Está seguro de eliminar esta orden de compra?')) {
                emit('delete', props.orderData.id);
            }
        };

        onMounted(async () => {
            await loadInventoryParts();
            
            if (props.isEdit && props.orderData) {
                formData.value = {
                    orderNumber: props.orderData.orderNumber,
                    inventoryPartId: props.orderData.inventoryPartId,
                    quantity: props.orderData.quantity,
                    totalPrice: props.orderData.totalPrice,
                    deliveryDate: props.orderData.deliveryDate?.split('T')[0] || ''
                };
            }
        });

        return {
            formData,
            inventoryParts,
            loadingParts,
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
                <h2>{{ isEdit ? 'Editar Orden de Compra' : 'Nueva Orden de Compra' }}</h2>
                <button class="close-button" @click="handleCancel">×</button>
            </div>
            
            <div class="modal-content">
                <form @submit.prevent="handleSubmit" class="form-container">
                    <div class="form-group">
                        <label for="orderNumber">Número de Orden</label>
                        <input 
                            id="orderNumber"
                            v-model="formData.orderNumber"
                            type="text"
                            required
                            :disabled="isEdit"
                            placeholder="Ingrese el número de orden"
                        />
                    </div>
                    <div class="form-group">
                        <label for="inventoryPartId">Repuesto</label>
                        <select 
                            id="inventoryPartId"
                            v-model="formData.inventoryPartId"
                            required
                            :disabled="isEdit || loadingParts"
                            class="form-select"
                        >
                            <option value="" disabled>
                                {{ loadingParts ? 'Cargando repuestos...' : 'Selecciona un repuesto' }}
                            </option>
                            <option 
                                v-for="part in inventoryParts" 
                                :key="part.id" 
                                :value="part.id"
                            >
                                {{ part.code }} - {{ part.name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="quantity">Cantidad</label>
                        <input 
                            id="quantity"
                            v-model.number="formData.quantity"
                            type="number"
                            required
                            min="1"
                            placeholder="Ingrese la cantidad"
                        />
                    </div>
                    <div class="form-group">
                        <label for="totalPrice">Precio Total</label>
                        <input 
                            id="totalPrice"
                            v-model.number="formData.totalPrice"
                            type="number"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div class="form-group">
                        <label for="deliveryDate">Fecha de Entrega</label>
                        <input 
                            id="deliveryDate"
                            v-model="formData.deliveryDate"
                            type="date"
                            required
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
                <Button 
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
.form-group select,
.form-select {
    padding: 0.5rem;
    border: 1px solid var(--clr-primary-100);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    color: var(--clr-text);
    background-color: var(--clr-surface);
    cursor: pointer;
}

.form-select:disabled {
    background-color: var(--clr-disabled);
    cursor: not-allowed;
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
