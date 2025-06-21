<script>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import RecordTableComponent from '@/shared/components/record-table.component.vue';
import InformationPanel from '@/shared/components/information-panel/information-panel.component.vue';
import InfoContainer from '@/shared/components/information-panel/info-container.component.vue';
import InfoSection from '@/shared/components/information-panel/info-section.component.vue';
import ButtonComponent from '@/shared/components/button.component.vue';
import WorkOrderFormModal from '../components/work-order-form-modal.component.vue';
import { WorkOrderService } from '../services/work-order.service';

export default {
  components: {
    RecordTableComponent,
    InformationPanel,
    InfoContainer,
    InfoSection,
    ButtonComponent,
    WorkOrderFormModal
  },
  setup() {
    // Estado
    const workOrders = ref([]);
    const selectedOrder = ref(null);
    const showInfoPanel = ref(false);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);

    // Datos para el panel de información
    const infoData = ref([]);
    const technicianData = ref([]);

    const { t } = useI18n();

    const columns = [
      { key: 'code', label: t('workOrder.table.code'), type: 'texto', searchable: true },
      { key: 'date', label: t('workOrder.table.date'), type: 'texto' },
      { key: 'type', label: t('workOrder.table.type'), type: 'texto', filterable: true },
      { key: 'assign', label: '', type: 'cta', ctaLabel: t('workOrder.table.assign'), ctaVariant: 'primary' },
      { key: 'details', label: '', type: 'cta', ctaLabel: t('workOrder.table.details'), ctaVariant: 'outline' }
    ];

    // Métodos
    const loadWorkOrders = async () => {
      try {
        const data = await WorkOrderService.getOrders();
        workOrders.value = data;
      } catch (error) {
        console.error('Error loading work orders:', error);
      }
    };

    const updateInfoPanel = (order) => {
      infoData.value = [
        { subtitle: t('workOrder.infoPanel.sections.generalInfo.code'), info: order.code },
        { subtitle: t('workOrder.infoPanel.sections.generalInfo.date'), info: order.date },
        { subtitle: t('workOrder.infoPanel.sections.generalInfo.type'), info: order.type },
        { subtitle: t('workOrder.infoPanel.sections.generalInfo.productionLine'), info: order.productionLine }
      ];

      if (order.technicians.length > 0) {
        technicianData.value = order.technicians.map(tech => ({
          subtitle: tech.name,
          info: tech.machines.join(', ')
        }));
      } else {
        technicianData.value = [{
          subtitle: t('workOrder.infoPanel.sections.technicians.noTechnicians'),
          info: ''
        }];
      }
    };

    const handleCreate = async (formData) => {
      try {
        await WorkOrderService.createOrder(formData);
        showCreateModal.value = false;
        await loadWorkOrders();
      } catch (error) {
        console.error('Error al crear:', error);
      }
    };

    const handleEdit = async (formData) => {
      try {
        if (formData.id) {
          await WorkOrderService.updateOrder(formData.id, formData);
          showEditModal.value = false;
          selectedOrder.value = null;
          await loadWorkOrders();
        }
      } catch (error) {
        console.error('Error al actualizar:', error);
      }
      closePanel();
    };

    const handleDelete = async (id) => {
      try {
        if (confirm(t('workOrder.form.confirmDelete'))) {
          await WorkOrderService.deleteOrder(id);
          showEditModal.value = false;
          selectedOrder.value = null;
          await loadWorkOrders();
        }
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
      closePanel();
    };

    const closePanel = () => {
      showInfoPanel.value = false;
      setTimeout(() => {
        selectedOrder.value = null;
      }, 300);
    };

    const handleCtaClick = async (event) => {
      const item = event.row;
      const columnKey = event.column.key;

      if (columnKey === 'assign') {
        selectedOrder.value = item;
        showEditModal.value = true;
      } else if (columnKey === 'details') {
        selectedOrder.value = item;
        updateInfoPanel(item);
        showInfoPanel.value = true;
      }
    };

    const handleNewClick = () => {
      showCreateModal.value = true;
    };

    // Lifecycle hooks
    onMounted(() => {
      loadWorkOrders();
    });

    return {
      workOrders,
      selectedOrder,
      showInfoPanel,
      showCreateModal,
      showEditModal,
      columns,
      infoData,
      technicianData,
      handleCreate,
      handleEdit,
      handleDelete,
      handleCtaClick,
      handleNewClick,
      closePanel
    };
  }
};
</script>

<template>
  <div class="container">
    <div class="header-main">
      <h1>{{ $t('workOrder.title') }}</h1>
      <div class="divider"></div>
    </div>
    
    <div class="main-content">
      <div class="left-container">
        <RecordTableComponent
          :columns="columns"
          :data="workOrders"
          :searchable-columns="['code']"
          :search-placeholder="$t('workOrder.search.placeholder')"
          :show-new-button="true"
          :new-label="$t('workOrder.search.newOrder')"
          @cta-click="handleCtaClick"
          @new-click="handleNewClick"
        />
      </div>
      
      <div class="right-container" :class="{ 'show-panel': showInfoPanel }">
        <InformationPanel
          v-if="showInfoPanel && selectedOrder"
          :header-text="$t('workOrder.infoPanel.orderPrefix') + selectedOrder.code"
          :show-header="true"
          :show-primary-button="true"
          :primary-button-text="$t('workOrder.infoPanel.edit')"
          @primary-button-click="showEditModal = true"
        >
          <InfoContainer :title="$t('workOrder.infoPanel.sections.generalInfo.title')" :title-type="2">
            <InfoSection
              :info-type="2"
              :data="infoData"
            />
          </InfoContainer>

          <InfoContainer :title="$t('workOrder.infoPanel.sections.technicians.title')" :title-type="2">
            <InfoSection
              :info-type="2"
              :data="technicianData"
            />
          </InfoContainer>

          <div class="panel-actions">
            <ButtonComponent
              variant="warning"
              size="sm"
              icon-left="pi pi-times"
              @clicked="closePanel"
            >
              {{ $t('workOrder.infoPanel.close') }}
            </ButtonComponent>
            <ButtonComponent
              variant="outline"
              size="sm"
              icon-left="pi pi-times"
              @clicked="showEditModal = true"
            >
              {{ $t('workOrder.infoPanel.edit') }}
            </ButtonComponent>
          </div>
        </InformationPanel>
      </div>
    </div>

    <!-- Modales -->
    <WorkOrderFormModal
      v-if="showCreateModal"
      :is-edit="false"
      :order-data="null"
      @submit="handleCreate"
      @cancel="showCreateModal = false"
    />

    <WorkOrderFormModal
      v-if="showEditModal"
      :is-edit="true"
      :order-data="selectedOrder"
      @submit="handleEdit"
      @delete="handleDelete"
      @cancel="showEditModal = false"
    />
  </div>
</template>

<style scoped lang="scss">
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
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  h1 {
    color: var(--clr-text);
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .divider {
    margin-top: 1rem;
    height: 2px;
    background: var(--clr-primary-300);
    width: 100%;
    border-radius: 2px;
  }
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
  
  &.show-panel {
    flex: 1;
    width: auto;
  }
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
