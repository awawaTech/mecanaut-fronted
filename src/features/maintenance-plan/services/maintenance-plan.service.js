import { ApiService } from '../../../core/services/api.service';
import { MaintenancePlanAssembler } from '../models/maintenance-plan.assembler';

/**
 * Servicio para manejar las operaciones de planes de mantenimiento
 */
export class MaintenancePlanService {
  constructor() {
    this.apiService = new ApiService();
    this.endpoint = 'MaintenancePlanData';
  }

  /**
   * Obtiene todos los planes de mantenimiento
   * @returns {Promise<Array>} - Lista de planes de mantenimiento
   */
  async getAllPlans() {
    try {
      const response = await this.apiService.get(this.endpoint);
      
      // Verificar la estructura exacta de la respuesta para extraer los datos correctamente
      if (response && response.info && Array.isArray(response.data)) {
        console.log('Datos obtenidos de la API:', response.data);
        return MaintenancePlanAssembler.toModelList(response.data);
      } else if (Array.isArray(response)) {
        // Si directamente es un array
        console.log('Datos obtenidos como array:', response);
        return MaintenancePlanAssembler.toModelList(response);
      } else {
        // Si no tiene la estructura esperada
        console.error('Estructura de respuesta inesperada:', response);
        return [];
      }
    } catch (error) {
      console.error('Error al obtener planes de mantenimiento:', error);
      throw error;
    }
  }

  /**
   * Obtiene un plan de mantenimiento por su ID
   * @param {number} planId - ID del plan
   * @returns {Promise<Object>} - Plan de mantenimiento
   */
  async getPlanById(planId) {
    try {
      const response = await this.apiService.get(`${this.endpoint}/${planId}`);
      
      // Verificar la estructura
      if (response && response.info && response.data) {
        return MaintenancePlanAssembler.toModel(response.data);
      }
      
      // Transformar la respuesta al modelo
      return MaintenancePlanAssembler.toModel(response);
    } catch (error) {
      console.error(`Error al obtener plan de mantenimiento con ID ${planId}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo plan de mantenimiento
   * @param {Object} planData - Datos del plan
   * @returns {Promise<Object>} - Plan creado
   */
  async createPlan(planData) {
    try {
      // Convertir el modelo al formato de API
      const apiData = MaintenancePlanAssembler.toApiFormat(planData);
      
      const response = await this.apiService.post(this.endpoint, apiData);
      
      // Transformar la respuesta al modelo
      return MaintenancePlanAssembler.toModel(response);
    } catch (error) {
      console.error('Error al crear plan de mantenimiento:', error);
      throw error;
    }
  }

  /**
   * Actualiza un plan de mantenimiento existente
   * @param {number} planId - ID del plan a actualizar
   * @param {Object} planData - Datos actualizados del plan
   * @returns {Promise<Object>} - Plan actualizado
   */
  async updatePlan(planId, planData) {
    try {
      // Convertir el modelo al formato de API
      const apiData = MaintenancePlanAssembler.toApiFormat(planData);
      
      const response = await this.apiService.put(`${this.endpoint}/${planId}`, apiData);
      
      // Transformar la respuesta al modelo
      return MaintenancePlanAssembler.toModel(response);
    } catch (error) {
      console.error(`Error al actualizar plan de mantenimiento con ID ${planId}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un plan de mantenimiento
   * @param {number} planId - ID del plan a eliminar
   * @returns {Promise<void>}
   */
  async deletePlan(planId) {
    try {
      await this.apiService.delete(`${this.endpoint}/${planId}`);
    } catch (error) {
      console.error(`Error al eliminar plan de mantenimiento con ID ${planId}:`, error);
      throw error;
    }
  }
} 