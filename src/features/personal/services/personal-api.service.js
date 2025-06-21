import axios from 'axios';
import { PersonalAssembler } from '../../shared/services/personal.assembler.js';

const baseEndpoint = 'http://localhost:3000';
const personalsEndpoint = `${baseEndpoint}/personals`;

const http = axios.create({
    baseURL: baseEndpoint
});

export class PersonalApiService {
    static async getPersonals() {
        try {
            const response = await http.get('/personals');
            return PersonalAssembler.toEntitiesFromResponse(response);
        } catch (err) {
            console.error('Error loading personal list:', err);
            return [];
        }
    }

    static async getPersonalById(id) {
        try {
            const response = await http.get(`/personals/${id}`);
            return PersonalAssembler.toEntityFromResource(response.data);
        } catch (err) {
            console.error(`Error loading personal with ID ${id}:`, err);
            throw err;
        }
    }

    static async createPersonal(personalData) {
        try {
            if (!personalData.firstName || !personalData.lastName || !personalData.email) {
                throw new Error('First name, last name and email are required');
            }

            const resourceData = PersonalAssembler.toResourceFromEntity(personalData);

            const response = await http.post(personalsEndpoint, resourceData);

            return PersonalAssembler.toEntityFromResource(response.data);
        } catch (err) {
            console.error('Error creating personal:', err);
            throw err;
        }
    }

    static async updatePersonal(id, personalData) {
        try {
            const resourceData = PersonalAssembler.toResourceFromEntity({
                ...personalData,
                id
            });

            const response = await http.put(`${personalsEndpoint}/${id}`, resourceData);

            return PersonalAssembler.toEntityFromResource(response.data);
        } catch (err) {
            console.error(`Error updating personal ${id}:`, err);
            throw err;
        }
    }

    static async deletePersonal(id) {
        try {
            await http.delete(`${personalsEndpoint}/${id}`);
            return true;
        } catch (err) {
            console.error(`Error deleting personal ${id}:`, err);
            throw err;
        }
    }
}
