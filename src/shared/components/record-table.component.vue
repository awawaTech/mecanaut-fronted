
<script>
import ButtonComponent from './button.component.vue';

export default {
  name: 'RecordTable',
  components: {
    Button: ButtonComponent
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
      validator: (value) => {
        return value.every(col => 
          col.key && 
          col.label && 
          ['texto', 'numero', 'informacion', 'cta'].includes(col.type)
        );
      }
    },
    data: {
      type: Array,
      default: () => []
    }
  },

  emits: ['ctaClick'],

  methods: {
    onCtaClick(row, column) {
      this.$emit('ctaClick', { row, column });
    }
  }
}
</script>

<template>
  <div class="record-table-container">
    <table class="record-table">
      <thead>
        <tr>
          <th v-for="col in columns" 
              :key="col.key" 
              :class="'header-' + col.type">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td v-for="col in columns" :key="col.key">
            <template v-if="col.type === 'texto' || col.type === 'numero'">
              {{ row[col.key] }}
            </template>

            <template v-else-if="col.type === 'informacion'">
              <i class="pi pi-info-circle info-icon" 
                 v-tooltip="row[col.key]">
              </i>
            </template>

            <template v-else-if="col.type === 'cta'">
              <Button 
                :variant="col.ctaVariant || 'primary'"
                size="sm"
                radius="md"
                @clicked="onCtaClick(row, col)"
              >
                {{ col.ctaLabel || 'Acción' }}
              </Button>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="!data.length" class="empty-state">
      <i class="pi pi-frown"></i>
      <span>No hay datos para mostrar</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.record-table-container {
  width: 100%;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.record-table {
  width: 100%;
  max-width: 900px;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--clr-bg);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 24px rgba(var(--clr-primary-400), 0.10), 
              0 1.5px 4px rgba(var(--clr-primary-400), 0.08);
  overflow: hidden;
  font-family: v-bind('$font-family-base');
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

// Cabecera
.record-table thead tr {
  background: linear-gradient(90deg, var(--clr-primary-400) 0%, var(--clr-primary-200) 100%);
}

.record-table th {
  color: var(--clr-bg);
  font-weight: 700;
  padding: 1.1rem 1.5rem;
  text-align: left;
  letter-spacing: 0.5px;
  font-size: 1.08rem;
  border-bottom: 2px solid var(--clr-primary-100);
}

// Celdas
.record-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--clr-color);
  color: var(--clr-text);
  background: var(--clr-bg);
  vertical-align: middle;
  transition: background 0.2s;
}

// Hover fila
.record-table tbody tr {
  transition: background 0.2s;
  
  &:hover {
    background: var(--clr-primary-100);
    color: var(--clr-bg);
  }
}

// Icono de información
.info-icon {
  color: var(--clr-primary-400);
  font-size: 1.3rem;
  vertical-align: middle;
  cursor: pointer;
  transition: color 0.2s;
}

.record-table tbody tr:hover .info-icon {
  color: var(--clr-bg);
}

// Estado vacío
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--clr-gris2);
  font-size: 1.1rem;
  margin: 2rem 0;
  gap: 0.5rem;

  .pi-frown {
    font-size: 2.2rem;
    color: var(--clr-primary-100);
  }
}

// Responsive
@media (max-width: 700px) {
  .record-table {
    font-size: 0.95rem;
    max-width: 100vw;
  }
  
  .record-table th, 
  .record-table td {
    padding: 0.7rem 0.5rem;
  }
}

// Añadir estilos específicos para el botón CTA en la tabla
:deep(.btn-sm) {
  min-width: 90px;
  font-size: 0.9rem;
  padding: 6px 12px;
}
</style>