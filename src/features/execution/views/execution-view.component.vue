<template>
  <div class="container">
    <div class="header-main">
      <h1>{{ t('execution.title') }}</h1>
      <div class="divider"></div>
    </div>

    <main class="main-container">
      <!-- Selectores -->
      <div class="selectors-container">
        <div class="selector-group">
          <label for="plant-select">{{ t('workOrder.filters.plant') }}:</label>
          <select 
            id="plant-select" 
            v-model="selectedPlant"
            @change="handlePlantChange"
            :disabled="loadingPlants"
            class="selector-input"
          >
            <option value="">{{ t('workOrder.filters.selectPlant') }}</option>
            <option 
              v-for="plant in plants" 
              :key="plant.id" 
              :value="plant.id"
            >
              {{ plant.name }}
            </option>
          </select>
        </div>

        <div class="selector-group">
          <label for="production-line-select">{{ t('workOrder.filters.productionLine') }}:</label>
          <select 
            id="production-line-select" 
            v-model="selectedProductionLine"
            @change="handleProductionLineChange"
            :disabled="!selectedPlant || loadingProductionLines"
            class="selector-input"
          >
            <option value="">{{ t('workOrder.filters.allLines') }}</option>
            <option 
              v-for="line in productionLines" 
              :key="line.id" 
              :value="line.id"
            >
              {{ line.name }}
            </option>
          </select>
        </div>

        <div class="selector-group">
          <label for="work-order-select">{{ t('execution.filters.workOrder') }}:</label>
          <select 
            id="work-order-select" 
            v-model="selectedWorkOrder"
            @change="handleWorkOrderChange"
            :disabled="!selectedProductionLine || loadingOrders"
            class="selector-input"
          >
            <option value="">{{ t('execution.filters.allOrders') }}</option>
            <option 
              v-for="order in availableWorkOrders" 
              :key="order.id" 
              :value="order.id"
            >
              {{ order.code }} - {{ order.type }}
            </option>
          </select>
        </div>
      </div>

      <!-- Indicadores de carga -->
      <div v-if="loadingPlants" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i>
        Cargando plantas...
      </div>

      <div v-if="loadingProductionLines" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i>
        Cargando líneas de producción...
      </div>

      <div v-if="loadingOrders" class="loading-message">
        <i class="pi pi-spin pi-spinner"></i>
        {{ t('execution.loadingOrders') }}
      </div>

      <!-- Tarjetas de Órdenes de Trabajo -->
      <div v-if="workOrders.length > 0" class="orders-container">
        <h2>Órdenes de Trabajo Asignadas</h2>
        
        <div class="orders-grid">
          <div 
            v-for="order in workOrders" 
            :key="order.id" 
            class="order-card"
            :data-order-id="order.id"
          >
            <!-- Header de la orden -->
            <div class="order-header">
              <h3>{{ order.code }}</h3>
              <span class="order-status" :class="`status-${order.status?.toLowerCase()}`">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <div class="order-info">
              <div class="info-row">
                <span class="label">Tipo:</span>
                <span class="value">{{ order.type }}</span>
              </div>
              
              <div class="info-row">
                <span class="label">Fecha:</span>
                <span class="value">{{ formatDate(order.date) }}</span>
              </div>

              <div class="info-row">
                <span class="label">Maquinarias:</span>
                <span class="value">{{ order.machineries?.length || 0 }} asignadas</span>
              </div>
            </div>

            <!-- Maquinarias de la orden -->
            <div class="machineries-section" v-if="order.machineries && order.machineries.length > 0">
              <h4>{{ t('execution.machineries') }}</h4>
              <div class="machineries-list">
                <div 
                  v-for="machinery in order.machineries" 
                  :key="machinery.id"
                  class="machinery-item"
                >
                  <span class="machinery-name">{{ machinery.name }}</span>
                  <span class="machinery-status" :class="`status-${machinery.status?.toLowerCase()}`">
                    {{ machinery.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Sección de tareas -->
            <div class="tasks-section">
              <h4>Tareas:</h4>
              <div class="tasks-list">
                <div v-for="(task, i) in getTasksForOrder(order)" :key="i" class="task-item">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="task.completed"
                      @change="updateTaskCompletion(order.id, i, task.completed)"
                    />
                    <span class="custom-checkbox"></span>
                    <span>{{ task.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Sección de observaciones -->
            <div class="observations-section">
              <h4>Observaciones</h4>
              <textarea
                v-model="orderData[order.id].observations"
                class="observations-textarea"
                :placeholder="t('execution.observations.placeholder')"
                rows="4"
              ></textarea>
            </div>

            <!-- Sección de imágenes -->
            <div class="images-section">
              <h4>Imágenes</h4>
              <div class="image-upload-container">
                <div class="image-upload-area" @click="triggerFileInput(order.id)" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
                  <input 
                    :ref="`fileInput-${order.id}`"
                    type="file" 
                    accept="image/*" 
                    multiple
                    @change="handleFileSelect($event, order.id)"
                    class="file-input"
                    style="display: none;"
                  />
                  <div class="upload-content">
                    <i class="pi pi-image"></i>
                    <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
                    <span class="upload-hint">Formatos: JPG, PNG, GIF</span>
                  </div>
                </div>
                
                <!-- Imágenes subidas -->
                <div v-if="orderData[order.id].images && orderData[order.id].images.length > 0" class="uploaded-images">
                  <div 
                    v-for="(image, index) in orderData[order.id].images" 
                    :key="index"
                    class="image-item"
                  >
                    <img :src="image.url || image.preview" :alt="`Imagen ${index + 1}`" class="image-preview" />
                    <div class="image-overlay">
                      <button @click="removeImage(order.id, index)" class="remove-image-btn">
                        <i class="pi pi-times"></i>
                      </button>
                      <div v-if="image.uploading" class="upload-status">
                        <i class="pi pi-spin pi-spinner"></i>
                        <span>Subiendo...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección de productos utilizados -->
            <div class="products-section">
              <h4>Productos utilizados</h4>
              <table class="products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, i) in orderData[order.id].products" :key="i">
                    <td>
                      <select 
                        v-model="product.partId" 
                        class="product-select"
                      >
                        <option value="">Seleccionar producto ({{ inventoryParts.length }} disponibles)</option>
                        <option v-for="part in inventoryParts" :key="part.id" :value="part.id">
                          {{ part.name || part.code }} (Stock: {{ part.currentStock }})
                        </option>
                      </select>
                    </td>
                    <td>
                      <input 
                        type="number" 
                        min="0" 
                        v-model="product.quantity" 
                        class="quantity-input"
                        :max="getMaxQuantity(product.partId)"
                      />
                    </td>
                    <td>
                      <button type="button" @click="removeProduct(order.id, i)" class="remove-btn">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button 
                type="button" 
                class="add-product-btn" 
                @click="addProduct(order.id)"
              >
                Agregar producto
              </button>
            </div>

            <!-- Botones de acción -->
            <div class="order-actions">
              <div class="save-info" v-if="orderData[order.id].savedExecutedOrderId">
                <i class="pi pi-check-circle"></i>
                <span>Datos guardados disponibles</span>
              </div>
              <div class="action-buttons">
                <button class="action-btn save-btn" @click="saveProgress(order.id)">
                  Guardar
                </button>
                <button class="action-btn finish-btn" @click="finishOrder(order.id)">
                  Marcar como Finalizada
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay órdenes -->
      <div v-if="selectedProductionLine && !loadingOrders && workOrders.length === 0" class="no-orders">
        <i class="pi pi-info-circle"></i>
        <p>{{ t('execution.noOrders') }}</p>
        <p>{{ t('execution.noOrdersDescription') }}</p>
      </div>

      <!-- Mensaje inicial -->
      <div v-if="!selectedProductionLine && !loadingPlants" class="initial-message">
        <i class="pi pi-cog"></i>
        <p>Selecciona una planta, línea de producción y orden de trabajo para ver sus detalles.</p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ExecutionService from '../services/execution.service';

export default {
  name: 'ExecutionView',
  setup() {
    const { t } = useI18n();
    
    // Estado
    const workOrders = ref([]);
    const selectedPlant = ref(null);
    const selectedProductionLine = ref(null);
    const selectedWorkOrder = ref(null);
    const plants = ref([]);
    const productionLines = ref([]);
    const availableWorkOrders = ref([]);
    const loadingPlants = ref(false);
    const loadingProductionLines = ref(false);
    const loadingOrders = ref(false);
    const inventoryParts = ref([]);
    
    // Datos de cada orden (observaciones, productos, tareas completadas)
    const orderData = ref({});

    // Tareas por defecto
    const defaultTasks = ref([
      { label: t('execution.tasks.drainOil'), completed: false },
      { label: t('execution.tasks.replaceFilter'), completed: false },
      { label: t('execution.tasks.refillOil'), completed: false },
      { label: t('execution.tasks.testRun'), completed: false },
      { label: t('execution.tasks.inspection'), completed: false }
    ]);

    // Métodos
    const loadPlants = async () => {
      loadingPlants.value = true;
      try {
        const data = await ExecutionService.getPlants();
        plants.value = data;
        // Si hay plantas, seleccionar la primera por defecto
        if (data.length > 0 && !selectedPlant.value) {
          selectedPlant.value = data[0].id;
        }
      } catch (error) {
        console.error('Error loading plants:', error);
      } finally {
        loadingPlants.value = false;
      }
    };

    const loadProductionLines = async (plantId) => {
      if (!plantId) {
        productionLines.value = [];
        return;
      }
      
      loadingProductionLines.value = true;
      try {
        const data = await ExecutionService.getProductionLines(plantId);
        productionLines.value = data;
        // Resetear la selección de línea de producción
        selectedProductionLine.value = null;
      } catch (error) {
        console.error('Error loading production lines:', error);
      } finally {
        loadingProductionLines.value = false;
      }
    };

    const loadInventoryParts = async (plantId) => {
      try {
        if (!plantId) {
          inventoryParts.value = [];
          return;
        }
        const data = await ExecutionService.getInventoryParts(plantId);
        
        if (Array.isArray(data)) {
          inventoryParts.value = data;
        } else {
          console.error('Expected array but got:', typeof data);
          inventoryParts.value = [];
        }
        console.log('AAAAAAAA', data);
      } catch (error) {
        console.error('Error loading inventory parts:', error);
        inventoryParts.value = [];
      }
    };

    const loadWorkOrders = async () => {
      try {
        loadingOrders.value = true;
        const data = await ExecutionService.getWorkOrdersWithMachineries(selectedProductionLine.value);
        
        // Actualizar las órdenes disponibles para el selector
        availableWorkOrders.value = data;
        
        // Filtrar por orden seleccionada si hay una
        let filteredData = data;
        if (selectedWorkOrder.value) {
          filteredData = data.filter(order => order.id === selectedWorkOrder.value);
        }
        
        workOrders.value = filteredData;
        
        // Inicializar datos de cada orden
        filteredData.forEach(order => {
          if (!orderData.value[order.id]) {
            orderData.value[order.id] = {
              images: [],
              products: [{ partId: '', quantity: 1 }],
              tasksCompleted: [],
              observations: ''
            };
          }
        });
        
        // Cargar datos guardados si hay una línea de producción seleccionada
        if (selectedProductionLine.value) {
          await loadSavedData();
        }
      } catch (error) {
        console.error('Error loading work orders:', error);
        workOrders.value = [];
        availableWorkOrders.value = [];
      } finally {
        loadingOrders.value = false;
      }
    };

    const handlePlantChange = async () => {
      selectedProductionLine.value = null;
      selectedWorkOrder.value = null;
      await loadProductionLines(selectedPlant.value);
      await loadInventoryParts(selectedPlant.value);
      await loadWorkOrders();
    };

    const handleProductionLineChange = async () => {
      selectedWorkOrder.value = null;
      await loadWorkOrders();
    };

    const handleWorkOrderChange = async () => {
      await loadWorkOrders();
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const getStatusText = (status) => {
      switch (status?.toLowerCase()) {
        case 'pending':
          return 'Pendiente';
        case 'in-progress':
          return 'En Proceso';
        case 'completed':
          return 'Completado';
        case 'cancelled':
          return 'Cancelado';
        default:
          return status || 'Pendiente';
      }
    };

    const getTasksForOrder = (order) => {
      if (order.tasks && order.tasks.length > 0) {
        return order.tasks.map(task => ({
          label: task,
          completed: false
        }));
      }
      return defaultTasks.value;
    };

    const updateTaskCompletion = (orderId, taskIndex, completed) => {
      if (!orderData.value[orderId].tasksCompleted) {
        orderData.value[orderId].tasksCompleted = [];
      }
      
      if (completed) {
        if (!orderData.value[orderId].tasksCompleted.includes(taskIndex)) {
          orderData.value[orderId].tasksCompleted.push(taskIndex);
        }
      } else {
        orderData.value[orderId].tasksCompleted = orderData.value[orderId].tasksCompleted.filter(i => i !== taskIndex);
      }
    };

    const addProduct = (orderId) => {
      orderData.value[orderId].products.push({ partId: '', quantity: 1 });
    };

    const removeProduct = (orderId, productIndex) => {
      orderData.value[orderId].products.splice(productIndex, 1);
    };

    const getMaxQuantity = (partId) => {
      if (!partId) return 0;
      const part = inventoryParts.value.find(p => p.id === parseInt(partId));
      return part ? part.currentStock : 0;
    };

    // Métodos para manejo de imágenes
    const triggerFileInput = (orderId) => {
      const fileInput = document.querySelector(`input[ref="fileInput-${orderId}"]`);
      if (fileInput) {
        fileInput.click();
      }
    };

    const handleFileSelect = async (event, orderId) => {
      const files = Array.from(event.target.files);
      await processFiles(files, orderId);
    };

    const handleDrop = async (event) => {
      event.preventDefault();
      const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
      const orderId = event.target.closest('.order-card').dataset.orderId;
      if (orderId) {
        await processFiles(files, parseInt(orderId));
      }
    };

    const processFiles = async (files, orderId) => {
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          continue;
        }

        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            file: file,
            preview: e.target.result,
            uploading: true,
            url: null
          };

          if (!orderData.value[orderId].images) {
            orderData.value[orderId].images = [];
          }
          orderData.value[orderId].images.push(imageData);

          // Subir imagen
          uploadImage(file, orderId, orderData.value[orderId].images.length - 1);
        };
        reader.readAsDataURL(file);
      }
    };

    const uploadImage = async (file, orderId, imageIndex) => {
      try {
        const response = await ExecutionService.uploadImage(file);
        orderData.value[orderId].images[imageIndex].url = response.url || response.imageUrl;
        orderData.value[orderId].images[imageIndex].uploading = false;
      } catch (error) {
        console.error('Error uploading image:', error);
        orderData.value[orderId].images[imageIndex].uploading = false;
        // Opcional: mostrar mensaje de error al usuario
      }
    };

    const removeImage = (orderId, imageIndex) => {
      orderData.value[orderId].images.splice(imageIndex, 1);
    };

    const loadSavedData = async () => {
      try {
        // Obtener órdenes ejecutadas guardadas para esta línea de producción
        const savedOrders = await ExecutionService.getExecutedWorkOrdersByProductionLine(selectedProductionLine.value);
        
        if (savedOrders && savedOrders.length > 0) {
          // Tomar la más reciente (asumiendo que están ordenadas por fecha)
          const mostRecentOrder = savedOrders[0];
          
          // Buscar la orden de trabajo correspondiente
          const matchingWorkOrder = workOrders.value.find(order => order.code === mostRecentOrder.code);
          
          if (matchingWorkOrder) {
            // Cargar tareas completadas
            const tasksForOrder = getTasksForOrder(matchingWorkOrder);
            const completedTaskIndexes = [];
            
            tasksForOrder.forEach((task, index) => {
              if (mostRecentOrder.executedTasks.includes(task.label)) {
                completedTaskIndexes.push(index);
              }
            });
            
            // Cargar productos utilizados
            const savedProducts = mostRecentOrder.usedProducts.map(p => ({
              partId: p.productId.toString(),
              quantity: p.quantity
            }));
            
            // Cargar imágenes
            const savedImages = mostRecentOrder.files.map(url => ({
              url: url,
              preview: url, // Usar la URL como preview
              uploading: false,
              file: null
            }));
            
            // Actualizar los datos de la orden
            orderData.value[matchingWorkOrder.id] = {
              images: savedImages,
              products: savedProducts.length > 0 ? savedProducts : [{ partId: '', quantity: 1 }],
              tasksCompleted: completedTaskIndexes,
              savedExecutedOrderId: mostRecentOrder.id,
              observations: mostRecentOrder.observations || ''
            };
          }
        }
      } catch (error) {
        console.error('Error cargando datos guardados:', error);
      }
    };

    const saveProgress = async (orderId) => {
      try {
        const order = workOrders.value.find(o => o.id === orderId);
        const data = orderData.value[orderId];
        // Preparar datos para guardar
        const executedOrderData = {
          code: order.code,
          executionDate: new Date().toISOString(),
          productionLineId: selectedProductionLine.value,
          intervenedMachineIds: order.machineIds || [],
          assignedTechnicianIds: order.technicianIds || [],
          executedTasks: getTasksForOrder(order)
            .map((task, index) => data.tasksCompleted.includes(index) ? task.label : null)
            .filter(task => task !== null),
          usedProducts: data.products
            .filter(p => p.partId && p.quantity > 0)
            .map(p => ({
              productId: parseInt(p.partId),
              quantity: parseInt(p.quantity)
            })),
          files: data.images ? data.images.map(img => img.url).filter(url => url) : [],
          observations: data.observations || ''
        };
        // Guardar la orden ejecutada
        const response = await ExecutionService.saveExecutedWorkOrder(executedOrderData);
        
        // Guardar el ID de la orden ejecutada para poder cargarla después
        orderData.value[orderId].savedExecutedOrderId = response.id;
        
        alert('Progreso guardado exitosamente');
      } catch (error) {
        console.error('Error guardando progreso:', error);
        alert('Error al guardar el progreso');
      }
    };

    const finishOrder = async (orderId) => {
      try {
        const order = workOrders.value.find(o => o.id === orderId);
        const data = orderData.value[orderId];
        
        // Preparar datos para completar la orden
        const completionData = {
          tasks: getTasksForOrder(order).map((task, index) => ({
            task: task.label,
            completed: data.tasksCompleted.includes(index)
          })),
          images: data.images ? data.images.map(img => img.url).filter(url => url) : [],
          products: data.products.filter(p => p.partId && p.quantity > 0).map(p => ({
            productId: parseInt(p.partId),
            quantity: parseInt(p.quantity)
          }))
        };

        console.log('Datos a enviar para completar orden:', completionData);

        // Completar la orden
        await ExecutionService.completeWorkOrder(orderId, completionData);

        // Reducir stock de productos utilizados
        for (const product of data.products.filter(p => p.partId && p.quantity > 0)) {
          await ExecutionService.decreaseInventoryPart(product.partId, product.quantity);
        }

        alert('Orden finalizada exitosamente');
        
        // Recargar órdenes para actualizar el estado
        await loadWorkOrders();
      } catch (error) {
        console.error('Error finalizando orden:', error);
        console.error('Detalles del error:', error.response?.data);
        alert('Error al finalizar la orden');
      }
    };

    // Watcher para selectedPlant
    watch(selectedPlant, (newPlantId) => {
      if (newPlantId) {
        loadInventoryParts(newPlantId);
      }
    });

    // Lifecycle hooks
    onMounted(async () => {
      await loadPlants();
      if (selectedPlant.value) {
        await loadProductionLines(selectedPlant.value);
        await loadInventoryParts(selectedPlant.value);

      }
      await loadWorkOrders();
    });

    return {
      workOrders,
      selectedPlant,
      selectedProductionLine,
      selectedWorkOrder,
      plants,
      productionLines,
      availableWorkOrders,
      loadingPlants,
      loadingProductionLines,
      loadingOrders,
      inventoryParts,
      orderData,
      defaultTasks,
      handlePlantChange,
      handleProductionLineChange,
      handleWorkOrderChange,
      formatDate,
      getStatusText,
      getTasksForOrder,
      updateTaskCompletion,
      addProduct,
      removeProduct,
      getMaxQuantity,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      removeImage,
      loadSavedData,
      finishOrder,
      saveProgress,
      t
    };
  }
};
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-main {
  width: 100%;
  margin-bottom: 20px;
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

.main-container {
  background: var(--clr-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selectors-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--clr-border);
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 500;
    color: var(--clr-text);
    font-size: 0.9rem;
  }

  .selector-input {
    padding: 12px;
    border: 1px solid var(--clr-border);
    border-radius: 8px;
    background: var(--clr-bg);
    color: var(--clr-text);
    font-size: 0.95rem;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--clr-primary-200);
    }

    &:disabled {
      background: var(--clr-bg-secondary);
      color: var(--clr-text-secondary);
      cursor: not-allowed;
    }
  }
}

.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: var(--clr-text-secondary);
  font-size: 1.1rem;

  i {
    font-size: 1.2rem;
  }
}

.orders-container {
  h2 {
    margin-bottom: 24px;
    color: var(--clr-text);
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.order-card {
  background: var(--clr-bg-secondary);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 20px;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--clr-border);

  h3 {
    margin: 0;
    color: var(--clr-text);
    font-size: 1.2rem;
    font-weight: 600;
  }

  .order-status {
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;

    &.status-pending {
      background: var(--clr-warning-100);
      color: var(--clr-warning-500);
    }

    &.status-in-progress {
      background: var(--clr-primary-100);
      color: var(--clr-primary-500);
    }

    &.status-completed {
      background: var(--clr-success-100);
      color: var(--clr-success-500);
    }

    &.status-cancelled {
      background: var(--clr-danger-100);
      color: var(--clr-danger-500);
    }
  }
}

.order-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .label {
    font-weight: 500;
    color: var(--clr-text-secondary);
    font-size: 0.9rem;
  }

  .value {
    color: var(--clr-text);
    font-size: 0.9rem;
  }
}

.machineries-section {
  margin-bottom: 20px;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 10px 0;
    color: var(--clr-text);
  }

  .machineries-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .machinery-item {
    padding: 8px 12px;
    border: 1px solid var(--clr-border);
    border-radius: 6px;
    background: var(--clr-bg);
    color: var(--clr-text);
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    .machinery-name {
      flex: 1;
    }

    .machinery-status {
      padding: 2px 6px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;

      &.status-operational {
        background: var(--clr-success-100);
        color: var(--clr-success-500);
      }

      &.status-maintenance {
        background: var(--clr-warning-100);
        color: var(--clr-warning-500);
      }

      &.status-offline {
        background: var(--clr-danger-100);
        color: var(--clr-danger-500);
      }

      &.status-unknown {
        background: var(--clr-grey-100);
        color: var(--clr-grey-500);
      }
    }
  }
}

.tasks-section {
  margin-bottom: 20px;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 10px 0;
    color: var(--clr-text);
  }

  .tasks-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .task-item {
    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 0.6rem;
      font-size: 0.9rem;
      user-select: none;
      color: var(--clr-text);
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--clr-primary-500);
      margin-right: 0.3rem;
    }

    .custom-checkbox {
      display: inline-block;
      width: 18px;
      height: 18px;
    }
  }
}

.observations-section {
  margin-bottom: 20px;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 10px 0;
    color: var(--clr-text);
  }

  .observations-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--clr-border);
    border-radius: 8px;
    background: var(--clr-bg);
    color: var(--clr-text);
    font-size: 0.95rem;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--clr-primary-200);
    }

    &::placeholder {
      color: var(--clr-text-secondary);
    }
  }
}

.images-section {
  margin-bottom: 20px;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 10px 0;
    color: var(--clr-text);
  }

  .image-upload-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .image-upload-area {
    border: 2px dashed var(--clr-border);
    border-radius: 8px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    background: var(--clr-bg);

    &:hover {
      border-color: var(--clr-primary-200);
      background: var(--clr-primary-50);
    }

    &.drag-over {
      border-color: var(--clr-primary-500);
      background: var(--clr-primary-100);
    }
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    i {
      font-size: 2rem;
      color: var(--clr-text-secondary);
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: var(--clr-text);
      font-weight: 500;
    }

    .upload-hint {
      font-size: 0.8rem;
      color: var(--clr-text-secondary);
    }
  }

  .uploaded-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }

  .image-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 1;
    border: 1px solid var(--clr-border);

    .image-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }

    .remove-image-btn {
      background: var(--clr-danger-500);
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;

      &:hover {
        background: var(--clr-danger-600);
      }

      i {
        font-size: 0.9rem;
      }
    }

    .upload-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: white;
      font-size: 0.8rem;

      i {
        font-size: 1rem;
      }
    }
  }
}

.products-section {
  margin-bottom: 20px;

  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 10px 0;
    color: var(--clr-text);
  }

  .products-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }

  .products-table th, .products-table td {
    border: 1px solid var(--clr-border);
    padding: 8px 12px;
    text-align: left;
    font-size: 0.9rem;
  }

  .products-table th {
    background: var(--clr-primary-100);
    color: var(--clr-text);
    font-weight: 500;
  }

  .products-table input[type="text"],
  .products-table input[type="number"],
  .products-table select {
    width: 100%;
    border: 1px solid var(--clr-border);
    border-radius: 4px;
    padding: 6px 8px;
    font-size: 0.9rem;
    color: var(--clr-text);
    background: var(--clr-bg);
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--clr-primary-200);
    }
  }

  .products-table button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--clr-danger-500);
    transition: color 0.2s;
    padding: 4px;
    border-radius: 4px;

    &:hover {
      background: var(--clr-danger-100);
    }
  }

  .add-product-btn {
    background: var(--clr-primary-200);
    color: var(--clr-bg);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;

    &:hover {
      background: var(--clr-primary-100);
    }
  }
}

  .order-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
    border-top: 1px solid var(--clr-border);

    .save-info {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--clr-success-500);
      font-size: 0.8rem;
      font-weight: 500;

      i {
        font-size: 0.9rem;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }
  }

.action-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &.finish-btn {
    background-color: var(--clr-primary-200);
    color: var(--clr-bg);

    &:hover {
      background-color: var(--clr-primary-100);
    }
  }

  &.save-btn {
    background-color: var(--clr-bg-secondary);
    color: var(--clr-text);
    border: 1px solid var(--clr-border);

    &:hover {
      background-color: var(--clr-border);
    }
  }
}

.no-orders,
.initial-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: var(--clr-text-secondary);

  i {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  p {
    font-size: 1.1rem;
    margin: 0 0 8px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .selectors-container {
    grid-template-columns: 1fr;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }

  .order-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
