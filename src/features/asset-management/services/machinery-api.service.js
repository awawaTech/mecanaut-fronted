import ApiService from '../../../core/services/api.service.js'

const apiService = new ApiService()

export class MachineryApiService {

  static async getMachines() {
    try {
      const response = await apiService.get('machines');
      return response.data;
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw new Error('Error al cargar las máquinas');
    }
  }

  static async getMachinesByProductionLine(productionLineId) {
    try {
      const response = await apiService.get(`machines/production-line/${productionLineId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching machines by production line:', error);
      throw new Error('Error al cargar las máquinas de la línea de producción');
    }
  }

  static async getMachinesByPlant(plantId) {
    try {
      const response = await apiService.get(`machines/plant/${plantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching machines by plant:', error);
      throw new Error('Error al cargar las máquinas de la planta');
    }
  }
  
  static async getMachineById(machineId) {
    try {
      const response = await apiService.get(`machines/${machineId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching machine:', error)
      throw new Error('Error al cargar la máquina')
    }
  }

  static async createMachine(machineData) {
    try {
      const response = await apiService.post('machines', machineData)
      // Si la respuesta es exitosa pero no tiene data, devolvemos un objeto con el id
      if (!response.data && response.status >= 200 && response.status < 300) {
        return { id: response.headers?.location?.split('/').pop() || null }
      }
      return response.data
    } catch (error) {
      // Si el error tiene status 400 pero la operación fue exitosa
      if (error.response?.status === 400 && error.response?.headers?.location) {
        const id = error.response.headers.location.split('/').pop()
        if (id) {
          return { id }
        }
      }
      // Si hay un error real, lo lanzamos
      throw new Error(`Error al crear la máquina: ${error.response?.data?.message || error.message}`)
    }
  }

  static async assignMachineToProductionLine(machineId, productionLineId) {
    try {
      const response = await apiService.put(`machines/${machineId}/assign`, {
        productionLineId: productionLineId
      })
      return response.data
    } catch (error) {
      throw new Error(`Error al asignar la máquina: ${error.response?.data?.message || error.message}`)
    }
  }

  static async updateMachine(machineId, machineData) {
    try {
      const response = await apiService.put(`machines/${machineId}`, machineData)
      return response.data
    } catch (error) {
      console.error('Error updating machine:', error)
      throw new Error('Error al actualizar la máquina')
    }
  }

  static async deleteMachine(machineId) {
    try {
      const response = await apiService.delete(`machines/${machineId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting machine:', error)
      throw new Error('Error al eliminar la máquina')
    }
  }

  // Métricas predefinidas disponibles
  static getAvailableMetrics() {
    return [
      {
        "id": 1,
        "name": "Kilometraje",
        "unit": "km"
      },
      {
        "id": 2,
        "name": "Horas de uso",
        "unit": "h"
      },
      {
        "id": 3,
        "name": "Ciclos de trabajo",
        "unit": "ciclos"
      },
      {
        "id": 4,
        "name": "Horas de motor",
        "unit": "h"
      },
      {
        "id": 5,
        "name": "Temperatura",
        "unit": "°C"
      },
      {
        "id": 6,
        "name": "Presión",
        "unit": "bar"
      },
      {
        "id": 7,
        "name": "Vibración",
        "unit": "mm/s"
      }
    ]
  }
} 