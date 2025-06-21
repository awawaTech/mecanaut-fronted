<script>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonComponent from '../../../shared/components/button.component.vue';
export default {
  name: 'SearchComponent',

  components: {
    ButtonComponent
  },

  emits: ['search', 'filter-change', 'action-click'],

  props: {
    placeholder: {
      type: String,
      default: ''
    },
    filters: {
      type: Array,
      default: () => []
    },
    newLabel: {
      type: String,
      default: ''
    },
    showNewButton: {
      type: Boolean,
      default: true
    }
  },

  setup(props, { emit }) {
    const { t } = useI18n();
    const searchText = ref('');
    const showFilters = ref(false);
    const selectedFilters = ref({});

    const computedPlaceholder = () => props.placeholder || t('search.placeholder');

    const onSearchChange = () => {
      emit('search', searchText.value);
    };

    const onFilterChange = () => {
      emit('filter-change', selectedFilters.value);
    };

    const onActionClick = () => {
      emit('action-click');
    };

    const clearFilters = () => {
      searchText.value = '';
      selectedFilters.value = {};
      emit('search', '');
      emit('filter-change', {});
    };

    const onEnter = () => {
      emit('enter', searchText.value);
    };

    return {
      t,
      searchText,
      showFilters,
      selectedFilters,
      computedPlaceholder,
      onSearchChange,
      onFilterChange,
      onActionClick,
      clearFilters,
      onEnter,
    };
  }
}
</script>

<template>
  <div class="search-container">
    <div class="search-row">
      <div class="search-input">
        <span class="icon-search">
          <i class="pi pi-search"></i>
        </span>
        <input
            type="text"
            :placeholder="computedPlaceholder()"
            v-model="searchText"
            @input="onSearchChange"
            @keyup.enter="onEnter"
        />
      </div>

      <div class="filter-button-container">
        <button-component
            variant="outline"
            size="md"
            :icon-left="'pi pi-filter'"
            @clicked="showFilters = !showFilters"
            class="filter-button"
        >
          {{ t('search.filters') }}
        </button-component>
      </div>
    </div>

    <div v-if="filters?.length && showFilters" class="search-filters">
      <div class="filters-wrapper">
        <div
            v-for="filter in filters"
            :key="filter.value"
            class="filter-group"
        >
          <span class="icon-filter">
            <i class="pi pi-filter-fill"></i>
          </span>
          <label class="filter-label">{{ filter.label }}</label>
          <Dropdown
              v-model="selectedFilters[filter.value]"
              :options="filter.options"
              optionLabel="label"
              optionValue="value"
              @change="onFilterChange"
              class="filter-dropdown"
          />
        </div>
      </div>

      <div class="clear-filters" v-if="searchText || Object.keys(selectedFilters).length > 0">
        <button-component
            variant="primary"
            size="sm"
            :icon-left="'pi pi-trash'"
            @clicked="clearFilters"
            class="clear-button"
        >
          Limpiar filtros
        </button-component>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: stretch;
  gap: 0;
  padding: 0.8rem 2rem;
  background: var(--clr-surface);
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.search-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  gap: 1rem;
}

.search-input {
  flex: 4;
  min-width: 200px;
  display: flex;
  align-items: center;
  border: 1px solid var(--clr-bg);
  border-radius: var(--radius-md);
  background: var(--clr-bg);
  padding: 0.3rem 0.8rem;
  height: 2.2rem;
  transition: border 0.2s;

  input {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-size: 1rem;
    margin-left: 0.5rem;
    height: 1rem;
    color: var(--clr-text);

    &::placeholder {
      color: var(--clr-gris2);
    }
  }

  .icon-search {
    color: var(--clr-primary-300);
    font-size: 1.2rem;
  }

  &:focus-within {
    border-color: var(--clr-primary-300);
  }
}

.filter-button-container {
  flex: 1;
  min-width: fit-content;

  .filter-button {
    width: 100%;
    background: transparent;
    border: 1px solid var(--clr-primary-500);
    color: var(--clr-primary-500);

    &:hover {
      background: var(--clr-primary-100);
      border-color: var(--clr-primary-100);
      color: var(--clr-bg);
    }
  }
}

.search-action {
  flex: 1;
  min-width: fit-content;

  .action-button {
    width: 100%;
  }
}

.search-filters {
  width: 100%;
  background: var(--clr-surface);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 0.8rem 1.2rem;
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 220px;
  animation: fadeInDown 0.3s;
}

.filters-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  align-items: flex-start;
}

.toggle-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--clr-primary-300);
  color: var(--clr-primary-300);
  border: 1px solid var(--clr-primary-300);
  height: 2.5rem;

  &:hover {
    background: var(--clr-primary-300);
    color: var(--clr-surface);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-group {
  background: var(--clr-surface);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-width: 160px;
  transition: all 0.2s;
  border: 1px solid var(--clr-primary-300);

  .icon-filter {
    color: var(--clr-primary-300);
  }

  .filter-label {
    color: var(--clr-text);
    font-weight: 500;

  }
  .filter-dropdown{
    background: var(--clr-primary-300);
    color: var(--clr-text);
  }
}

.clear-filters {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--clr-bg);
  padding-top: 0.8rem;
  margin-top: 0.2rem;

  .clear-button {
    color: var(--clr-gris2);
    font-size: 0.9rem;

    &:hover {
      color: var(--clr-primary-500);
    }
  }
}

@media (max-width: 900px) {
  .search-row {
    flex-direction: column;
    gap: 1rem;

    .search-input,
    .filter-button-container,
    .search-action {
      flex: none;
      width: 100%;
    }
  }

  .search-filters {
    .filters-wrapper {
      flex-direction: column;
      gap: 0.7rem;
    }

    .filter-group {
      width: 100%;


    }
  }
}
</style>