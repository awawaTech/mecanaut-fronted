import {
  ProductionLineResource,
  CreateProductionLineResource,
  UpdateProductionLineResource
} from './production-line.response';

/**
 * Clase responsable de transformar entre entidades de líneas de producción y recursos de la API
 */
export class ProductionLineAssembler {
  /**
   * Convierte un recurso de la API a una entidad
   * @param {Object} resource El recurso recibido de la API
   * @returns {Object|null} La entidad de línea de producción
   */
  static resourceToEntity(resource) {
    if (!resource) return null;

    return {
      id: resource.id,
      name: resource.name,
      code: resource.code,
      maxUnitsPerHour: resource.maxUnitsPerHour,
      unit: resource.unit,
      status: resource.status,
      plantId: resource.plantId
    };
  }

  /**
   * Convierte múltiples recursos a entidades
   * @param {Array<ProductionLineResource>} resources Los recursos recibidos de la API
   * @returns {Array<Object>} Lista de entidades de línea de producción
   */
  static resourcesToEntities(resources) {
    return resources.map(resource => this.resourceToEntity(resource));
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para crear)
   * @param {Object} entity La entidad de línea de producción
   * @returns {CreateProductionLineResource} El recurso para crear en la API
   */
  static entityToCreateResource(entity) {
    return new CreateProductionLineResource({
      name: entity.name,
      code: entity.code,
      maxUnitsPerHour: entity.maxUnitsPerHour,
      unit: entity.unit,
      plantId: entity.plantId
    });
  }

  /**
   * Convierte una entidad a un recurso para enviar a la API (para actualizar)
   * @param {Object} entity La entidad de línea de producción
   * @returns {UpdateProductionLineResource} El recurso para actualizar en la API
   */
  static entityToUpdateResource(entity) {
    return new UpdateProductionLineResource({
      name: entity.name,
      code: entity.code,
      maxUnitsPerHour: entity.maxUnitsPerHour,
      unit: entity.unit,
      plantId: entity.plantId
    });
  }

  /**
   * Convierte una entidad a un recurso para la API
   * @param {Object} entity La entidad de línea de producción
   * @returns {Object|null} El recurso para la API
   */
  static entityToResource(entity) {
    if (!entity) return null;

    return new ProductionLineResource({
      id: entity.id,
      name: entity.name,
      code: entity.code,
      maxUnitsPerHour: entity.maxUnitsPerHour,
      unit: entity.unit,
      status: entity.status,
      plantId: entity.plantId
    });
  }
}
