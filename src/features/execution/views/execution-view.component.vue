<template>
  <div class="container">
    <h2 class="section-title">{{ t('execution.title') }}</h2>
    
    <!-- Selector de Orden de Trabajo -->
    <div class="order-selector">
      <label for="orderSelect">{{ t('execution.workOrder') }}</label>
      <select id="orderSelect" v-model="selectedOrder" @change="onWorkOrderChange">
        <option v-for="order in workOrders" :key="order.id" :value="order.id">
          {{ order.name }}
        </option>
      </select>
    </div>

    <!-- Tarjetas de Ejecución -->
    <div class="cards-scroll">
      <div class="cards-row">
        <execution-card
          v-for="machinery in machineries"
          :key="machinery.id"
          :machineryName="machinery.machineryName"
          :tasks="machinery.tasks">
          <template #title>{{ machinery.machineryName }}</template>
        </execution-card>
      </div>
    </div>

    <!-- Botones de acción -->
    <div class="actions-row">
      <button class="finish-btn">{{ t('execution.actions.finish') }}</button>
      <button class="save-btn">{{ t('execution.actions.save') }}</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ExecutionService from '../services/execution.service';
import ExecutionCard from '../components/execution-card.component.vue';

export default {
  name: 'ExecutionView',
  components: {
    ExecutionCard
  },
  setup() {
    const { t } = useI18n();
    const executionService = new ExecutionService();
    const workOrders = ref([]);
    const machineries = ref([]);
    const selectedOrder = ref('');

    onMounted(async () => {
      try {
        workOrders.value = await executionService.getWorkOrders();
      } catch (error) {
        console.error('Error al cargar las órdenes de trabajo:', error);
      }
    });

    const onWorkOrderChange = async () => {
      if (!selectedOrder.value) {
        machineries.value = [];
        return;
      }

      try {
        machineries.value = await executionService.getMachineriesByWorkOrder(selectedOrder.value);
      } catch (error) {
        console.error('Error al cargar las maquinarias:', error);
        machineries.value = [];
      }
    };

    return {
      workOrders,
      machineries,
      selectedOrder,
      onWorkOrderChange,
      t
    };
  }
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--clr-primary-500); /* Usando variable de color */
  margin-bottom: 20px;
}

.order-selector {
  margin: 20px 0;
}

.order-selector select {
  margin-left: 10px;
  padding: 5px;
  min-width: 200px;
  background: var(--clr-bg);
  color: var(--clr-text);
}

.cards-scroll {
  overflow-x: auto;
  margin: 20px 0;
}

.cards-row {
  display: flex;
  gap: 20px;
  padding: 10px 0;
}

.actions-row {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.finish-btn, .save-btn {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.finish-btn {
  background-color: var(--clr-primary-200);
  color: white;
}

.save-btn {
  background-color: var(--clr-primary-400);
  color: white;
}
</style>
