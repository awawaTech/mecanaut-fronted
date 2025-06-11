import axios from 'axios';

/**
 * Servicio base para realizar peticiones HTTP
 */
export class ApiService {
  constructor(baseURL = 'http://localhost:3000') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Realiza una petición GET
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} params - Parámetros de la petición
   * @returns {Promise} - Promesa con la respuesta
   */
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Error en petición GET:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Promesa con la respuesta
   */
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error en petición POST:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   * @param {string} endpoint - Endpoint a consultar
   * @param {Object} data - Datos a enviar
   * @returns {Promise} - Promesa con la respuesta
   */
  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Error en petición PUT:', error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise} - Promesa con la respuesta
   */
  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error en petición DELETE:', error);
      throw error;
    }
  }
} 