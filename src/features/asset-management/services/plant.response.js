export class PlantResource {
    constructor({
                    id = 0,
                    name = '',
                    address = '',
                    city = '',
                    country = '',
                    phone = '',
                    email = '',
                    active = true
                } = {}) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.city = city;
        this.country = country;
        this.phone = phone;
        this.email = email;
        this.active = active;
    }
}

export class PlantResponse {
    constructor(data = []) {
        this.data = data;
        this.info = {
            count: data.length
        };
    }
}
