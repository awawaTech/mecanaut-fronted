import { MaintenanceDynamicPlanModel } from "../models/maintenance-dynamic-plan.model.js";
import { MaintenancePlanTaskModel } from "../models/maintenance-plan.model.js";
import { MaintenanceDynamicPlanListResponse } from "../models/maintenance-dynamic-plan.response.js";

export class MaintenanceDynamicPlanAssembler {

  static toModel(resource) {
    if (!resource) {
      console.warn('Recurso vacío pasado a toModel');
      return new MaintenanceDynamicPlanModel();
    }
    
    console.log('Convirtiendo recurso a modelo:', resource); // Depuración
    
    const safe = {
      id: resource.id || 0,
      dynamicPlanId: resource.dynamicPlanId || 0,
      planName: resource.planName || '',
      machineIds: Array.isArray(resource.machineIds) ? resource.machineIds : [],
      parameter: resource.parameter || '',
      userCreator: resource.userCreator || 0,
      tasks: Array.isArray(resource.tasks) ? resource.tasks : [],
    };

    return new MaintenanceDynamicPlanModel(safe);
  }

  /* ---------- lista desde respuesta ---------- */
  static toModelList(apiRawResponse) {
    const wrapped = new MaintenanceDynamicPlanListResponse(apiRawResponse);
    return wrapped.data.map((r) => this.toModel(r));
  }

  /* ---------- modelo → recurso (para POST/PUT) ---------- */
  static toApiFormat(model) {
    return {
      id: model.dynamicPlanId,
      dynamicPlanId: model.dynamicPlanId,
      planName: model.planName,
      machineIds: Array.isArray(model.machineIds) ? model.machineIds : [],
      parameter: model.parameter,
      userCreator: model.userCreator,
      tasks: model.tasks.map((t) => ({
        taskId: t.taskId,
        taskName: t.taskName,
        taskDescription: t.taskDescription,
        machineIds: Array.isArray(t.machineIds) ? t.machineIds : [],
      })),
    };
  }
} 