import axios from 'axios';
import { MaintenanceDynamicPlanAssembler } from './maintenance-dynamic-plan.assembler.js';

const http = axios.create({
  baseURL: 'http://localhost:3000/maintenance-dynamic-plans',
  timeout: 8000,
});

export class MaintenanceDynamicPlanService {
  /* -------- READ ALL -------- */
  async getAllPlans() {
    try {
      const res = await http.get('/');
      console.log('Respuesta bruta de la API:', res.data); // Depuración
      
      if (!res.data) return [];
      
      // Procesamos directamente cada elemento con el método toModel
      if (Array.isArray(res.data)) {
        const plans = res.data.map(plan => MaintenanceDynamicPlanAssembler.toModel(plan));
        console.log('Planes procesados:', plans); // Depuración
        return plans;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener planes dinámicos', error);
      return [];
    }
  }

  /* -------- READ ONE -------- */
  async getPlanById(planId) {
    try {
      const res = await http.get(`/${planId}`);
      if (!res.data) return null;
      
      return MaintenanceDynamicPlanAssembler.toModel(res.data);
    } catch (error) {
      console.error('Error al obtener plan dinámico por ID', error);
      return null;
    }
  }

  /* -------- CREATE -------- */
  async createPlan(planData) {
    try {
      // Obtener todos los planes para calcular el nuevo ID
      const existingPlans = await this.getAllPlans();
      
      // Encontrar el ID más alto entre los planes existentes
      const maxPlanId = existingPlans.length > 0 
        ? Math.max(...existingPlans.map(p => parseInt(p.dynamicPlanId) || 0)) 
        : 0;
      
      // Asignar el siguiente ID al nuevo plan (secuencial)
      const newPlan = { 
        ...planData, 
        id: maxPlanId + 1,  // Asignar también el id para evitar inconsistencias
        dynamicPlanId: maxPlanId + 1
      };
      
      // Encontrar el ID de tarea más alto en todos los planes existentes
      let maxTaskId = 0;
      existingPlans.forEach(plan => {
        if (plan.tasks && Array.isArray(plan.tasks)) {
          plan.tasks.forEach(task => {
            if (task.taskId && parseInt(task.taskId) > maxTaskId) {
              maxTaskId = parseInt(task.taskId);
            }
          });
        }
      });
      
      // Asignar IDs a las tareas (secuenciales a partir del último ID existente)
      let taskIdCounter = maxTaskId + 1;
      newPlan.tasks = newPlan.tasks.map(task => ({
        ...task,
        taskId: taskIdCounter++,
        // Asegurarse de que machineIds sea un array
        machineIds: Array.isArray(task.machineIds) ? [...task.machineIds] : []
      }));
      
      console.log('Plan dinámico preparado para enviar:', newPlan);
      
      // Convertir a formato de API
      const planForServer = MaintenanceDynamicPlanAssembler.toApiFormat(newPlan);
      
      // Enviar POST
      const res = await http.post('/', planForServer);
      return MaintenanceDynamicPlanAssembler.toModel(res.data);
    } catch (error) {
      console.error('Error al crear plan dinámico', error);
      throw new Error('Error al crear plan dinámico');
    }
  }

  /* -------- UPDATE -------- */
  async updatePlan(planData) {
    try {
      const planForServer = MaintenanceDynamicPlanAssembler.toApiFormat(planData);
      const res = await http.put(`/${planData.dynamicPlanId}`, planForServer);
      
      if (!res.data) return null;
      return MaintenanceDynamicPlanAssembler.toModel(res.data);
    } catch (error) {
      console.error('Error al actualizar plan dinámico', error);
      return null;
    }
  }

  /* -------- DELETE -------- */
  async deletePlan(planId) {
    try {
      await http.delete(`/${planId}`);
      return true;
    } catch (error) {
      console.error('Error al eliminar plan dinámico', error);
      return false;
    }
  }
}

export const maintenanceDynamicPlanService = new MaintenanceDynamicPlanService(); 