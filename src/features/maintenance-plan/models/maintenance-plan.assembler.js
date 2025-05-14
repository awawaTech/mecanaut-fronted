import { MaintenancePlanModel } from './maintenance-plan.model';

/**
 * Clase para convertir datos entre el formato de la API y los modelos internos
 */
export class MaintenancePlanAssembler {
  
  /**
   * Convierte los datos de la API a un modelo MaintenancePlan
   * @param {Object} apiData - Datos obtenidos de la API
   * @returns {MaintenancePlanModel} - Modelo interno
   */
  static toModel(apiData) {
    if (!apiData) return null;
    
    return new MaintenancePlanModel({
      planId: apiData.planId,
      productionLineId: apiData.productionLineId,
      startDate: apiData.startDate,
      durationDays: apiData.durationDays,
      userCreator: apiData.userCreator,
      items: apiData.items || []
    });
  }

  /**
   * Convierte una lista de datos de la API a una lista de modelos MaintenancePlan
   * @param {Array} apiDataList - Lista de datos obtenidos de la API
   * @returns {Array<MaintenancePlanModel>} - Lista de modelos internos
   */
  static toModelList(apiDataList) {
    if (!apiDataList || !Array.isArray(apiDataList)) return [];
    
    return apiDataList.map(apiData => this.toModel(apiData));
  }

  /**
   * Convierte un modelo MaintenancePlan al formato esperado por la API
   * @param {MaintenancePlanModel} model - Modelo interno
   * @returns {Object} - Datos en formato para la API
   */
  static toApiFormat(model) {
    if (!model) return null;
    
    return {
      planId: model.planId,
      productionLineId: model.productionLineId,
      startDate: model.startDate instanceof Date ? model.startDate.toISOString() : model.startDate,
      durationDays: model.durationDays,
      userCreator: model.userCreator,
      items: model.items.map(item => ({
        dayNumber: item.dayNumber,
        tasks: item.tasks.map(task => ({
          taskId: task.taskId,
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          machineIds: task.machineIds
        }))
      }))
    };
  }
} 