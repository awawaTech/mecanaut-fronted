<script>
export default {
  name: "activity-panel-component",
  props: {
    plan: {
      type: Object,
      default: null
    }
  }
};
</script>

<template>
  <div class="information-panel" v-if="plan">
    <h3>Detalles de la actividad</h3>
    <div class="content">
      <div><strong>Nombre de la actividad:</strong> {{ plan.planName }}</div>
      <div><strong>Fecha inicio:</strong> {{ new Date(plan.startDate).toLocaleDateString() }}</div>
      <div><strong>Días:</strong> {{ plan.durationDays }}</div>
      <div><strong>Personal:</strong> {{ plan.userCreator }}</div>
      <div><strong>Actividades:</strong> {{ plan.items.length }}</div>
    </div>
  </div>
</template>

<style scoped>
  h3{
    color: var(--clr-primary-100);
  }
  .information-panel {
    width: 20%;
    padding: 1em;
    border: 1px solid #ccc;
    background-color: var(--clr-bg);
    border-radius: 8px;
  }
  .content {
    margin-top: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    cursor: alias;
  }
</style>
