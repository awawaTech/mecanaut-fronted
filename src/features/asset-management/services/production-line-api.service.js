import axios from 'axios';
import { ProductionLineAssembler } from './production-line.assembler.js';
import authHeader from "@/shared/infraestructure/auth-header.js";

const baseEndpoint = 'https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/v1';
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
      console.log('🔄 Respuesta de API:', response);
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
      if (!productionLineData.name || !productionLineData.code || 
          !productionLineData.capacityUnitsPerHour || !productionLineData.plantId) {
        throw new Error('Nombre, código, capacidad y planta son requeridos');
      }

      const payload = {
        name: productionLineData.name,
        code: productionLineData.code,
        capacityUnitsPerHour: Number(productionLineData.capacityUnitsPerHour),
        plantId: Number(productionLineData.plantId)
      };

      const response = await http.post(productionLinesEndpoint, payload);
      return ProductionLineAssembler.toEntityFromResource(response.data);
    } catch (err) {
      console.error('Error al crear la línea de producción:', err);
      throw err;
    }
  }

  static async updateProductionLine(productionLineData) {
    try {
      if (!productionLineData.id) {
        throw new Error('ID es requerido para actualizar');
      }

      const payload = {
        name: productionLineData.name,
        code: productionLineData.code,
        capacityUnitsPerHour: Number(productionLineData.capacityUnitsPerHour),
        plantId: Number(productionLineData.plantId)
      };

      const response = await http.put(`${productionLinesEndpoint}/${productionLineData.id}`, payload);
      return ProductionLineAssembler.toEntityFromResource(response.data);
    } catch (err) {
      console.error(`Error al actualizar la línea de producción ${productionLineData.id}:`, err);
      throw err;
    }
  }

  static async deleteProductionLine(id) {
    try {
      await http.delete(`${productionLinesEndpoint}/${id}`);
      return true;
    } catch (err) {
      console.error(`Error al eliminar la línea de producción ${id}:`, err);
      throw err;
    }
  }

  static async changeProductionLineStatus(id, status) {
    try {
      const response = await http.patch(`${productionLinesEndpoint}/${id}/status`, { status });
      return ProductionLineAssembler.toEntityFromResource(response.data);
    } catch (err) {
      console.error(`Error al cambiar el estado de la línea de producción ${id}:`, err);
      throw err;
    }
  }
}


