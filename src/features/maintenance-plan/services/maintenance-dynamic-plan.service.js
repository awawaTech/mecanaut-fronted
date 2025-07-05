import axios from 'axios';
import { MaintenanceDynamicPlanAssembler } from './maintenance-dynamic-plan.assembler.js';

const http = axios.create({
  baseURL: 'http://localhost:3000/maintenance-dynamic-plans',
  timeout: 8000,
});

// Nueva instancia para la API externa
const externalHttp = axios.create({
  baseURL: 'https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api',
  timeout: 8000,
});

// Función para obtener el token de autenticación
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Interceptor para agregar el token en cada petición a la API externa
externalHttp.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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

  /* -------- EXTERNAL API ENDPOINTS -------- */
  
  /**
   * Obtiene todas las plantas disponibles
   * @returns {Promise<Array>} - Lista de plantas
   */
  async getPlants() {
    try {
      const response = await externalHttp.get('/v1/plants');
      return response.data;
    } catch (err) {
      console.error('Error cargando plantas:', err);
      return [];
    }
  }

  /**
   * Obtiene las líneas de producción por plantId
   * @param {number} plantId - ID de la planta
   * @returns {Promise<Array>} - Lista de líneas de producción
   */
  async getProductionLines(plantId) {
    try {
      const response = await externalHttp.get(`/v1/production-lines?plantId=${plantId}`);
      return response.data;
    } catch (err) {
      console.error('Error cargando líneas de producción:', err);
      return [];
    }
  }
}

export const maintenanceDynamicPlanService = new MaintenanceDynamicPlanService(); 