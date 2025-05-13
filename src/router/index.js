import { createRouter, createWebHistory } from "vue-router";
import ComponentsDemo from '../shared/views/components-demo.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: ComponentsDemo, name: 'components-demo' },
        { path: '/maintenance-plan', component: MaintenancePlanView, name: 'maintenance-plan' },

 /*        { path: '/chi', component: Chi, name: 'chi' },
        { path: '/nio', component: Nio, name: 'nio' }, */
    ]
})

export default router;
