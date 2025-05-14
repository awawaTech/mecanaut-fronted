
export class MaintenancePlanModel {
  constructor({
    id = 0,                
    planId = 0,            
    planName = '',
    productionLineId = 0,
    startDate = '',
    durationDays = 1,
    userCreator = 0,
    items = [],
  } = {}) {
    this.id = id;
    this.planId = planId;
    this.planName = planName;
    this.productionLineId = productionLineId;
    this.startDate = startDate ? new Date(startDate) : new Date();
    this.durationDays = durationDays;
    this.userCreator = userCreator;
    this.items = items.map((i) => new MaintenancePlanItemModel(i));
  }
}


export class MaintenancePlanItemModel {
  constructor({ dayNumber = 0, tasks = [] } = {}) {
    this.dayNumber = Number(dayNumber);
    this.tasks = tasks.map((t) => new MaintenancePlanTaskModel(t));
  }
}



export class MaintenancePlanTaskModel {
  constructor({
    taskId = null,
    taskName = '',
    taskDescription = '',
    machineIds = [],
  } = {}) {
    this.taskId = taskId;
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.machineIds = Array.isArray(machineIds) ? machineIds : [];
  }
}
