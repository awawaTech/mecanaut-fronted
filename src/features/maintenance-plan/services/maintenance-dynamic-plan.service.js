import axios from 'axios';
import { MaintenanceDynamicPlanAssembler } from './maintenance-dynamic-plan.assembler.js';

const http = axios.create({
  baseURL: 'http://localhost:5128/api',
  timeout: 8000,
});

// Nueva instancia para la API externa
const externalHttp = axios.create({
  baseURL: 'http://localhost:5128/api',
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
  async getAllPlans(plantLineId = null) {
    try {
      let url = '/v1/dynamic-maintenance-plans';
      if (plantLineId) {
        url += `?plantLineId=${plantLineId}`;
      }
      
      const res = await externalHttp.get(url);
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
      const res = await externalHttp.get(`/v1/dynamic-maintenance-plans/${planId}`);
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
      // Preparar datos según la estructura esperada por la API
      const planForServer = {
        name: planData.planName,
        metricId: planData.parameter,
        amount: planData.amount.toString(),
        productionLineId: "1", // Valor por defecto
        plantLineId: "1", // Valor por defecto
        machines: planData.machineIds || [],
        tasks: planData.tasks ? planData.tasks.map(task => task.taskDescription) : []
      };
      
      console.log('Plan dinámico preparado para enviar:', planForServer);
      
      // Enviar POST
      const res = await externalHttp.post('/v1/dynamic-maintenance-plans', planForServer);
      return MaintenanceDynamicPlanAssembler.toModel(res.data);
    } catch (error) {
      console.error('Error al crear plan dinámico', error);
      throw new Error('Error al crear plan dinámico');
    }
  }

  /* -------- UPDATE -------- */
  async updatePlan(planData) {
    try {
      const planForServer = {
        name: planData.planName,
        metricId: planData.parameter,
        amount: planData.amount.toString(),
        productionLineId: "1", // Valor por defecto
        plantLineId: "1", // Valor por defecto
        machines: planData.machineIds || [],
        tasks: planData.tasks ? planData.tasks.map(task => task.taskDescription) : []
      };
      
      const res = await externalHttp.put(`/v1/dynamic-maintenance-plans/${planData.id}`, planForServer);
      
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
      await externalHttp.delete(`/v1/dynamic-maintenance-plans/${planId}`);
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