import {PlantResponse} from "@/features/asset-management/services/plant.response.js";
import {PlantEntity} from "@/features/asset-management/models/plant.entity.js";

export class PlantAssembler {
  static toEntitiesFromResponse(response) {
    if (!response.data) {
      console.error('Unexpected response:', response);
      return [];
    }

    const plantResponse = new PlantResponse(response.data);

    return plantResponse.data.map(resource => this.toEntityFromResource(resource));
  }

  static toEntityFromResource(resource) {
    if (!resource) {
      throw new Error('Resource is undefined or null');
    }

    return new PlantEntity({
      id: resource.id,
      name: resource.name,
      address: resource.address,
      city: resource.city,
      country: resource.country,
      phone: resource.phone,
      email: resource.email,
      active: resource.active
    });
  }

  static toResourceFromEntity(entity) {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address,
      city: entity.city,
      country: entity.country,
      phone: entity.phone,
      email: entity.email,
      active: entity.active
    };
  }
}
