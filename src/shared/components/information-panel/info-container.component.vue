<template>
    <div class="info-container">
      <!-- Título tipo 1 -->
      <div v-if="titleType === 1 && title" :class="['container-title', 'type-1', titleClass]">
        {{ title }}
      </div>
  
      <!-- Título tipo 2 -->
      <div v-if="titleType === 2 && title" :class="['container-title', 'type-2', titleClass]">
        {{ title }}
      </div>
  
      <!-- Contenedor para el contenido personalizado -->
      <div class="content-container">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InfoContainer',
    props: {
      title: {
        type: String,
        default: ''
      },
      titleType: {
        type: Number,
        default: 1
      },
      titleClass: {
        type: String,
        default: ''
      }
    }
  }
  </script>
  
  <style scoped>
  .container-title {
    margin-bottom: 0.5em;
    
    &.type-1 {
      color: #6DA0E1;  
      font-size: 1.07em;
      font-weight: 700;
    }
    
    &.type-2 {
      color: black;  
      font-size: 0.9em;
    }
  }
  
  .content-container {
    border: 1.3px solid #383A37;
    border-radius: 8px;
    padding: 0.9em 0.5em;
    margin-bottom: 1em;
    background-color: transparent;
    min-height: 50px;  
  } 
  </style>
  