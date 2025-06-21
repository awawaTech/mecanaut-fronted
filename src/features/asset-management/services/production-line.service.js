import axios from 'axios';
import { ProductionLineAssembler } from './production-line.assembler';

/**
 * Servicio para gestionar las operaciones con líneas de producción
 */
export class ProductionLineService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL + '/production-lines';
    this.assembler = ProductionLineAssembler;
  }

  /**
   * Obtiene los headers de autenticación
   * @returns {Object} Headers HTTP
   * @private
   */
  getHeaders() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userSession.token}`
    };
  }

  /**
   * Verifica si hay un token válido
   * @private
   * @throws {Error} Si no hay token disponible
   */
  validateToken() {
    const userSession = JSON.parse(localStorage.getItem('userSession') || '{}');
    if (!userSession.token) {
      console.error('No hay token disponible');
      throw new Error('No autorizado');
    }
    return userSession.token;
  }

  /**
   * Obtiene todas las líneas de producción del servidor
   * @param {number} plantId ID de la planta
   * @returns {Promise<Array>} Lista de líneas de producción
   */
  async getAllProductionLines(plantId) {
    try {
      this.validateToken();
      const response = await axios.get(
        `${this.apiUrl}/plant/${plantId}`,
        { headers: this.getHeaders() }
      );
      return this.assembler.resourcesToEntities(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Obtiene una línea de producción por su ID
   * @param {number} id ID de la línea de producción
   * @returns {Promise<Object>} Línea de producción
   */
  async getProductionLineById(id) {
    try {
      this.validateToken();
      const response = await axios.get(
        `${this.apiUrl}/${id}`,
        { headers: this.getHeaders() }
      );
      return this.assembler.resourceToEntity(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Crea una nueva línea de producción
   * @param {Object} productionLine Datos de la línea de producción
   * @returns {Promise<Object>} Línea de producción creada
   */
  async createProductionLine(productionLine) {
    try {
      this.validateToken();
      const resource = this.assembler.entityToCreateResource(productionLine);
      const response = await axios.post(
        this.apiUrl,
        resource,
        { headers: this.getHeaders() }
      );
      return this.assembler.resourceToEntity(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Actualiza una línea de producción existente
   * @param {Object} productionLine Datos de la línea de producción
   * @returns {Promise<Object>} Línea de producción actualizada
   */
  async updateProductionLine(productionLine) {
    try {
      this.validateToken();
      const resource = this.assembler.entityToUpdateResource(productionLine);
      const response = await axios.patch(
        `${this.apiUrl}/${productionLine.id}`,
        resource,
        { headers: this.getHeaders() }
      );
      return this.assembler.resourceToEntity(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Cambia el estado de una línea de producción
   * @param {number} id ID de la línea de producción
   * @param {string} status Nuevo estado
   * @returns {Promise<Object>} Línea de producción actualizada
   */
  async changeProductionLineStatus(id, status) {
    try {
      this.validateToken();
      const response = await axios.patch(
        `${this.apiUrl}/${id}`,
        { status },
        { headers: this.getHeaders() }
      );
      return this.assembler.resourceToEntity(response.data);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Método para manejar errores de las llamadas HTTP
   * @param {Error} error Error a manejar
   * @private
   */
  handleError(error) {
    console.error('Error en ProductionLineService:', error);
    throw new Error('Ocurrió un error al procesar la solicitud. Por favor intente nuevamente.');
  }

  // Los métodos comentados se pueden implementar así si se necesitan:
  
  /**
   * Obtiene IDs y nombres de todas las líneas de producción
   * @returns {Promise<Array<{id: number, name: string}>>}
   */
  async getProductionLineIdAndName() {
    try {
      const lines = await this.getAllProductionLines(0);
      return lines.map(line => ({
        id: line.id,
        name: line.name
      }));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Obtiene las maquinarias asociadas a una línea de producción específica
   * @param {number} productionLineId ID de la línea de producción
   * @returns {Promise<Array<{id: number, name: string}>>}
   */
  async getMachineriesByProductionLine(productionLineId) {
    try {
      const lines = await this.getAllProductionLines(0);
      const selected = lines.find(line => line.id === productionLineId);
      return selected?.machineries?.map(m => ({
        id: m.id,
        name: m.name
      })) || [];
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
}
