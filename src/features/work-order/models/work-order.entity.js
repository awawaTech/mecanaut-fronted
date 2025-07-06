export class WorkOrderTechnician {
  id;
  name;
  email;
  machines;
  assignedAt;

  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name || '';
    this.email = data.email;
    this.machines = data.machines || [];
    this.assignedAt = data.assignedAt ? new Date(data.assignedAt) : new Date();
  }
}

export class WorkOrderEntity {
  id;
  code;
  date;
  productionLineId;
  type;
  status;
  machineIds;
  technicianIds;
  tasks;
  technicians;
  createdAt;
  updatedAt;
  createdBy;
  updatedBy;

  constructor(data = {}) {
    this.id = data.id;
    this.code = data.code || '';
    this.date = data.date || '';
    this.productionLineId = data.productionLineId || data.productionLine || '';
    this.type = data.type || '';
    this.status = data.status || 'Pending';
    this.machineIds = data.machineIds || [];
    this.technicianIds = data.technicianIds || [];
    this.tasks = data.tasks || [];
    
    this.technicians = (data.technicians || []).map(tech => new WorkOrderTechnician(tech));
    
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
  }

  get productionLine() {
    const productionLines = {
      1: 'L-01',
      2: 'L-02',
      3: 'L-03'
    };
    return productionLines[this.productionLineId] || `L-${this.productionLineId}`;
  }

  toApiFormat() {
    return {
      id: this.id,
      code: this.code,
      date: this.date,
      productionLineId: this.productionLineId,
      type: this.type,
      machineIds: this.machineIds,
      technicianIds: this.technicianIds,
      tasks: this.tasks
    };
  }
}