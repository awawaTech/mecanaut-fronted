<script>
import { RouterView } from 'vue-router'
import HeaderComponent from './shared/components/header.component.vue'

export default {
    name: 'App',
    components: {
        HeaderComponent,
        RouterView
    }
}
</script>

<template>
    <div class="app">
        <main class="main-content">
            <RouterView />
        </main>
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
