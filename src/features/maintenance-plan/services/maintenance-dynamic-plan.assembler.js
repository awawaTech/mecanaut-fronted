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
    
    // Mapear desde la estructura de la API a nuestro modelo interno
    const safe = {
      id: resource.id || 0,
      dynamicPlanId: resource.id || 0, // Usar id como dynamicPlanId
      planName: resource.name || '',
      machineIds: Array.isArray(resource.machineIds) ? resource.machineIds : [],
      parameter: resource.metricId || '',
      amount: resource.amount || '',
      userCreator: 1, // Por defecto
      tasks: Array.isArray(resource.tasks) ? 
        resource.tasks.map((task, index) => ({
          taskId: index + 1,
          taskName: task.name || `Tarea ${index + 1}`,
          taskDescription: task.description || '',
          machineIds: Array.isArray(resource.machineIds) ? [...resource.machineIds] : []
        })) : [],
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
      name: model.planName,
      metricId: model.parameter,
      amount: model.amount.toString(),
      productionLineId: "1", // Valor por defecto
      plantLineId: "1", // Valor por defecto
      machines: Array.isArray(model.machineIds) ? model.machineIds : [],
      tasks: model.tasks.map((t) => t.taskDescription),
    };
  }
} 