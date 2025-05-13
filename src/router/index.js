import { createRouter, createWebHistory } from "vue-router";
import ComponentsDemo from '../shared/views/components-demo.vue'
import CharacterView from '../features/character/views/character-view.component.vue'
import CharacterDetailView from '@/features/character/views/character-detail.view.vue'
import CharacterCreateView from '@/features/character/views/character-create.view.vue'
import CharacterEditView from '@/features/character/views/character-edit.view.vue'
import PlanView from '@/features/plan-mantenimiento/views/plan-view.component.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: ComponentsDemo, name: 'components-demo' },
  

 /*        { path: '/chi', component: Chi, name: 'chi' },
        { path: '/nio', component: Nio, name: 'nio' }, */
    ]
})

export default router;
