<script>
import { ref, onMounted } from 'vue';
import Search from '../../../shared/components/search.component.vue'
import RecordTable from '../../../shared/components/record-table.component.vue'
import InformationPanel from '../../../shared/components/information-panel/information-panel.component.vue'
import InfoSection from '../../../shared/components/information-panel/info-section.component.vue'
import { InventoryPartsApiService } from '../services/inventory-parts-api.service';
import InventoryPartFormModal from '../components/inventory-part-form-modal.component.vue';
import ButtonComponent from '../../../shared/components/button.component.vue';

export default {
    components: {
        Search,
        RecordTable,
        InformationPanel,
        InfoSection,
        InventoryPartFormModal,
        ButtonComponent
    },
    setup() {
        const inventoryParts = ref([]);
        const selectedPart = ref(null);
        const showInfoPanel = ref(false);
        const showCreateModal = ref(false);
        const showEditModal = ref(false);
        
        // Simplificamos las columnas de la tabla
        const columns = [
            { key: 'code', label: 'Código', type: 'texto' },
            { key: 'name', label: 'Nombre', type: 'texto'},
            { key: 'current_stock', label: 'Stock Actual', type: 'numero' },
            { key: 'stock_status', label: 'Estado del Stock', type: 'texto', filterable: true},
            { key: 'info', label: 'Información', type: 'informacion' },
            { key: 'action', label: 'Acción', type: 'cta', ctaLabel: 'Solicitar', ctaVariant: 'primary' }
        ];

        const loadInventoryParts = async () => {
            try {
                const data = await InventoryPartsApiService.getParts();
                inventoryParts.value = data.map(part => ({
                    id: part.id,
                    code: part.code,
                    name: part.name,
                    current_stock: part.currentStock,
                    min_stock: part.minStock,
                    unit_price: part.unitPrice,
                    stock_status: part.stockStatus,
                    last_restock: part.lastRestock,
                }));
            } catch (error) {
                console.error('Error loading inventory parts:', error);
            }
        };

        const handleInfoClick = async (item) => {
            try {
                const completeData = await InventoryPartsApiService.getPartById(item.id);
                selectedPart.value = {
                    ...completeData,
                    generalInfo: [
                        { subtitle: 'Código', info: completeData.code },
                        { subtitle: 'Nombre', info: completeData.name },
                        { subtitle: 'Descripción', info: completeData.description }
                    ],
                    stockInfo: [
                        { 
                            subtitle: 'Estado de Stock',
                            info: completeData.stockStatus,
                            class: completeData.stockStatus.toLowerCase()
                        },
                        { 
                            subtitle: 'Stock Actual / Mínimo',
                            info: `${completeData.currentStock} / ${completeData.minStock} unidades`
                        },
                        {
                            subtitle: 'Precio Unitario',
                            info: `$${completeData.unitPrice.toFixed(2)}`
                        },
                        {
                            subtitle: 'Último Restock',
                            info: new Date(completeData.lastRestock).toLocaleDateString()
                        }
                    ],
                    purchaseInfo: completeData.purchaseOrders.map(order => ({
                        subtitle: `Orden #${order.id}`,
                        info: `${order.quantity} unidades - ${order.status}`,
                        subInfo: `Fecha de orden: ${new Date(order.orderDate).toLocaleDateString()}`,
                        class: order.status.toLowerCase()
                    }))
                };
                showInfoPanel.value = true;
            } catch (error) {
                console.error('Error loading part details:', error);
            }
        };

        const handleCreate = async (formData) => {
            try {

                await InventoryPartsApiService.createPart(formData);

                showCreateModal.value = false;
                // Recargar datos
                await loadInventoryParts();
            } catch (error) {
                console.error('Error al crear:', error);
            }
        };

        const handleEdit = async (formData) => {
            try {
                await InventoryPartsApiService.updatePart(formData.id, formData);
                showEditModal.value = false;
                selectedPart.value = null;
                // Recargar datos
                await loadInventoryParts();
            } catch (error) {
                console.error('Error al actualizar:', error);
            }
        };

        const handleDelete = async (id) => {
            try {
                await InventoryPartsApiService.deletePart(id);
                showEditModal.value = false;
                selectedPart.value = null;
                // Recargar datos
                await loadInventoryParts();
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        };

        const closePanel = () => {
            showInfoPanel.value = false;
            // Opcional: limpiar la selección después de un pequeño delay para la animación
            setTimeout(() => {
                selectedPart.value = null;
            }, 300);
        };

        onMounted(loadInventoryParts);

        return {
            inventoryParts,
            selectedPart,
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
    },
    methods: {
        handleCtaClick({ row }) {
            console.log("holii");
            if (row.current_stock < row.min_stock) {
                // Abrimos el modal con los datos pre-cargados del repuesto
                this.selectedPart = row;
                this.showCreateModal = true;
            }
        }
    }
}
</script>   

<template>
    <div class="container">
        <div class="header-main">
            <h1>Inventario de Repuestos</h1>
            <div class="divider"></div>
        </div>

        <div class="main-content">
            <div class="left-container">
                <RecordTable 
                    :columns="columns"
                    :data="inventoryParts"
                    :searchable-columns="['name', 'code']"
                    search-placeholder="Buscar por código o nombre..."
                    :show-new-button="true"
                    :new-label="'Repuesto'"
                    @action-click="handleCtaClick"
                    @info-click="handleInfoClick"
                    @new-click="() => showCreateModal = true"
                />
            </div>
            <div class="right-container" :class="{ 'show-panel': showInfoPanel }">
                <InformationPanel 
                    v-if="showInfoPanel"
                    :headerText="'Información Detallada del Repuesto'"
                    class="info-panel"
                >
                    <template #header>
                        <div class="panel-header">
                            <h2>Información Detallada del Repuesto</h2>
                            
                        </div>
                    </template>

                    <!-- Información General -->
                    <InfoSection 
                        v-if="selectedPart"
                        :infoType="1"
                        title="Información General"
                        :data="selectedPart.generalInfo"
                    />
                    
                    <!-- Información de Stock -->
                    <InfoSection 
                        v-if="selectedPart"
                        :infoType="2"
                        title="Información de Stock"
                        :data="selectedPart.stockInfo"
                    />

                    <!-- Información de Órdenes de Compra -->
                    <InfoSection 
                        v-if="selectedPart && selectedPart.purchaseInfo?.length"
                        :infoType="3"
                        title="Órdenes de Compra"
                        :data="selectedPart.purchaseInfo"
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
        <InventoryPartFormModal
            v-if="showCreateModal"
            :is-edit="false"
            :part-data="selectedPart"
            @submit="handleCreate"
            @cancel="() => {
                showCreateModal = false;
                selectedPart = null;
            }"
        />

        <!-- Modal de Editar -->
        <InventoryPartFormModal
            v-if="showEditModal"
            :is-edit="true"
            :part-data="selectedPart"
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

.search-section {
    width: 100%;
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

/* Estados de stock */
.low { color: var(--clr-danger); }
.medium { color: var(--clr-warning); }
.ok { color: var(--clr-success); }
.out_of_stock { color: var(--clr-danger); font-weight: bold; }

/* Estados de órdenes */
.pending { color: var(--clr-warning); }
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

/* Asegurarse que los botones tengan el tamaño correcto */
:deep(.button-component) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}
</style>
