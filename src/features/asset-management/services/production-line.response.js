
/**
 * Representa la estructura de datos tal como llega de la API
 */
export class ProductionLineResource {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.code = data.code;
    this.maxUnitsPerHour = data.maxUnitsPerHour;
    this.unit = data.unit;
    this.status = data.status;
    this.plantId = data.plantId;
  }
}

/**
 * Estructura para crear una nueva línea de producción
 */
export class CreateProductionLineResource {
  constructor(data = {}) {
    this.name = data.name;
    this.code = data.code;
    this.maxUnitsPerHour = data.maxUnitsPerHour;
    this.unit = data.unit;
    this.plantId = data.plantId;
  }
}

/**
 * Estructura para actualizar una línea de producción existente
 */
export class UpdateProductionLineResource {
  constructor(data = {}) {
    this.name = data.name;
    this.code = data.code;
    this.maxUnitsPerHour = data.maxUnitsPerHour;
    this.unit = data.unit;
    this.plantId = data.plantId;
  }
}
