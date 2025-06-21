export class WorkOrderTechnicianResponse {
  id;
  name;
  email;
  machines;
  assigned_at;

  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.machines = data.machines;
    this.assigned_at = data.assigned_at;
  }
}

export class WorkOrderResponse {
  id;
  code;
  date;
  production_line;
  type;
  status;
  description;
  priority;
  technicians;
  created_at;
  updated_at;
  created_by;
  updated_by;

  constructor(data = {}) {
    this.id = data.id;
    this.code = data.code;
    this.date = data.date;
    this.production_line = data.production_line;
    this.type = data.type;
    this.status = data.status;
    this.description = data.description;
    this.priority = data.priority;
    this.technicians = data.technicians?.map(tech => new WorkOrderTechnicianResponse(tech)) || [];
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.created_by = data.created_by;
    this.updated_by = data.updated_by;
  }
}
