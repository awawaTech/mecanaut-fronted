<script>
import { RouterView } from 'vue-router'
import HeaderComponent from './shared/components/header.component.vue'
import Toast from 'primevue/toast'

export default {
    name: 'App',
    components: {
        HeaderComponent,
        RouterView,
        Toast
    }
}
</script>

<template>
    <div class="app">
        <h1>MyHeader</h1>
        <h1>MySidebar</h1>
        <main class="main-content">
            <RouterView />
        </main>
        <Toast />
    </div>
</template>

<style scoped lang="scss">
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--clr-bg);
    color: var(--clr-text);
}

.main-content {
    flex: 1;
    padding: 1rem;
}
</style>
