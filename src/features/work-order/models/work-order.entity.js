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
  productionLine;
  type;
  status;
  description;
  priority;
  technicians;
  createdAt;
  updatedAt;
  createdBy;
  updatedBy;

  constructor(data = {}) {
    this.id = data.id;
    this.code = data.code || '';
    this.date = data.date || '';
    this.productionLine = data.productionLine || '';
    this.type = data.type || '';
    this.status = data.status || 'pending';
    this.description = data.description || '';
    this.priority = data.priority || 'medium';
    this.technicians = (data.technicians || []).map(tech => new WorkOrderTechnician(tech));
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
    this.createdBy = data.createdBy;
    this.updatedBy = data.updatedBy;
  }
}