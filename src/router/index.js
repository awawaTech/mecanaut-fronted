import { createRouter, createWebHistory } from "vue-router";
import ComponentsDemo from '../shared/views/components-demo.vue'
import MaintenancePlanView from '../features/maintenance-plan/views/maintenance-plan-view.component.vue'
import InventoryPartsView from '../features/inventory-parts/views/inventory-parts.view.component.vue'
import PurchaseOrdersView from '../features/purchase-orders/views/purchase-orders.view.component.vue'
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: ComponentsDemo, name: 'components-demo' },
        { path: '/maintenance-plan', component: MaintenancePlanView, name: 'maintenance-plan' },
        { path: '/inventory-parts', component: InventoryPartsView, name: 'inventory-parts' },
        { path: '/purchase-orders', component: PurchaseOrdersView, name: 'purchase-orders' },
 /*        { path: '/chi', component: Chi, name: 'chi' },
        { path: '/nio', component: Nio, name: 'nio' }, */
    ]
})

export default router;
