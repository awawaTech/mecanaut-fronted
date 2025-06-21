export class PersonalResource {
    constructor({
                    id = 0,
                    code = 0,
                    first_name = '',
                    last_name = '',
                    dni = '',
                    phone = '',
                    email = '',
                    role = '',
                    note = ''
                } = {}) {
        this._id = id;
        this.code = code;
        this.first_name = first_name;
        this.last_name = last_name;
        this.dni = dni;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.note = note;
    }
}

export class PersonalResponse {
    constructor(data = []) {
        this.data = data;
        this.info = {
            count: data.length
        };
    }
}
