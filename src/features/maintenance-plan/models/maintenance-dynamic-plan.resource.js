export class MaintenanceDynamicPlanResource {
  constructor(data = {}) {
    this.id = data.id || 0;
    this.dynamicPlanId = data.dynamicPlanId || 0;
    this.planName = data.planName || '';
    this.machineIds = Array.isArray(data.machineIds) ? data.machineIds : [];
    this.parameter = data.parameter || '';
    this.userCreator = data.userCreator || 0;
    this.tasks = Array.isArray(data.tasks) ? data.tasks : [];
  }
} 