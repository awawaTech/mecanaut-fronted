<script>
import {RouterView, useRoute} from 'vue-router'
import HeaderComponent from './shared/components/header.component.vue'
import Toast from 'primevue/toast'
import SidebarMecanaut from './shared/components/sidebar-mecanaut.component.vue'
import {ref, provide, computed} from 'vue'

export default {
    name: 'App',
    components: {
        HeaderComponent,
        RouterView,
        Toast,
        SidebarMecanaut
    },
    setup() {
      const route = useRoute();
// Lista de rutas donde NO debe mostrarse el sidebar
      const authRoutes = ['/login', '/create-account'];
      const isAuthPage = computed(() => authRoutes.includes(route.path));

      const sidebarExpanded = ref(false);
        provide('sidebarExpanded', sidebarExpanded);
        
        return {
            sidebarExpanded,
            isAuthPage
        }
    }
}
</script>

<template>
    <div class="app">
        <div v-if="!isAuthPage" class="sidebar-container" :class="{ 'expanded': sidebarExpanded }">
            <SidebarMecanaut @sidebar-toggle="sidebarExpanded = $event" />
        </div>
        <main :class="{ 'no-padding': isAuthPage }" class="main-content">
            <RouterView />
        </main>
        <Toast />
    </div>
</template>

<style scoped lang="scss">
.app {
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    background-color: var(--clr-bg);
    color: var(--clr-text);
    width: 100%;
    overflow: hidden;
}

.sidebar-container {
    flex: 0 0 auto;
    position: relative;
    height: 100vh;
    z-index: 100;
    min-width: 102px; /* 70px del sidebar + 16px de margen a cada lado */
    transition: all 0.3s ease;
    
    &.expanded {
        min-width: 312px; /* 280px del sidebar expandido + 16px de margen a cada lado */
    }
}

.main-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    height: 100vh;
    box-sizing: border-box;
    transition: all 0.3s ease;
}

.main-content.no-padding {
  padding: 0;
}
</style>