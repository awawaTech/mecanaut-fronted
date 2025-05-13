<template>
    <!-- Lista de mantenimiento -->
    <div v-if="type === 'maintenance'" class="maintenance-list">
      <div v-for="(item, index) in items" :key="index" class="maintenance-item" :class="{'preventive': item.type === 'Preventivo', 'corrective': item.type === 'Correctivo'}">
        <div :class="item.type === 'Preventivo' ? 'date-type-preventive' : 'date-type-corrective'">
          {{ item.date }} – {{ item.type }}
        </div>
        <div class="responsible">
          Responsable: {{ item.responsible }}
        </div>
      </div>
    </div>
  
    <!-- Lista de maquinarias -->
    <div v-if="type === 'simpleList'" class="simpleList-list">
      <div v-for="(item, index) in items" :key="index" class="simpleList-item">
        {{ item.model }}
      </div>
    </div>
  
    <!-- Lista de movimientos -->
    <div v-if="type === 'movements'" class="movements-list">
      <div v-for="(item, index) in items" :key="index" class="movement-item">
        <div class="date-action">
          {{ item.date }} – {{ item.action }}
        </div>
        <div class="order">
          {{ item.order }}
        </div>
      </div>
    </div>
  
    <!-- Lista por defecto para otros casos -->
    <div v-if="type === 'default'" class="default-list">
      <div v-for="(item, index) in items" :key="index" class="default-item">
        {{ item.text }}
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InfoListItems',
    props: {
      items: {
        type: Array,
        default: () => []
      },
      type: {
        type: String,
        default: 'default' // 'maintenance', 'simpleList', 'movements'
      }
    }
  }
  </script>
  
  <style scoped>

  .maintenance-item, .simpleList-item, .movement-item {
    padding: 0.8em 0.9em;
    border-radius: 1em;
    margin-bottom: 0.5em;
    background-color: #F3EBFF;
  }
  
  .default-item{
    padding: 0.8em 0.9em;
    border-radius: 1em;
    margin-bottom: 0.5em;
    background-color: transparent;
  }
  

  .maintenance-item {
    &.preventive {
      background-color: #F3EBFF;
    }
    
    &.corrective {
      background-color: #FFE8E8;
    }
    
  
    .date-type-preventive {
      color: #6DA0E1;
      font-weight: 450;
    }
    
    .date-type-corrective {
      color: #D7465E;
      font-weight: 450;
    }
    
    
    .responsible {
      color: #383A37;
      font-size: 0.9em;
    }
  }
  

  .simpleList-item {
    color: #6DA0E1;
    font-weight: 500;
  }

  .movement-item {
    .date-action {
      color: #6DA0E1;
      font-weight: 500;
    }
    
    .order {
      display: flex;
      justify-content: center;
      color: #383A37;
      font-size: 0.9em;
    }
  } 
  </style>
  