import ApiService from '../../../core/services/api.service.js'

const apiService = new ApiService()

export class MachineryApiService {
  static async getMachines(productionLineId = null) {
    try {
      let url = 'machines'
      if (productionLineId) {
        url = `machines/production-line/${productionLineId}`
      }
      
      const response = await apiService.get(url)
      console.log('Machines fetched successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching machines:', error)
      throw new Error('Error al cargar las máquinas')
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
      return response.data
    } catch (error) {
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