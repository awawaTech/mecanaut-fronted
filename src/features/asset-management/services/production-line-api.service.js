import axios from 'axios';
import { ProductionLineAssembler } from './production-line.assembler.js';
import authHeader from "@/shared/infraestructure/auth-header.js";

const baseEndpoint = 'http://localhost:5128/api/v1';
const productionLinesEndpoint = `${baseEndpoint}/production-lines`;

const http = axios.create({
  baseURL: baseEndpoint,
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  const headers = authHeader();
  config.headers = {
    ...config.headers,
    ...headers
  };
  return config;
});


export class ProductionLineApiService {
  static async getProductionLines(plantId) {
    try {
      const response = await http.get('/production-lines', { params: { plantId } });
      return ProductionLineAssembler.toEntitiesFromResponse(response);
    } catch (err) {
      console.error('Error loading production line list:', err);
      return [];
    }
  }

  static async getProductionLineById(id) {
    try {
      const response = await http.get(`/production-lines/${id}`);
      return ProductionLineAssembler.toEntityFromResource(response.data);
    } catch (err) {
      console.error(`Error loading production line with ID ${id}:`, err);
      throw err;
    }
  }

  static async createProductionLine(productionLineData) {
    try {
      if (!productionLineData.name || !productionLineData.code || !productionLineData.capacityUnitsPerHour) {
        throw new Error('Name, code and capacity units per hour is required');
      }

      const resourceData = ProductionLineAssembler.toResourceFromEntity(productionLineData);

      const response = await http.post(productionLinesEndpoint, resourceData);

      return ProductionLineAssembler.toEntityFromResource(response.data);
    } catch (err) {
      console.error('Error creating production line:', err);
      throw err;
    }
  }

  static async updateProductionLine(id, productionLineData) {
    try {
      const resourceData = ProductionLineAssembler.toResourceFromEntity({
        ...productionLineData,
        id
      });

      const response = await http.put(`${productionLinesEndpoint}/${id}`, resourceData);

      return ProductionLineAssembler.toEntityFromResource(response.data);
    } catch (err) {
      console.error(`Error updating production line ${id}:`, err);
      throw err;
    }
  }

  static async deleteProductionLine(id) {
    try {
      await http.delete(`${productionLinesEndpoint}/${id}`);
      return true;
    } catch (err) {
      console.error(`Error deleting production line ${id}:`, err);
      throw err;
    }
  }
}


