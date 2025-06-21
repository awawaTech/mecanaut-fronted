import { PlantResource, CreatePlantResource, UpdatePlantResource } from './plant.response';

export class PlantAssembler {
  /**
   * Convierte un recurso de planta de la API a una entidad para el front
   * @param {PlantResource} resource El recurso que llega de la API
   * @returns {Object} La entidad para usar en el front
   */
  static resourceToEntity(resource) {
    return {
      id: resource.id,
      name: resource.name,
      address: resource.address,
      city: resource.city,
      country: resource.country,
      contactPhone: resource.contactPhone,
      contactEmail: resource.contactEmail,
      active: resource.active
    };
  }

  /**
   * Convierte una entidad de planta a un recurso para la API
   * @param {Object} entity La entidad del front
   * @returns {PlantResource} El recurso para enviar a la API
   */
  static entityToResource(entity) {
    return new PlantResource({
      id: entity.id,
      name: entity.name,
      address: entity.address,
      city: entity.city,
      country: entity.country,
      contactPhone: entity.contactPhone,
      contactEmail: entity.contactEmail,
      active: entity.active
    });
  }

  /**
   * Convierte una entidad nueva de planta a un recurso para crear en la API
   * @param {Object} entity La entidad nueva
   * @returns {CreatePlantResource} El recurso para enviar a la API
   */
  static createEntityToResource(entity) {
    return new CreatePlantResource({
      name: entity.name,
      address: entity.address,
      city: entity.city,
      country: entity.country,
      contactPhone: entity.contactPhone,
      contactEmail: entity.contactEmail
    });
  }

  /**
   * Convierte una entidad para actualizar a un recurso para la API
   * @param {Object} entity La entidad con los campos actualizados
   * @returns {UpdatePlantResource} El recurso para enviar a la API
   */
  static updateEntityToResource(entity) {
    const updateData = {};
    if (entity.name !== undefined) updateData.name = entity.name;
    if (entity.address !== undefined) updateData.address = entity.address;
    if (entity.city !== undefined) updateData.city = entity.city;
    if (entity.country !== undefined) updateData.country = entity.country;
    if (entity.contactPhone !== undefined) updateData.contactPhone = entity.contactPhone;
    if (entity.contactEmail !== undefined) updateData.contactEmail = entity.contactEmail;
    return new UpdatePlantResource(updateData);
  }
}
