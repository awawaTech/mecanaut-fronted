<script>
import { ref, onMounted } from 'vue';
import Search from '../../../shared/components/search.component.vue'
import RecordTable from '../../../shared/components/record-table.component.vue'
import InformationPanel from '../../../shared/components/information-panel/information-panel.component.vue'
import InfoSection from '../../../shared/components/information-panel/info-section.component.vue'
import InfoContainer from '../../../shared/components/information-panel/info-container.component.vue'
import { InventoryPartsApiService } from '../services/inventory-parts-api.service';
import InventoryPartFormModal from '../components/inventory-part-form-modal.component.vue';
import ButtonComponent from '../../../shared/components/button.component.vue';

export default {
    components: {
        Search,
        RecordTable,
        InformationPanel,
        InfoSection,
        InfoContainer,
        InventoryPartFormModal,
        ButtonComponent
    },
    setup() {
        const inventoryParts = ref([]);
        const selectedPart = ref(null);
        const showInfoPanel = ref(false);
        const showCreateModal = ref(false);
        const showEditModal = ref(false);
        const infoData = ref([]);
        const stockData = ref([]);
        
        // Simplificamos las columnas de la tabla
        const columns = [
            { key: 'code', label: 'Código', type: 'texto' },
            { key: 'name', label: 'Nombre', type: 'texto'},
            { key: 'current_stock', label: 'Stock Actual', type: 'numero' },
            { key: 'stock_status', label: 'Estado del Stock', type: 'texto', filterable: true},
            { key: 'info', label: 'Información', type: 'informacion' }
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
            console.log('handleInfoClick called with:', item);
            try {
                // Activamos el panel primero
                showInfoPanel.value = true;
                
                const completeData = await InventoryPartsApiService.getPartById(item.id);
                console.log('Fetched data:', completeData);
                
                selectedPart.value = completeData;
                
                // Preparar datos para las secciones de información
                infoData.value = [
                    { subtitle: 'Code', info: completeData.code },
                    { subtitle: 'Name', info: completeData.name },
                    { subtitle: 'Description', info: completeData.description }
                ];

                stockData.value = [
                    { 
                        subtitle: 'Current Stock',
                        info: completeData.currentStock,
                        class: completeData.stockStatus.toLowerCase()
                    },
                    { 
                        subtitle: 'Minimum Stock',
                        info: completeData.minStock
                    },
                    {
                        subtitle: 'Unit Price',
                        info: `$${completeData.unitPrice.toFixed(2)}`
                    },
                    {
                        subtitle: 'Status',
                        info: completeData.stockStatus,
                        class: completeData.stockStatus.toLowerCase()
                    },
                    {
                        subtitle: 'Last Restock',
                        info: new Date(completeData.lastRestock).toLocaleDateString()
                    }
                ];

                console.log('Panel should be shown:', showInfoPanel.value);
                console.log('Selected part:', selectedPart.value);
                console.log('Info data:', infoData.value);
                console.log('Stock data:', stockData.value);
            } catch (error) {
                console.error('Error loading part details:', error);
                showInfoPanel.value = false;
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
            closePanel();
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
            console.log('Closing panel');
            showInfoPanel.value = false;
            setTimeout(() => {
                selectedPart.value = null;
                infoData.value = [];
                stockData.value = [];
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
            closePanel,
            infoData,
            stockData
        };
    },
    methods: {
        // Eliminamos el método handleCtaClick ya que no se usará más
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
            <div class="left-container" :class="{ 'panel-open': showInfoPanel }">
                <RecordTable 
                    :columns="columns"
                    :data="inventoryParts"
                    :searchable-columns="['name', 'code']"
                    search-placeholder="Buscar por código o nombre..."
                    :show-new-button="true"
                    :new-label="'Repuesto'"
                    @info-click="handleInfoClick"
                    @new-click="() => showCreateModal = true"
                />
            </div>

            <!-- Panel de información -->
            <div class="right-container" :class="{ 'show-panel': showInfoPanel }">
                <div v-if="showInfoPanel && selectedPart" class="panel-wrapper">
                    <div class="panel-header">
                        <h2>Part: {{ selectedPart.code }}</h2>
                        <div class="panel-actions">
                            <ButtonComponent
                                variant="primary"
                                size="sm"
                                icon-left="pi pi-pencil"
                                @click="showEditModal = true"
                            >
                                Edit
                            </ButtonComponent>
                            <ButtonComponent
                                variant="warning"
                                size="sm"
                                icon-left="pi pi-times"
                                @click="closePanel"
                            >
                                Close
                            </ButtonComponent>
                        </div>
                    </div>

                    <div class="panel-content">
                        <InfoContainer title="General Information" :titleType="2">
                            <InfoSection
                                :infoType="2"
                                :data="infoData"
                            />
                        </InfoContainer>

                        <InfoContainer title="Stock Information" :titleType="2">
                            <InfoSection
                                :infoType="2"
                                :data="stockData"
                            />
                        </InfoContainer>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modales -->
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
    min-width: 0;
    transition: flex 0.3s ease;
}

.left-container.panel-open {
    flex: 2;
}

.right-container {
    flex: 0;
    min-width: 0;
    overflow: hidden;
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
    transform: translateX(20px);
    background: var(--surface-card);
    border-radius: 8px;
    box-shadow: var(--card-shadow);
}

.right-container.show-panel {
    flex: 1;
    min-width: 400px;
    max-width: 500px;
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
}

.panel-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--surface-card);
    border-radius: 8px;
    box-shadow: var(--card-shadow);
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--surface-border);
    background: var(--surface-section);
}

.panel-header h2 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-color);
}

.panel-actions {
    display: flex;
    gap: 0.5rem;
}

.panel-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
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

/* Asegurarse que los botones tengan el tamaño correcto */
:deep(.button-component) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
    }

    .left-container {
        flex: 1;
    }

    .left-container.panel-open {
        flex: 1;
    }

    .right-container {
        flex: 0;
        min-width: 0;
        max-width: 100%;
        transform: translateY(20px);
    }

    .right-container.show-panel {
        flex: 1;
        min-width: 100%;
        transform: translateY(0);
    }
}
</style>
