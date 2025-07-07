<script>
import { ref, onMounted } from 'vue';
import Search from '../../../shared/components/search.component.vue'
import RecordTable from '../../../shared/components/record-table.component.vue'
import InformationPanel from '../../../shared/components/information-panel/information-panel.component.vue'
import InfoSection from '../../../shared/components/information-panel/info-section.component.vue'
import { PurchaseOrdersApiService } from '../services/purchase-orders-api.service';
import PurchaseOrderFormModal from '../components/purchase-order-form-model.component.vue';
import ButtonComponent from '../../../shared/components/button.component.vue';

export default {
    components: {
        Search,
        RecordTable,
        InformationPanel,
        InfoSection,
        PurchaseOrderFormModal,
        ButtonComponent
    },
    setup() {
        const purchaseOrders = ref([]);
        const selectedOrder = ref(null);
        const showInfoPanel = ref(false);
        const showCreateModal = ref(false);
        const showEditModal = ref(false);
        const plants = ref([]);
        const selectedPlantId = ref(null);
        
        const columns = [
            { key: 'orderNumber', label: 'Número de Orden', type: 'texto' },
            { key: 'inventoryPartId', label: 'ID Repuesto', type: 'texto' },
            { key: 'quantity', label: 'Cantidad', type: 'numero' },
            { key: 'status', label: 'Estado', type: 'texto', filterable: true },
            { key: 'info', label: 'Información', type: 'informacion' }
        ];

        const loadPlants = async () => {
            try {
                const data = await PurchaseOrdersApiService.getPlants();
                plants.value = data;
                // Si hay plantas, seleccionar la primera por defecto
                if (data.length > 0 && !selectedPlantId.value) {
                    selectedPlantId.value = data[0].id;
                }
            } catch (error) {
                console.error('Error loading plants:', error);
            }
        };

        const loadPurchaseOrders = async () => {
            try {
                if (!selectedPlantId.value) return;
                
                const data = await PurchaseOrdersApiService.getPurchaseOrders(selectedPlantId.value);
                purchaseOrders.value = data.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    inventoryPartId: order.inventoryPartId,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    orderDate: order.orderDate,
                    deliveryDate: order.deliveryDate,
                    plantId: order.plantId
                }));
            } catch (error) {
                console.error('Error cargando órdenes de compra:', error);
            }
        };

        const handlePlantChange = async () => {
            await loadPurchaseOrders();
        };

        const handleInfoClick = async (item) => {
            try {
                const completeData = await PurchaseOrdersApiService.getPurchaseOrderById(item.id);
                selectedOrder.value = {
                    ...completeData,
                    generalInfo: [
                        { subtitle: 'ID Orden', info: completeData.id },
                        { subtitle: 'Número de Orden', info: completeData.orderNumber },
                        { subtitle: 'Estado', info: completeData.status, class: completeData.status.toLowerCase() }
                    ],
                    orderInfo: [
                        { 
                            subtitle: 'ID Repuesto',
                            info: completeData.inventoryPartId
                        },
                        { 
                            subtitle: 'Cantidad',
                            info: `${completeData.quantity} unidades`
                        },
                        { 
                            subtitle: 'Precio Total',
                            info: `$${completeData.totalPrice || 0}`
                        }
                    ],
                    dateInfo: [
                        {
                            subtitle: 'Fecha de Orden',
                            info: completeData.orderDate ? new Date(completeData.orderDate).toLocaleDateString() : 'No disponible'
                        },
                        {
                            subtitle: 'Fecha de Entrega',
                            info: completeData.deliveryDate ? new Date(completeData.deliveryDate).toLocaleDateString() : 'No disponible'
                        }
                    ]
                };
                showInfoPanel.value = true;
            } catch (error) {
                console.error('Error cargando detalles de la orden:', error);
            }
        };

        const handleCreate = async (formData) => {
            try {
                // Agregar el plantId seleccionado
                const orderDataWithPlant = {
                    ...formData,
                    plantId: selectedPlantId.value
                };

                await PurchaseOrdersApiService.createPurchaseOrder(orderDataWithPlant);
                showCreateModal.value = false;
                await loadPurchaseOrders();
            } catch (error) {
                console.error('Error al crear:', error);
            }
        };

        const handleEdit = async (formData) => {
            try {
                // Como no hay endpoint de actualización, solo cerramos el modal
                showEditModal.value = false;
                selectedOrder.value = null;
                await loadPurchaseOrders();
            } catch (error) {
                console.error('Error al actualizar:', error);
            }
        };

        const handleDelete = async (id) => {
            try {
                if (confirm('¿Está seguro de eliminar esta orden de compra?')) {
                    await PurchaseOrdersApiService.deletePurchaseOrder(id);
                    showEditModal.value = false;
                    selectedOrder.value = null;
                    showInfoPanel.value = false;
                    await loadPurchaseOrders();
                }
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        };

        const handleComplete = async (id) => {
            try {
                await PurchaseOrdersApiService.completePurchaseOrder(id);
                selectedOrder.value = null;
                showInfoPanel.value = false;
                await loadPurchaseOrders();
            } catch (error) {
                console.error('Error al completar:', error);
            }
        };

        const closePanel = () => {
            showInfoPanel.value = false;
            setTimeout(() => {
                selectedOrder.value = null;
            }, 300);
        };

        onMounted(async () => {
            await loadPlants();
            await loadPurchaseOrders();
        });

        return {
            purchaseOrders,
            selectedOrder,
            showInfoPanel,
            showCreateModal,
            showEditModal,
            handleInfoClick,
            handleCreate,
            handleEdit,
            handleDelete,
            handleComplete,
            columns,
            closePanel,
            plants,
            selectedPlantId,
            handlePlantChange
        };
    }
}
</script>   

<template>
    <div class="container">
        <div class="header-main">
            <h1>Órdenes de Compra</h1>
            <div class="divider"></div>
        </div>

        <!-- Selector de Planta -->
        <div class="plant-selector">
            <label for="plant-select">Seleccionar Planta:</label>
            <select 
                id="plant-select"
                v-model="selectedPlantId"
                @change="handlePlantChange"
                class="plant-select"
            >
                <option value="" disabled>Selecciona una planta</option>
                <option 
                    v-for="plant in plants" 
                    :key="plant.id" 
                    :value="plant.id"
                >
                    {{ plant.name }}
                </option>
            </select>
        </div>

        <div class="main-content">
            <div class="left-container">
                <RecordTable 
                    :columns="columns"
                    :data="purchaseOrders"
                    :searchable-columns="['orderNumber', 'inventoryPartId']"
                    search-placeholder="Buscar por número de orden o ID repuesto ..."
                    :show-new-button="true"
                    :new-label="'Orden de Compra'"
                    @info-click="handleInfoClick"
                    @new-click="() => showCreateModal = true"
                />
            </div>
            <div class="right-container" :class="{ 'show-panel': showInfoPanel }">
                <InformationPanel 
                    v-if="showInfoPanel"
                    class="info-panel"
                >
                    <template #header>
                        <div class="panel-header">
                            <h2>Información Detallada de la Orden</h2>
                        </div>
                    </template>

                    <!-- Información General -->
                    <InfoSection 
                        v-if="selectedOrder"
                        :infoType="1"
                        title="Información General"
                        :data="selectedOrder.generalInfo"
                    />
                    
                    <!-- Información de la Orden -->
                    <InfoSection 
                        v-if="selectedOrder"
                        :infoType="2"
                        title="Detalles de la Orden"
                        :data="selectedOrder.orderInfo"
                    />

                    <!-- Información de Fechas -->
                    <InfoSection 
                        v-if="selectedOrder"
                        :infoType="3"
                        title="Fechas"
                        :data="selectedOrder.dateInfo"
                    />

                    <!-- Información del Repuesto -->
                    <InfoSection 
                        v-if="selectedOrder"
                        :infoType="4"
                        title="Repuesto Asociado"
                        :data="selectedOrder.partInfo"
                    />
                </InformationPanel>
                <div class="panel-actions">
                    <div class="actions-row">
                        <button-component
                            v-if="selectedOrder && selectedOrder.status !== 'Completed'"
                            variant="success"
                            style="background-color: var(--clr-primary-400);"
                            size="sm"
                            icon-left="pi pi-check"
                            @clicked="handleComplete(selectedOrder.id)"
                        >
                            Completar
                        </button-component>
                    </div>
                    <div class="actions-row">
                        <button-component
                            variant="danger"
                            style="background-color: var(--clr-danger);"
                            size="sm"
                            icon-left="pi pi-trash"
                            @clicked="handleDelete(selectedOrder.id)"
                        >
                            Eliminar
                        </button-component>
                        <button-component
                            variant="secondary"
                            size="sm"
                            icon-left="pi pi-times"
                            @clicked="closePanel"
                        >
                            Cerrar
                        </button-component>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Crear -->
        <PurchaseOrderFormModal
            v-if="showCreateModal"
            :is-edit="false"
            :order-data="selectedOrder"
            :plant-id="selectedPlantId"
            @submit="handleCreate"
            @cancel="() => {
                showCreateModal = false;
                selectedOrder = null;
            }"
        />

        <!-- Modal de Editar -->
        <PurchaseOrderFormModal
            v-if="showEditModal"
            :is-edit="true"
            :order-data="selectedOrder"
            :plant-id="selectedPlantId"
            @submit="handleEdit"
            @delete="handleDelete"
            @cancel="showEditModal = false"
        />
    </div>
</template>

<style scoped>
* {
    font-family: var(--font-family-base);
}

.container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    height: 100%;
}

.header-main {
    width: 100%;
}

.header-main h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: var(--clr-text);
}

.divider {
    width: 100%;
    height: 1px;
    background-color: var(--clr-primary-100);
    margin: 10px 0;
}

.plant-selector {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding: 15px;
    background: var(--surface-card);
    border-radius: 8px;
    box-shadow: var(--card-shadow);
}

.plant-selector label {
    font-weight: 600;
    color: var(--text-color);
    white-space: nowrap;
}

.plant-select {
    padding: 8px 12px;
    border: 1px solid var(--surface-border);
    border-radius: 6px;
    background: var(--surface-ground);
    color: var(--text-color);
    font-size: 14px;
    min-width: 200px;
    cursor: pointer;
    transition: border-color 0.2s ease;
}

.plant-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-alpha-20);
}

.plant-select:hover {
    border-color: var(--primary-color);
}

.main-content {
    display: flex;
    gap: 20px;
    height: calc(100% - 80px);
}

.left-container {
    flex: 3;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.right-container {
    flex: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    width: 0;
}

.right-container.show-panel {
    flex: 1;
    width: auto;
}

.info-panel {
    height: 100%;
    transition: all 0.3s ease;
    min-width: 350px;
    background: var(--clr-surface);
    border-radius: var(--radius-lg);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

/* Estados de órdenes */
.created { color: var(--clr-primary); }
.in_progress { color: var(--clr-warning); }
.completed { color: var(--clr-success); }
.cancelled { color: var(--clr-danger); }

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--clr-border);
}

.panel-header h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--clr-text);
}

.panel-actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
}

.actions-row {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
}

.actions-row:first-child {
    justify-content: center;
}

.actions-row:last-child {
    justify-content: space-between;
}

:deep(.button-component) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}
</style>
