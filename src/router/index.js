import { createRouter, createWebHistory } from "vue-router";
import ComponentsDemo from '../shared/views/components-demo.vue'
import MaintenancePlanView from '../features/maintenance-plan/views/maintenance-plan-view.component.vue'
import InventoryPartsView from '../features/inventory-parts/views/inventory-parts.view.component.vue'
import CalendarViewComponent from "../features/maintenance-calendar/views/calendar.view.component.vue";
import PurchaseOrdersView from '../features/purchase-orders/views/purchase-orders.view.component.vue'
import NotFoundView from '../shared/views/not-found.view.component.vue'
import MachineryAssetView from '../features/asset-management/views/machinery-asset-view.component.vue'
import LoginView from '../features/authentication/views/login.view.component.vue'
import CreateAccountView from '../features/authentication/views/create-account.view.component.vue'
import HomeView from '../public/pages/home-view.vue'
import ExecutionView from '../features/execution/views/execution-view.component.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/maintenance-plan', component: MaintenancePlanView, name: 'maintenance-plan' },
        { path: '/inventory-parts', component: InventoryPartsView, name: 'inventory-parts' },
        { path: '/maintenance-calendar', component: CalendarViewComponent, name: 'maintenance-calendar'},
        { path: '/purchase-orders', component: PurchaseOrdersView, name: 'purchase-orders' },
        { path: '/machinery', component: MachineryAssetView, name: 'machinery' },
        { path: '/login', component: LoginView, name: 'login' },
        {path: '/create-account',component:CreateAccountView,name: 'create-account'},
        { path: '/404', component: NotFoundView, name: 'not-found' }, 
        { path: '/:pathMatch(.*)*', redirect: '/404' },
        { path: '/', component: HomeView, name: 'home' },
        { path: '/execution', component: ExecutionView, name: 'execution' }
    ]
})

export default router;
