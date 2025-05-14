<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Seleccione el Tipo de Plan</h2>
      
      <div class="plan-options">
        <div class="plan-option" @click="selectPlan('dynamic')">
          <div class="plan-icon">
            <i class="pi pi-sliders-h"></i>
          </div>
          <h3>Plan Dinámico</h3>
          <p>Basado en parámetros y condiciones específicas</p>
        </div>
        
        <div class="plan-option" @click="selectPlan('static')">
          <div class="plan-icon">
            <i class="pi pi-calendar"></i>
          </div>
          <h3>Plan Estático</h3>
          <p>Programado a fechas y períodos fijos</p>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn-cancel" @click="close">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['close', 'select']);

const close = () => {
  emit('close');
};

const selectPlan = (planType) => {
  emit('select', planType);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 550px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: var(--clr-primary-500);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.plan-options {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.plan-option {
  flex: 1;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #eee;
}

.plan-option:hover {
  background-color: var(--clr-primary-100);
  border-color: var(--clr-primary-300);
}

.plan-icon {
  font-size: 2rem;
  color: var(--clr-primary-400);
  margin-bottom: 1rem;
}

.plan-option h3 {
  margin: 0.5rem 0;
  color: var(--clr-primary-500);
}

.plan-option p {
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: center;
}

.btn-cancel {
  padding: 0.5rem 1.5rem;
  border: none;
  background: var(--clr-bg);
  color: var(--clr-text);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-cancel:hover {
  background: var(--clr-primary-100);
}
</style> 