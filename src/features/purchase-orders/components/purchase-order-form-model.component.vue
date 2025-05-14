<script>
import { ref, onMounted } from 'vue';
import Button from '../../../shared/components/button.component.vue';

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
        }
    },

    emits: ['submit', 'cancel', 'delete'],

    setup(props, { emit }) {
        const formData = ref({
            inventory_part_id: 0,
            quantity: 0,
            status: 'PENDING',
            orderDate: new Date().toISOString().split('T')[0],
            expectedDeliveryDate: '',
            supplier: '',
            unitPrice: 0,
            totalPrice: 0
        });

        const handleSubmit = () => {
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

        onMounted(() => {
            if (props.isEdit && props.orderData) {
                formData.value = {
                    inventory_part_id: props.orderData.inventory_part_id,
                    quantity: props.orderData.quantity,
                    status: props.orderData.status,
                    orderDate: props.orderData.orderDate?.split('T')[0],
                    expectedDeliveryDate: props.orderData.expectedDeliveryDate?.split('T')[0],
                    supplier: props.orderData.supplier,
                    unitPrice: props.orderData.unitPrice,
                    totalPrice: props.orderData.totalPrice
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
                <h2>{{ isEdit ? 'Editar Orden de Compra' : 'Nueva Orden de Compra' }}</h2>
                <button class="close-button" @click="handleCancel">×</button>
            </div>
            
            <div class="modal-content">
                <form @submit.prevent="handleSubmit" class="form-container">
                    <div class="form-group">
                        <label for="inventory_part_id">ID del Repuesto</label>
                        <input 
                            id="inventory_part_id"
                            v-model="formData.inventory_part_id"
                            type="text"
                            required
                            :disabled="isEdit"
                            placeholder="Ingrese el ID del repuesto"
                        />
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
                        <label for="status">Estado</label>
                        <select 
                            id="status"
                            v-model="formData.status"
                            required
                        >
                            <option value="PENDING">Pendiente</option>
                            <option value="IN_PROGRESS">En Progreso</option>
                            <option value="COMPLETED">Completada</option>
                            <option value="CANCELLED">Cancelada</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="orderDate">Fecha de Orden</label>
                            <input 
                                id="orderDate"
                                v-model="formData.orderDate"
                                type="date"
                                required
                            />
                        </div>
                        <div class="form-group">
                            <label for="expectedDeliveryDate">Fecha Esperada de Entrega</label>
                            <input 
                                id="expectedDeliveryDate"
                                v-model="formData.expectedDeliveryDate"
                                type="date"
                                required
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="supplier">Proveedor</label>
                        <input 
                            id="supplier"
                            v-model="formData.supplier"
                            type="text"
                            required
                            placeholder="Ingrese el proveedor"
                        />
                    </div>
                    <div class="form-row">
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
.form-group select {
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
