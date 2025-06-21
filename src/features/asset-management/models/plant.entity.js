/**
 * Representa una planta en el sistema
 */
export class PlantEntity {
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
 * Enumeración para los posibles estados de una planta
 */
export class PlantStatus {
    constructor(data = {}) {
        this.id = data.id;
        this.name = data.name;
    }
}