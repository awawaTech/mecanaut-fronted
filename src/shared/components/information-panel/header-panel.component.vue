<template>
    <div class="header-section">
      <!-- Rectángulo azul, opcional -->
      <div v-if="showRectangularBox" class="rectangular-box">
        <span>{{ rectangularBoxText || headerText }}</span>
      </div>
  
      <!-- Título rosa -->
      <h3 :class="headerTextClass">{{ headerText }}</h3>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeaderPanel',
    props: {
      headerText: {
        type: String,
        default: 'Default Header'
      },
      showRectangularBox: {
        type: Boolean,
        default: false
      },
      rectangularBoxText: {
        type: String,
        default: ''
      },
      headerTextClass: {
        type: String,
        default: ''
      }
    }
  }
  </script>
  
  <style scoped>
  .header-section {
    margin-bottom: 2em; 
  }
  
  .rectangular-box {
    background-color: #6DA0E1;  
    color: white;
    padding: 0.15em 2em; 
    border-radius: 1.25em;
    display: inline-block;  
    margin-bottom: 1.5em;  
    font-size: 0.8em; 
  }
  
  h3 {
    color: #ECA6A6;
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
  }
  
  </style>
  