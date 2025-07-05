<script>
import {ref, onMounted, computed} from 'vue';
import { useI18n } from 'vue-i18n';
import Search from '../../../shared/components/search.component.vue';
import RecordTable from '@/shared/components/record-table.component.vue';
import InformationPanel from '@/shared/components/information-panel/information-panel.component.vue';
import InfoSection from '@/shared/components/information-panel/info-section.component.vue';
import { PlantApiService } from '../services/plant-api.service';
import ButtonComponent from "@/shared/components/button.component.vue";
import PlantFormModal from '../components/interact-plant.component.vue';
import AuthService from "../../authentication/services/auth.service.js";

export default {
  name: 'PlantView',
  components: {
    Search,
    RecordTable,
    InformationPanel,
    InfoSection,
    PlantFormModal,
    ButtonComponent
  },
  setup() {
    const { t } = useI18n();

    const plantList = ref([]);
    const selectedPlant = ref(null);
    const showInfoPanel = ref(false);
    const showCreateModal = ref(false);
    const showEditModal = ref(false);

    // Configuración de la tabla
    const columns = [

      { key: 'name', label: 'Name', type: 'texto' },
      { key: 'country', label: t('Country'), type: 'texto' },
      { key: 'active', label: 'Active', type: 'texto', filterable: true },
      { key: 'info', label: 'Info', type: 'informacion' }
    ];


    const loadPlant = async () => {
      try {
        const data = await PlantApiService.getPlants();
        plantList.value = data.map(p => ({
          id: p.id,
          name: p.name,
          address: p.address,
          city: p.city,
          country: p.country,
          phone: p.phone,
          email: p.email,
          active: p.active
        }));
      } catch (error) {
        console.error('Error loading plant:', error);
      }
    };



    const handleInfoClick = async (item) => {
      try {
        const plant = await PlantApiService.getPlantById(item.id);
        selectedPlant.value = {
          ...plant,
          generalInfo: [
            {subtitle: 'Name', info: plant.name},
            {subtitle: 'Address', info: plant.address},
            {subtitle: 'City', info: plant.city},
            {subtitle: 'Country', info: plant.country},
            {subtitle: 'Phone', info: plant.phone },
            {subtitle: 'Email', info: plant.email },
            {subtitle: 'Active', info: plant.active },
          ]
        };
        showInfoPanel.value = true;
      } catch (error) {
        console.error('Error loading plant detail:', error);
      }
    };

    const handleCreate = async (formData) => {
      try {
        await PlantApiService.createPlant(formData);
        showCreateModal.value = false;
        await loadPlant();
      } catch (error) {
        console.error('Error creating plant:', error);
      }
    };

    const openCreateModal = () => {
      console.log(showCreateModal.value)
      selectedPlant.value = {
        name: '',
        address: '',
        city: '',
        country: '',
        phone: '',
        email: '',
        active: true
      };
      showCreateModal.value = true;
    };
    const handleEdit = async (formData) => {
      try {
        await PlantApiService.updatePlant(formData.id, formData);
        showEditModal.value = false;
        selectedPlant.value = null;
        await loadPlant();
      } catch (error) {
        console.error('Error updating plant:', error);
      }
    };

    const handleDelete = async (id) => {
      try {
        await PlantApiService.deletePlant(id);
        showEditModal.value = false;
        selectedPlant.value = null;
        await loadPlant();
      } catch (error) {
        console.error('Error deleting plant:', error);
      }
    };

    const closePanel = () => {
      showInfoPanel.value = false;
      setTimeout(() => {
        selectedPlant.value = null;
      }, 300);
    };
    const togglePlantStatus = async () => {
      if (!selectedPlant.value) return;

      const newStatus = !selectedPlant.value.active;

      try {
        await PlantApiService.updatePlant(selectedPlant.value.id, {
          ...selectedPlant.value,
          active: newStatus
        });

        await loadPlant(); // Recarga la lista

        // Si el panel está abierto, vuelve a cargar los detalles
        if (selectedPlant.value.id) {
          await handleInfoClick({ id: selectedPlant.value.id });
        }
      } catch (err) {
        console.error('Error al actualizar el estado:', err);
        error.value = 'Error al actualizar el estado';
      }
    };

    onMounted(async () => {
      try {
        // Verifica si el usuario ya está autenticado
        if (AuthService.isAuthenticated()) {
          const token = AuthService.getToken();
          AuthService.setAuthToken(token); // opcional si ya lo hizo en constructor
          await loadPlant();
        } else {
          console.warn("🔐 Usuario no autenticado. Redirigiendo a login...");
          // Redirige o muestra mensaje
          window.location.href = '/authentication/sign-in'; // o usa tu router
        }
      } catch (error) {
        console.error("❌ Error al cargar datos con usuario autenticado:", error.message);
      }
    });

    return {
      plantList,
      selectedPlant,
      showInfoPanel,
      showCreateModal,
      showEditModal,
      handleInfoClick,
      handleCreate,
      handleEdit,
      handleDelete,
      columns,
      closePanel,
      togglePlantStatus,
      openCreateModal,
    };
  },
  methods: {
    handleCtaClick({row}) {
      this.selectedPlant = row;
      this.showEditModal = true;
    }
  }
};
</script>


<template>
  <div class="container">
    <div class="header-main">
      <h1>Plant Management</h1>
      <div class="divider"></div>
    </div>

    <div class="main-content">
      <div class="left-container">
        <RecordTable
            :columns="columns"
            :data="plantList"
            :searchable-columns="['name']"
            search-placeholder="Search by name..."
            :show-new-button="true"
            :new-label="'Plant'"
            @action-click="handleCtaClick"
            @info-click="handleInfoClick"
            @new-click="openCreateModal"
        />
      </div>
      <div class="right-container" :class="{ 'show-panel': showInfoPanel }">
        <InformationPanel
            v-if="showInfoPanel"
            :headerText="'Detailed Information'"
            class="info-panel"

        >
          <template #header>
            <div class="panel-header">
              <h2>Plant Details</h2>
            </div>
          </template>

          <InfoSection
              v-if="selectedPlant"
              :infoType="1"
              title="General Info"
              :data="selectedPlant.generalInfo"
          />
        </InformationPanel>
        <div class="panel-actions">
          <button-component
              variant="primary"
              size="sm"
              icon-left="pi pi-pencil"
              @clicked="showEditModal = true"
          >
            Edit
          </button-component>
          <button-component
              variant="warning"
              size="sm"
              icon-left="pi pi-times"
              @clicked="closePanel"
          >
            Close
          </button-component>
          <button-component
              :variant="selectedPlant?.active ? 'danger' : 'outline'"
              size="sm"
              :icon-left="selectedPlant?.active ? 'pi pi-times' : 'pi pi-check'"
              @clicked="togglePlantStatus"
          >
            {{ selectedPlant?.active ? 'Deactivate' : 'Activate' }}
          </button-component>
        </div>
      </div>
    </div>

    <PlantFormModal
        v-if="showCreateModal"
        :show-modal="showCreateModal"
        :is-edit="false"
        :plant-to-edit="selectedPlant"
        :title="'Create Plant'"
        @save="handleCreate"
        @cancel="() => { showCreateModal = false; selectedPlant = null; }"
    />

    <PlantFormModal
        v-if="showEditModal"
        :show-modal="showEditModal"
        :is-edit="true"
        :plant-to-edit="selectedPlant"
        :title="'Edit Plant'"
        @save="handleEdit"
        @delete="handleDelete"
        @cancel="() => { showEditModal = false; selectedPlant = null; }"
    />
  </div>
</template>

<style scoped>
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
</style>