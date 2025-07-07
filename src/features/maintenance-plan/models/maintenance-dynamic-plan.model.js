import { MaintenancePlanTaskModel } from "./maintenance-plan.model.js";

export class MaintenanceDynamicPlanModel {
  constructor({
    id = 0,
    dynamicPlanId = 0,
    planName = '',
    machineIds = [],
    parameter = '',
    amount = '',
    userCreator = 0,
    tasks = [],
  } = {}) {
    this.id = id;
    this.dynamicPlanId = dynamicPlanId;
    this.planName = planName;
    // Asegurarse que machineIds es un array
    this.machineIds = Array.isArray(machineIds) ? machineIds : [];
    this.parameter = parameter;
    this.amount = amount;
    this.userCreator = userCreator;
    
    // Asegurarse que tasks es un array y mapearlo correctamente
    // Reutilizando MaintenancePlanTaskModel del modelo estático
    this.tasks = Array.isArray(tasks) 
      ? tasks.map(t => new MaintenancePlanTaskModel(t))
      : [];
  }
}

export class MaintenanceDynamicPlanTaskModel {
  constructor({
    taskId = null,
    taskName = '',
    taskDescription = '',
    completed = false,
    assignedTo = null,
  } = {}) {
    this.taskId = taskId;
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.completed = completed;
    this.assignedTo = assignedTo;
  }
} 