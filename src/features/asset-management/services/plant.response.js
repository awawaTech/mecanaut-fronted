/**
 * Representa la estructura de datos tal como llega de la API
 */
export class PlantResource {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
        this.address = data.address;
        this.city = data.city;
        this.country = data.country;
        this.contactPhone = data.contactPhone;
        this.contactEmail = data.contactEmail;
        this.active = data.active;
    }
}

/**
 * Estructura para crear una nueva planta
 */
export class CreatePlantResource {
    constructor(data = {}) {
        this.name = data.name;
        this.address = data.address;
        this.city = data.city;
        this.country = data.country;
        this.contactPhone = data.contactPhone;
        this.contactEmail = data.contactEmail;
    }
}

/**
 * Estructura para actualizar una planta existente
 */
export class UpdatePlantResource {
    constructor(data = {}) {
        this.name = data.name;
        this.address = data.address;
        this.city = data.city;
        this.country = data.country;
        this.contactPhone = data.contactPhone;
        this.contactEmail = data.contactEmail;
    }
}
