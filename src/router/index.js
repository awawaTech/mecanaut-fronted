import { createRouter, createWebHistory } from "vue-router";
import ComponentsDemo from '../shared/views/components-demo.vue'
import MaintenancePlanView from '../features/maintenance-plan/views/maintenance-plan-view.component.vue'
import InventoryPartsView from '../features/inventory-parts/views/inventory-parts.view.component.vue'
import CalendarViewComponent from "../features/maintenance-calendar/views/calendar.view.component.vue";
import PurchaseOrdersView from '../features/purchase-orders/views/purchase-orders.view.component.vue'
import PersonalView from '../features/personal/views/personal.view.component.vue'
import NotFoundView from '../shared/views/not-found.view.component.vue'
import MachineryAssetView from '../features/asset-management/views/machinery-asset-view.component.vue'
import LoginView from '../features/authentication/views/login.view.component.vue'
import CreateAccountView from '../features/authentication/views/create-account.view.component.vue'
import HomeView from '../public/pages/home-view.vue'
import ExecutionView from '../features/execution/views/execution-view.component.vue'
import WorkOrderView from '../features/work-order/views/work-order.component.vue'
import PlantView from '../features/asset-management/views/plant-view.component.vue'
import ProductionLineView from '../features/asset-management/views/production-line-view.component.vue'
import { requireAuth, requireGuest } from './auth.guard'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Rutas protegidas que requieren autenticación
        { 
            path: '/maintenance-plan', 
            component: MaintenancePlanView, 
            name: 'maintenance-plan',
            beforeEnter: requireAuth
        },
        { 
            path: '/inventory-parts', 
            component: InventoryPartsView, 
            name: 'inventory-parts',
            beforeEnter: requireAuth
        },
        { 
            path: '/maintenance-calendar', 
            component: CalendarViewComponent, 
            name: 'maintenance-calendar',
            beforeEnter: requireAuth
        },
        { 
            path: '/purchase-orders', 
            component: PurchaseOrdersView, 
            name: 'purchase-orders',
            beforeEnter: requireAuth
        },
        { 
            path: '/machinery', 
            component: MachineryAssetView, 
            name: 'machinery',
            beforeEnter: requireAuth
        },
        { 
            path: '/orden-trabajo', 
            component: WorkOrderView, 
            name: 'orden-trabajo',
            beforeEnter: requireAuth
        },
        { 
            path: '/administracion-personal', 
            component: PersonalView, 
            name: 'personal',
            beforeEnter: requireAuth
        },
        { 
            path: '/gestion-activos/plantas', 
            component: PlantView, 
            name: 'plantas',
            beforeEnter: requireAuth
        },
        { 
            path: '/gestion-activos/lineas-produccion', 
            component: ProductionLineView, 
            name: 'lineas-produccion',
            beforeEnter: requireAuth
        },
        { 
            path: '/execution', 
            component: ExecutionView, 
            name: 'execution',
            beforeEnter: requireAuth
        },
        
        // Rutas de autenticación (solo para usuarios no autenticados)
        { 
            path: '/login', 
            component: LoginView, 
            name: 'login',
            beforeEnter: requireGuest
        },
        { 
            path: '/create-account', 
            component: CreateAccountView, 
            name: 'create-account',
            beforeEnter: requireGuest
        },
        
        // Rutas públicas
        { 
            path: '/', 
            component: HomeView, 
            name: 'home',
            beforeEnter: requireAuth
        },
        { 
            path: '/404', 
            component: NotFoundView, 
            name: 'not-found'
        }, 
        { 
            path: '/:pathMatch(.*)*', 
            redirect: '/404' 
        }
    ]
})

export default router;
