import { MaintenancePlanModel, MaintenancePlanItemModel, MaintenancePlanTaskModel } from "../models/maintenance-plan.model.js";
import { MaintenancePlanListResponse } from "../models/maintenance-plan.response.js";


export class MaintenancePlanAssembler {
  /* ---------- recurso plano → modelo ---------- */
  static toModel(resource) {
    const safe = {
      ...resource,
      items: Array.isArray(resource.items) ? resource.items : [],
    };

    return new MaintenancePlanModel({
      ...safe,
      items: safe.items.map((it) =>
        new MaintenancePlanItemModel({
          ...it,
          tasks: Array.isArray(it.tasks)
            ? it.tasks.map((t) => new MaintenancePlanTaskModel(t))
            : [],
        })
      ),
    });
  }

  /* ---------- lista desde respuesta ---------- */
  static toModelList(apiRawResponse) {
    const wrapped = new MaintenancePlanListResponse(apiRawResponse);
    return wrapped.data.map((r) => this.toModel(r));
  }

  /* ---------- modelo → recurso (para POST/PUT) ---------- */
  static toResource(model) {
    return {
      id: model.planId,
      planId: model.planId,
      planName: model.planName,
      productionLineId: model.productionLineId,
      startDate:
        model.startDate instanceof Date
          ? model.startDate.toISOString()
          : model.startDate,
      durationDays: model.durationDays,
      userCreator: model.userCreator,
      items: model.items.map((d) => ({
        dayNumber: d.dayNumber,
        tasks: d.tasks.map((t) => ({
          taskId: t.taskId,
          taskName: t.taskName,
          taskDescription: t.taskDescription,
          machineIds: t.machineIds,
        })),
      })),
    };
  }
}