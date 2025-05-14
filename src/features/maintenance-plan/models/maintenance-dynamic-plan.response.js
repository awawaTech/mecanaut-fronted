import { MaintenanceDynamicPlanResource } from "./maintenance-dynamic-plan.resource.js";

export class ApiInfo {
  constructor({ registers = 0, status = 'success', message = '' } = {}) {
    this.registers = registers;
    this.status = status;
    this.message = message;
  }
}

export class MaintenanceDynamicPlanListResponse {
  constructor(data = []) {
    // No transformamos los datos al Resource, lo dejamos tal cual
    this.data = Array.isArray(data) ? data : [];
  }
} 