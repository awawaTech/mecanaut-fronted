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
        
        const columns = [
            { key: 'id', label: 'ID Orden', type: 'texto' },
            { key: 'inventory_part_name', label: 'Repuesto', type: 'texto' },
            { key: 'quantity', label: 'Cantidad', type: 'numero' },
            { key: 'status', label: 'Estado', type: 'texto', filterable: true },
            { key: 'info', label: 'Información', type: 'informacion' }
        ];

        const loadPurchaseOrders = async () => {
            try {
                const data = await PurchaseOrdersApiService.getPurchaseOrders();
                purchaseOrders.value = data.map(order => ({
                    id: order.id,
                    inventory_part_id: order.inventory_part_id,
                    inventory_part_name: order.inventoryPart?.name || 'N/A',
                    quantity: order.quantity,
                    price: order.price,
                    status: order.status,
                    order_date: order.order_date,
                    received_date: order.received_date,
                    user_id: order.user_id
                }));
            } catch (error) {
                console.error('Error cargando órdenes de compra:', error);
            }
        };

        const handleInfoClick = async (item) => {
            try {
                const completeData = await PurchaseOrdersApiService.getPurchaseOrderById(item.id);
                selectedOrder.value = {
                    ...completeData,
                    generalInfo: [
                        { subtitle: 'ID Orden', info: completeData.id },
                        { subtitle: 'Usuario ID', info: completeData.user_id },
                        { subtitle: 'Estado', info: completeData.status, class: completeData.status.toLowerCase() }
                    ],
                    orderInfo: [
                        { 
                            subtitle: 'Cantidad',
                            info: `${completeData.quantity} unidades`
                        },
                        { 
                            subtitle: 'Precio',
                            info: `$${completeData.price}`
                        }
                    ],
                    dateInfo: [
                        {
                            subtitle: 'Fecha de Orden',
                            info: new Date(completeData.order_date).toLocaleDateString()
                        },
                        {
                            subtitle: 'Fecha de Recepción',
                            info: completeData.received_date ? new Date(completeData.received_date).toLocaleDateString() : 'Pendiente'
                        }
                    ],
                    partInfo: [
                        {
                            subtitle: 'Repuesto',
                            info: completeData.inventoryPart.name,
                            subInfo: `Código: ${completeData.inventoryPart.code}`
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
                await PurchaseOrdersApiService.createPurchaseOrder(formData);
                showCreateModal.value = false;
                await loadPurchaseOrders();
            } catch (error) {
                console.error('Error al crear:', error);
            }
        };

        const handleEdit = async (formData) => {
            try {
                await PurchaseOrdersApiService.updatePurchaseOrder(formData.id, formData);
                showEditModal.value = false;
                selectedOrder.value = null;
                await loadPurchaseOrders();
            } catch (error) {
                console.error('Error al actualizar:', error);
            }
        };

        const handleDelete = async (id) => {
            try {
                await PurchaseOrdersApiService.deletePurchaseOrder(id);
                showEditModal.value = false;
                selectedOrder.value = null;
                await loadPurchaseOrders();
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        };

        const closePanel = () => {
            showInfoPanel.value = false;
            setTimeout(() => {
                selectedOrder.value = null;
            }, 300);
        };

        onMounted(loadPurchaseOrders);

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
            columns,
            closePanel
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

        <div class="main-content">
            <div class="left-container">
                <RecordTable 
                    :columns="columns"
                    :data="purchaseOrders"
                    :searchable-columns="['id', 'inventory_part_name']"
                    search-placeholder="Buscar por ID o repuesto ..."
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
                    <button-component
                        variant="primary"
                        size="sm"
                        icon-left="pi pi-pencil"
                        @clicked="showEditModal = true"
                    >
                        Editar
                    </button-component>
                    <button-component
                        variant="warning"
                        size="sm"
                        icon-left="pi pi-times"
                        @clicked="closePanel"
                    >
                        Cerrar
                    </button-component>
                </div>
            </div>
        </div>

        <!-- Modal de Crear -->
        <PurchaseOrderFormModal
            v-if="showCreateModal"
            :is-edit="false"
            :order-data="selectedOrder"
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
.pending { color: var(--clr-warning); }
.in_progress { color: var(--clr-primary); }
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
    gap: 0.5rem;
}

:deep(.button-component) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}
</style>
