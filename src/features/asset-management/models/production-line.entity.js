/**
 * Representa una línea de producción en el sistema
 */
export class ProductionLineEntity {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.code = data.code;
    this.capacityUnitsPerHour = data.capacityUnitsPerHour;
    this.unit = data.unit;
    this.status = data.status;
    this.plantId = data.plantId;
  }
}

/**
 * Enumeración para los posibles estados de una línea de producción
 */
export class ProductionLineStatus {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
  }
}
