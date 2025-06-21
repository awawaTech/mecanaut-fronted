import {PersonalResponse, PersonalResource } from "@/features/shared/services/personal.response.js";
import {PersonalEntity} from "@/features/shared/models/personal.entity.js";

export class PersonalAssembler {
    static toEntitiesFromResponse(response) {
        if (!response.data) {
            console.error('Unexpected response:', response);
            return [];
        }

        const personalResponse = new PersonalResponse(response.data);

        return personalResponse.data.map(resource => this.toEntityFromResource(resource));
    }

    static toEntityFromResource(resource) {
        if (!resource) {
            throw new Error('Resource is undefined or null');
        }

        return new PersonalEntity({
            id: resource.id || resource._id,
            code: resource.code || resource.code,
            first_name: resource.first_name,
            last_name: resource.last_name,
            dni: resource.dni,
            phone: resource.phone,
            email: resource.email,
            role: resource.role,
            note: resource.note
        });
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            code: entity.code || entity.code,
            first_name: entity.firstName,
            last_name: entity.lastName,
            dni: entity.dni,
            phone: entity.phone,
            email: entity.email,
            role: entity.role,
            note: entity.note
        };
    }
}
