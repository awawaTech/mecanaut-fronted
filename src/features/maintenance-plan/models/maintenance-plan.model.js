/**
 * Modelo que representa un plan de mantenimiento
 */
export class MaintenancePlanModel {
  constructor({
    planId = null,
    productionLineId = null,
    startDate = null,
    durationDays = 0,
    userCreator = null,
    items = []
  } = {}) {
    this.planId = planId;
    this.productionLineId = productionLineId;
    this.startDate = startDate instanceof Date ? startDate : new Date(startDate);
    this.durationDays = durationDays;
    this.userCreator = userCreator;
    this.items = items.map(item => new MaintenancePlanItemModel(item));
  }
}

/**
 * Modelo que representa un ítem dentro del plan de mantenimiento (un día específico)
 */
export class MaintenancePlanItemModel {
  constructor({
    dayNumber = 0,
    tasks = []
  } = {}) {
    this.dayNumber = dayNumber;
    this.tasks = tasks.map(task => new MaintenancePlanTaskModel(task));
  }
}

/**
 * Modelo que representa una tarea dentro de un ítem del plan de mantenimiento
 */
export class MaintenancePlanTaskModel {
  constructor({
    taskId = null,
    taskName = '',
    taskDescription = '',
    machineIds = []
  } = {}) {
    this.taskId = taskId;
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.machineIds = machineIds;
  }
} 