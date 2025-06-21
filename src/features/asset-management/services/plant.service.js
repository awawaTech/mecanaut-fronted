import axios from 'axios';
import { PlantAssembler } from './plant.assembler';

/**
 * Servicio para gestionar las operaciones con plantas
 */
export class PlantService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL + '/plants';
    this.assembler = PlantAssembler;
  }

  /**
   * Obtiene los headers de autenticación
   * @returns {Object} Headers HTTP
   */
  getHeaders() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userSession.token}`
    };
  }

  /**
   * Obtiene todas las plantas
   * @returns {Promise<Array>} Lista de plantas
   */
  async getAll() {
    try {
      const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
      
      if (!userSession.token) {
        console.error('No hay token disponible');
        throw new Error('No autorizado');
      }

      const response = await axios.get(this.apiUrl, {
        headers: this.getHeaders()
      });

      return response.data.map(resource => this.assembler.resourceToEntity(resource));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Obtiene una planta por su ID
   * @param {number} id ID de la planta
   * @returns {Promise<Object>} La planta encontrada
   */
  async getById(id) {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders()
      });
      return this.assembler.resourceToEntity(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva planta
   * @param {Object} plant Datos de la planta a crear
   * @returns {Promise<Object>} La planta creada
   */
  async create(plant) {
    try {
      const resource = this.assembler.createEntityToResource(plant);
      const response = await axios.post(this.apiUrl, resource, {
        headers: this.getHeaders()
      });
      return this.assembler.resourceToEntity(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Actualiza una planta existente
   * @param {number} id ID de la planta a actualizar
   * @param {Object} plant Datos a actualizar
   * @returns {Promise<Object>} La planta actualizada
   */
  async update(id, plant) {
    try {
      const resource = this.assembler.updateEntityToResource(plant);
      const response = await axios.put(`${this.apiUrl}/${id}`, resource, {
        headers: this.getHeaders()
      });
      return this.assembler.resourceToEntity(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Elimina una planta
   * @param {number} id ID de la planta a eliminar
   * @returns {Promise<void>}
   */
  async delete(id) {
    try {
      await axios.delete(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders()
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Gestiona los errores HTTP
   * @param {Error} error Error HTTP
   * @private
   */
  handleError(error) {
    console.error('Error en PlantService:', error);
    throw new Error('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
  }
} 