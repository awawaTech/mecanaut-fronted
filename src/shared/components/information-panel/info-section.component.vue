<template>
    <div class="info-section">
      <!-- Subtítulo opcional -->
      <div v-if="showSubtitle && subtitleText" :class="subtitleClass" class="info-list-subtitle">
        {{ subtitleText }}
      </div>
  
      <!-- Tipo 1: atributo: valor en la misma línea -->
      <div v-if="infoType === 1" class="info-list-type1">
        <ul>
          <li v-for="(item, index) in data" :key="index">
            {{ item.subtitle }}: {{ item.info }}
          </li>
        </ul>
      </div>
  
      <!-- Tipo 2: atributo en una línea, valor en otra -->
      <div v-if="infoType === 2" class="info-list-type2">
        <div class="list-items">
          <div v-for="(item, index) in data" :key="index">
            <div class="subtitle">{{ item.subtitle }}:</div>
            <div class="info">{{ item.info }}</div>
          </div>
        </div>
      </div>
  
      <!-- Tipo 3: estadísticas -->
      <div v-if="infoType === 3" class="info-stadistics">
        <div v-for="(item, index) in statisticsData" :key="index" class="list-stadistics">
          <div class="stadistics-items">
            <p class="stadistics">{{ item.stadistic }}</p>
            <p class="percentage">{{ item.percentage }}</p>
            <p class="description">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InfoSection',
    props: {
      infoType: {
        type: Number,
        default: 1
      },
      data: {
        type: Array,
        default: () => []
      },
      showSubtitle: {
        type: Boolean,
        default: false
      },
      subtitleText: {
        type: String,
        default: ''
      },
      subtitleClass: {
        type: String,
        default: ''
      },
      statisticsData: {
        type: Array,
        default: () => []
      }
    }
  }
  </script>
  
  <style scoped>
  
  .info-list {
    list-style: none;
    margin: 0;
  }
  
  .info-columns {
    display: flex;
    flex-wrap: wrap;
    gap: 1.4em;
  
    .column {
      flex: 1 1 30%; 
    }
  }
  
  .info-list-type1 {
    color: black;
    font-size: 0.95em;
    font-weight: 410;
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    li {
      line-height: 1.2; 
    }
  }
  
  .info-list-type2 {
    font-weight: 410;
    color: #000000;
    font-size: 0.95em;
    .list-items {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }
    
    .list-item {
      margin-bottom: 0.5em;
    }
  }
  
  .info-list-subtitle {
    font-size: 1.1em;
    margin-bottom: 0.5em;
    color: #6DA0E1;
    font-weight: 700;
  }
  
  /* Estilo para las estadísticas (Tipo 3) */
  .info-stadistics {
  }
  
  .stadistics-items{
    display: flex;
    gap: 0; 
    flex-direction: column;
  }
  
  .list-stadistics {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5em;

    .stadistics {
      font-size: 1.8em;
      font-weight: 730;
      color: #6DA0E1;
    }
    .percentage {
      font-size: 1.1em;
      font-weight: 630;
      color: #6DA0E1;
    }
    .description {
      font-size: 1em;
      color: #6DA0E1;
    }
  } 
  </style>
  