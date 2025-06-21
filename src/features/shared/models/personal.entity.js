export class PersonalEntity {
    constructor({
                    id = 0,
                    code='',
                    first_name = '',
                    last_name = '',
                    dni = '',
                    phone = '',
                    email = '',
                    role = '', // 'technician' or 'admin'
                    note = ''
                }) {
        this.id = id;
        this.code = code;
        this.firstName = first_name;
        this.lastName = last_name;
        this.dni = dni;
        this.phone = phone;
        this.email = email;
        this.role = role;
        this.note = note;
    }
}
