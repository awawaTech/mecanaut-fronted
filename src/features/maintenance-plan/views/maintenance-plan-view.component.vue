<template>
    <Search 
                        :filters="demoFilters"
                        @search="handleSearch"
                        @filter-change="handleFilterChange"
                        @action-click="handleNewClick"
                    />
  </template>
  
  <script>
  import Search from '../../../shared/components/search.component.vue';

  export default {
    name: "MaintenancePlanView",
    components: {
        Search
    }
  };
  </script>
  
  <style scoped>
  
  .maintenance-plan-view {
    padding: 20px;
    background-color: #f4f4f4;
    border-radius: 8px;
  }
  
  h1 {
    color: #333;
  }
  </style>
  