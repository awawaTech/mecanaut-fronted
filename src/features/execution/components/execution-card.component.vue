<template>
    <div class="execution-card">
      <!-- Nombre de la maquinaria -->
      <div class="machinery-name"><slot name="title"></slot></div>
  
      <!-- Sección de tareas -->
      <div class="tasks-section">
        <span class="section-title">{{ t('execution.tasks.title') }}:</span>
        <div class="tasks-list">
          <div v-for="(task, i) in tasks" :key="i" class="task-item">
            <label class="checkbox-label">
              <input type="checkbox" v-model="task.completed" />
              <span class="custom-checkbox"></span>
              <span>{{ task.label }}</span>
            </label>
          </div>
        </div>
      </div>
  
      <!-- Sección de observaciones -->
      <div class="observations-section">
        <span class="section-title">{{ t('execution.observations.title') }}</span>
        <textarea 
          rows="3" 
          v-model="localObservations" 
          :placeholder="t('execution.observations.placeholder')"
        ></textarea>
      </div>
  
      <!-- Sección de productos utilizados -->
      <div class="products-section">
        <span class="section-title">{{ t('execution.products.title') }}</span>
        <table class="products-table">
          <thead>
            <tr>
              <th>{{ t('execution.products.product') }}</th>
              <th>{{ t('execution.products.quantity') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, i) in localProducts" :key="i">
              <td>
                <input 
                  v-model="product.name" 
                  :placeholder="t('execution.products.productPlaceholder')" 
                />
              </td>
              <td>
                <input type="number" min="0" v-model="product.quantity" style="width: 60px;" />
              </td>
              <td>
                <button type="button" @click="localProducts.splice(i, 1)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button 
          type="button" 
          class="add-product-btn" 
          @click="localProducts.push({ name: '', quantity: 1 })"
        >
          {{ t('execution.products.addProduct') }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { useI18n } from 'vue-i18n';
  
  export default {
    name: 'ExecutionCard',
    props: {
      tasks: {
        type: Array,
        required: true
      }
    },
    setup() {
      const { t } = useI18n();
      return { t };
    },
    data() {
      return {
        localObservations: '',
        localProducts: []
      }
    }
  };
  </script>
  
  <style scoped>
  .execution-card {
    background: var(--clr-bg);
    border: 1px solid var(--clr-border);
    border-radius: var(--radius-md);
    padding: 1.5rem;
    min-width: 320px;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    height: 100%;
    overflow-x: auto;
  }
  .machinery-name {
    font-weight: bold;
    font-size: 1.1rem;
    background: var(--clr-primary-100);
    border-radius: var(--radius-sm);
    padding: 0.5rem 0.8rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  .section-title {
    font-weight: 600;
    margin-bottom: 0.3rem;
    display: block;
  }
  .tasks-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    
  }
  .observations-section textarea {
    width: 100%;
    border-radius: var(--radius-sm);
    border: 1px solid var(--clr-border);
    padding: 0.5rem;
    resize: vertical;
    background: var(--clr-bg);
  }
  .products-table {
    width: 100%;
    border-collapse: collapse;
  }
  .products-table th, .products-table td {
    border: 1px solid var(--clr-border);
    padding: 0.3rem 0.6rem;
    text-align: left;
  }
  .products-table th {
    background: var(--clr-primary-100);
  }
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 0.6rem;
    font-size: 1rem;
    user-select: none;
    
  }
  .checkbox-label input[type="checkbox"] {
    width: 22px;
    height: 22px;
    accent-color: var(--clr-primary-500);
    margin-right: 0.3rem;
    
  }
  .custom-checkbox {
    display: inline-block;
    width: 22px;
    height: 22px;
  }
  .products-table input[type="text"],
  .products-table input[type="number"] {
    width: 100%;
    border: 1px solid var(--clr-border);
    border-radius: var(--radius-sm);
    padding: 0.2rem 0.4rem;
    font-size: 1rem;
    color: var(--clr-text);
    background: var(--clr-bg);
    
  }
  .products-table button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: var(--color-danger);
    transition: color 0.2s;
  }
  .products-table button:hover {
    color: var(--color-danger);
  }
  .add-product-btn {
    margin-top: 0.7rem;
    background: var(--clr-primary-200);
    color: #fff;
    border: none;
    border-radius: var(--radius-lg);
    padding: 0.4rem 1.2rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }
  .add-product-btn:hover {
    background: var(--clr-primary-300);
  }
  </style>
  