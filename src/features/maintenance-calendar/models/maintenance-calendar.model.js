
export class MaintenanceCalendarModel {
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
    this.items = items.map((i) => new MaintenanceCalendarItemModel(i));
  }
}


export class MaintenanceCalendarItemModel {
  constructor({ dayNumber = 0, tasks = [] } = {}) {
    this.dayNumber = Number(dayNumber);
    this.tasks = tasks.map((t) => new MaintenanceCalendarTaskModel(t));
  }
}



export class MaintenanceCalendarTaskModel {
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
