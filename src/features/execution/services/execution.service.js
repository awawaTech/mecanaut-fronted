// execution.service.js
import axios from 'axios';
import { WorkOrderExecutionAssembler } from './execution.assembler';
import { ExecutionAssembler } from './execution.assembler';

export default class ExecutionService {
  constructor() {
    this.baseUrl = 'https://6854cc676a6ef0ed6630159d.mockapi.io/api/v1/';
  }

  // Obtener todas las órdenes de trabajo
  async getWorkOrders() {
    const response = await axios.get(`${this.baseUrl}/workOrders`);
    return response.data.map(WorkOrderExecutionAssembler.fromResource);
  }

  // Obtener todas las maquinarias
  async getMachineries() {
    const response = await axios.get(`${this.baseUrl}/titleMachinery`);
    return response.data.map(ExecutionAssembler.fromResource);  // Convertir las maquinarias usando el assembler
  }

  // Obtener maquinarias por workOrderId
  async getMachineriesByWorkOrder(workOrderId) {
    const machineries = await this.getMachineries();
    return machineries.filter((m) => m.workOrderId === workOrderId);
  }
}
