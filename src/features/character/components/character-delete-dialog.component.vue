<script>
export default {
  name: "character-delete-dialog",
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    characterName: {
      type: String,
      default: ""
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<template>
  <pv-dialog 
    :visible="visible" 
    :modal="true"
    :closable="false"
    :style="{ width: '450px' }"
    header="Confirmar eliminación"
  >
    <div class="delete-dialog-content">
      <p>
        Estás seguro de querer eliminar el personaje {{ characterName }}?
      </p>
      <div class="p-d-flex p-jc-end">
        <pv-button 
          class="p-button-text p-mr-2" 
          label="Cancelar" 
          @click="cancel" 
        />
        <pv-button 
          class="p-button-danger" 
          label="Eliminar" 
          @click="confirm" 
        />
      </div>
    </div>
  </pv-dialog>
</template>

<style scoped>
.delete-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
