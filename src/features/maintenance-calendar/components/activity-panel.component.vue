<template>
  <div class="information-panel">
    <!-- HEADER -->
    <div v-if="showHeader" class="header">
      <HeaderPanel
          :headerText="headerText"
          :showRectangularBox="showRectangularBox"
          :rectangularBoxText="rectangularBoxText"
          :headerTextClass="headerTextClass"
      />
    </div>

    <!-- CONTENT -->
    <div class="content">
      <div>
        <slot>Nombre de la actividad: </slot>
      </div>
        <slot>Fecha: </slot>
      <div>
        <slot>Hora: </slot>
      </div>
      <div>
        <slot>Personal encargado: </slot>
      </div>
      <div>
        <slot>Anotaciones</slot>
      </div>
    </div>

    <!-- BUTTONS (omitted as per your request) -->

  </div>
</template>

<script>
import HeaderPanel from '../../../shared/components/information-panel/header-panel.component.vue'

export default {
  name: 'InformationPanel',
  components: {
    HeaderPanel
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    },
    showRectangularBox: {
      type: Boolean,
      default: false
    },
    headerText: {
      type: String,
      default: 'Detalles de la actividad'
    },
    rectangularBoxText: {
      type: String,
      default: ''
    },
    headerTextClass: {
      type: String,
      default: ''
    },
    // Propiedades para los botones (aunque las omitimos en este caso)
    showPrimaryButton: {
      type: Boolean,
      default: false
    },
    showSecondaryButton: {
      type: Boolean,
      default: false
    },
    primaryButtonText: {
      type: String,
      default: 'Editar'
    },
    secondaryButtonText: {
      type: String,
      default: 'Desactivar'
    }
  },
  methods: {
    onPrimaryButtonClick() {
      this.$emit('primaryButtonClick');
    },
    onSecondaryButtonClick() {
      this.$emit('secondaryButtonClick');
    }
  }
}
</script>

<style scoped>
.information-panel {
  width: 20%;
  padding: 2.3em 2.1em;
  border: 2px solid #F1E9F7;
  border-radius: 8px;
  background-color:var(--clr-bg);
}

.header {
  margin-bottom: 15px;
}

.rectangular-box {
  background-color: #498fe0;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

h3 {
  color: #ff6f61;
  font-size: 18px;
  font-weight: bold;
}

.content {
  display: flex;
  gap:30px;
  flex-direction: column;
  gap:1.5em;
}

</style>