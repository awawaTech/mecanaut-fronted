export class ProductionLineResource {
  constructor({
                id = 0,
                name='',
                code = '',
                capacityUnitsPerHour= 0,
                status = '',
                plantId = 0,
              } = {}) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.capacityUnitsPerHour = capacityUnitsPerHour;
    this.status = status;
    this.plantId = plantId;
  }
}

export class ProductionLineResponse {
  constructor(data = []) {
    this.data = data;
    this.info = {
      count: data.length
    };
  }
}



