import { WorkOrderEntity, WorkOrderTechnician } from '../models/work-order.entity';
import { WorkOrderResponse, WorkOrderTechnicianResponse } from './work-order.response';

export class WorkOrderAssembler {
  static toEntity(response) {
    if (!response) return null;
    
    const data = {
      id: response.id,
      code: response.code,
      date: response.date,
      productionLine: response.production_line,
      type: response.type,
      status: response.status,
      description: response.description,
      priority: response.priority,
      technicians: response.technicians?.map(tech => ({
        id: tech.id,
        name: tech.name,
        email: tech.email,
        machines: tech.machines,
        assignedAt: tech.assigned_at
      })),
      createdAt: response.created_at,
      updatedAt: response.updated_at,
      createdBy: response.created_by,
      updatedBy: response.updated_by
    };

    return new WorkOrderEntity(data);
  }

  static toResponse(entity) {
    if (!entity) return null;

    const data = {
      id: entity.id,
      code: entity.code,
      date: entity.date,
      production_line: entity.productionLine,
      type: entity.type,
      status: entity.status,
      description: entity.description,
      priority: entity.priority,
      technicians: entity.technicians?.map(tech => ({
        id: tech.id,
        name: tech.name,
        email: tech.email,
        machines: tech.machines,
        assigned_at: tech.assignedAt
      })),
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      created_by: entity.createdBy,
      updated_by: entity.updatedBy
    };

    return new WorkOrderResponse(data);
  }
}
