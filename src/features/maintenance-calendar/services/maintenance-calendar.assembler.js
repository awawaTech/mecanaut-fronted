import { MaintenanceCalendarModel, MaintenanceCalendarItemModel, MaintenanceCalendarTaskModel } from "../models/maintenance-calendar.model.js";
import { MaintenanceCalendarListResponse } from "../models/maintenance-calendar.response.js";


export class MaintenanceCalendarAssembler {
  /* ---------- recurso plano → modelo ---------- */
  static toModel(resource) {
    const safe = {
      ...resource,
      items: Array.isArray(resource.items) ? resource.items : [],
    };

    return new MaintenanceCalendarModel({
      ...safe,
      items: safe.items.map((it) =>
        new MaintenanceCalendarItemModel({
          ...it,
          tasks: Array.isArray(it.tasks)
            ? it.tasks.map((t) => new MaintenanceCalendarTaskModel(t))
            : [],
        })
      ),
    });
  }

  /* ---------- lista desde respuesta ---------- */
  static toModelList(apiRawResponse) {
    const wrapped = new MaintenanceCalendarListResponse(apiRawResponse);
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