// execution.service.js
import ApiService from '@/core/services/api.service';
import { WorkOrderExecutionAssembler } from './execution.assembler';
import { ExecutionAssembler } from './execution.assembler';
import axios from 'axios';
const apiService = new ApiService();

export default class ExecutionService {
  /**
   * Obtiene todas las plantas disponibles
   * @returns {Promise<Array>} - Lista de plantas
   */
  static async getPlants() {
    try {
      const response = await apiService.get('/plants');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo plantas:', error);
      return [];
    }
  }

  /**
   * Obtiene líneas de producción por planta
   * @param {number} plantId - ID de la planta
   * @returns {Promise<Array>} - Lista de líneas de producción
   */
  static async getProductionLines(plantId) {
    try {
      const response = await apiService.get(`/production-lines/plant/${plantId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo líneas de producción:', error);
      return [];
    }
  }


  /**
   * Obtiene órdenes de trabajo por línea de producción
   * @param {number} productionLineId - ID de la línea de producción (opcional)
   * @returns {Promise<Array>} - Lista de órdenes de trabajo
   */
  static async getWorkOrders(productionLineId = null) {
    try {
      let endpoint;
      
      if (productionLineId) {
        endpoint = `work-orders/by-production-line/${productionLineId}`;
      } else {
        // Si no hay línea seleccionada, obtener todas las órdenes
        endpoint = 'work-orders';
      }
      
      const response = await apiService.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo órdenes de trabajo:', error);
      return [];
    }
  }

  /**
   * Obtiene una orden de trabajo específica
   * @param {number} orderId - ID de la orden de trabajo
   * @returns {Promise<Object>} - Orden de trabajo
   */
  static async getWorkOrder(orderId) {
    try {
      const response = await apiService.get(`/work-orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo orden de trabajo:', error);
      throw error;
    }
  }

  /**
   * Obtiene maquinarias por línea de producción
   * @param {number} productionLineId - ID de la línea de producción
   * @returns {Promise<Array>} - Lista de maquinarias
   */
  static async getMachineries(productionLineId) {
    try {
      const response = await axios.get(`https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/v1/machines/production-line/${productionLineId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo maquinarias:', error);
      return [];
    }
  }

  /**
   * Obtiene maquinarias por orden de trabajo
   * @param {number} workOrderId - ID de la orden de trabajo
   * @returns {Promise<Array>} - Lista de maquinarias
   */
  static async getMachineriesByWorkOrder(workOrderId) {
    try {
      const order = await this.getWorkOrder(workOrderId);
      if (order.machineIds && order.machineIds.length > 0) {
        // Obtener las maquinarias específicas de la orden
        const machineries = [];
        for (const machineId of order.machineIds) {
          try {
            const response = await apiService.get(`/machines/${machineId}`);
            machineries.push(response.data);
          } catch (error) {
            console.error(`Error obteniendo máquina ${machineId}:`, error);
          }
        }
        return machineries;
      }
      return [];
    } catch (error) {
      console.error('Error obteniendo maquinarias por orden de trabajo:', error);
      return [];
    }
  }

  /**
   * Obtiene productos/repuestos por planta
   * @param {number} plantId - ID de la planta
   * @returns {Promise<Array>} - Lista de productos
   */
  static async getInventoryParts(plantId) {
    try {
      const response = await axios.get(`https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/inventory-parts?plantId=${plantId}`);
      console.log('BBBBBBBBBB', response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      
      console.log('CCCCCCCCCC', error);
      return [];
    }
  }

  /**
   * Obtiene órdenes de trabajo con sus maquinarias completas para mostrar en tarjetas
   * @param {number} productionLineId - ID de la línea de producción (opcional)
   * @returns {Promise<Array>} - Lista de órdenes con maquinarias
   */
  static async getWorkOrdersWithMachineries(productionLineId = null) {
    try {
      // Obtener órdenes asignadas
      const orders = await this.getWorkOrders(productionLineId);

      // Para cada orden, obtener sus maquinarias usando los machineIds
      const ordersWithMachineries = [];
      for (const order of orders) {
        try {
          const machineries = [];
          
          // Obtener cada máquina por su ID
          if (order.machineIds && order.machineIds.length > 0) {
            for (const machineId of order.machineIds) {
              try {
                const response = await apiService.get(`/machines/${machineId}`);
                machineries.push(response.data);
              } catch (error) {
                console.error(`Error obteniendo máquina ${machineId}:`, error);
                // Agregar una máquina placeholder si no se puede obtener
                machineries.push({
                  id: machineId,
                  name: `Máquina ${machineId}`,
                  status: 'Unknown'
                });
              }
            }
          }
          
          ordersWithMachineries.push({
            ...order,
            machineries: machineries
          });
        } catch (error) {
          console.error(`Error procesando orden ${order.id}:`, error);
          ordersWithMachineries.push({
            ...order,
            machineries: []
          });
        }
      }

      return ordersWithMachineries;
    } catch (error) {
      console.error('Error obteniendo órdenes con maquinarias:', error);
      return [];
    }
  }

  /**
   * Completa una orden de trabajo
   * @param {number} orderId - ID de la orden de trabajo
   * @param {Object} completionData - Datos de completado (tareas, observaciones, productos)
   * @returns {Promise<Object>} - Respuesta de la completación
   */
  static async completeWorkOrder(orderId, completionData) {
    try {
      const executedOrderData = {
        code: completionData.code,
        annotations: completionData.observations || '',
        executionDate: new Date().toISOString(),
        productionLineId: completionData.productionLineId,
        intervenedMachineIds: completionData.machineIds || [],
        assignedTechnicianIds: completionData.technicianIds || [],
        executedTasks: completionData.tasks.map(t => t.task),
        usedProducts: completionData.products,
        files: completionData.images || [],
        workOrderId: orderId
      };

      const response = await apiService.post('/executed-work-orders', executedOrderData);
      return response.data;
    } catch (error) {
      console.error('Error completando orden de trabajo:', error);
      throw error;
    }
  }

  static async decreaseInventoryPart(partId, quantity) {
    try {
      const response = await axios.put(`https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/inventory-parts/${partId}/decrease`, quantity);
      return response.data;
    } catch (error) {
      console.error('Error reduciendo stock:', error);
      throw error;
    }
  }

  /**
   * Sube una imagen al servidor
   * @param {File} file - Archivo de imagen a subir
   * @returns {Promise<Object>} - Respuesta con la URL de la imagen subida
   */
  static async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/image-storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  }

  /**
   * Guarda una orden de trabajo ejecutada
   * @param {Object} executedOrderData - Datos de la orden ejecutada
   * @returns {Promise<Object>} - Respuesta del guardado
   */
  static async saveExecutedWorkOrder(executedOrderData) {
    try {
      const response = await apiService.post('executed-work-orders', executedOrderData);
      return response.data;
    } catch (error) {
      console.error('Error guardando orden ejecutada:', error);
      throw error;
    }
  }

  /**
   * Obtiene una orden de trabajo ejecutada por ID
   * @param {number} executedOrderId - ID de la orden ejecutada
   * @returns {Promise<Object>} - Orden ejecutada
   */
  static async getExecutedWorkOrder(executedOrderId) {
    try {
      const response = await apiService.get(`/executed-work-orders/${executedOrderId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo orden ejecutada:', error);
      throw error;
    }
  }

  /**
   * Obtiene órdenes de trabajo ejecutadas por línea de producción
   * @param {number} productionLineId - ID de la línea de producción
   * @returns {Promise<Array>} - Lista de órdenes ejecutadas
   */
  static async getExecutedWorkOrdersByProductionLine(productionLineId) {
    try {
      const response = await apiService.get(`/executed-work-orders/production-line/${productionLineId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo órdenes ejecutadas por línea de producción:', error);
      throw error;
    }
  }
}
