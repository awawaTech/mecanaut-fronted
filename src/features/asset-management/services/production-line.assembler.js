import {ProductionLineResponse} from "@/features/asset-management/services/production-line.response.js";
import {ProductionLineEntity} from "@/features/asset-management/models/production-line.entity.js";
export class ProductionLineAssembler {
  static toEntitiesFromResponse(response) {
    if (!Array.isArray(response.data)) {
      console.error('Expected an array in response.data but got:', response.data);
      return [];
    }

    return response.data.map(resource => this.toEntityFromResource(resource));
  }

  static toEntityFromResource(resource) {
    if (!resource) {
      throw new Error('Resource is undefined or null');
    }

    return new ProductionLineEntity({
      id: resource.id,
      name: resource.name,
      code: resource.code,
      capacityUnitsPerHour: resource.capacityUnitsPerHour,
      status: resource.status,
      plantId: resource.plantId
    });
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      capacityUnitsPerHour: entity.capacityUnitsPerHour,
      status: entity.status,
      plantId: entity.plantId
    };
  }
}
