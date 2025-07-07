import axios from "axios";
import {CharacterAssembler} from "./character.assembler.js";

// URL base para json-server
const baseEndpoint = "https://mecanautbk-fffeemd3bqdwebce.centralus-01.azurewebsites.net/api/v1";
const charactersEndpoint = "/characters";

const http = axios.create({
    baseURL: baseEndpoint
})

export class CharactersApiService {
    static async getCharacters() {
        try {
            const response = await http.get(charactersEndpoint);
            return CharacterAssembler.toEntitiesFromResponse(response);
        } catch (err) {
            console.error('Error cargando personajes:', err);
            return [];
        }
    }

    static async getCharacterById(id) {
        try {
            const response = await http.get(`${charactersEndpoint}?data._id=${id}`);
            const characters = CharacterAssembler.toEntitiesFromResponse(response);
            return characters.length > 0 ? characters[0] : null;
        } catch (err) {
            console.error(`Error cargando personaje ${id}:`, err);
            throw err;
        }
    }

    static async createCharacter(characterData) {
        try {
            if (!characterData.name) {
                throw new Error("El nombre del personaje es obligatorio");
            }
            
            const resourceData = CharacterAssembler.toResourceFromEntity(characterData);
            console.log("resourceData", resourceData);
            
            // Obtenemos los datos actuales para actualizar la estructura
            const currentData = await http.get(charactersEndpoint);
            const currentCharacters = currentData.data;
            
            // Generamos un nuevo ID basado en el último personaje
            const newId = Math.max(...currentCharacters.data.map(c => c._id), 0) + 1;
            resourceData._id = newId;
            
            // Solo establecemos timestamps si no existen
            if (!resourceData.createdAt) {
                resourceData.createdAt = new Date().toISOString();
            }
            if (!resourceData.updatedAt) {
                resourceData.updatedAt = new Date().toISOString();
            }
            
            // Añadimos el nuevo personaje a la lista existente
            currentCharacters.data.push(resourceData);
            
            // Actualizamos el contador
            currentCharacters.info.count = currentCharacters.data.length;
            
            // Actualizamos todo el recurso (json-server requiere actualizar el objeto completo)
            await http.put(charactersEndpoint, currentCharacters);
            
            return CharacterAssembler.toEntityFromResource(resourceData);
        } catch (err) {
            console.error('Error creando personaje:', err);
            throw err;
        }
    }

    static async updateCharacter(id, characterData) {
        try {
            const resourceData = CharacterAssembler.toResourceFromEntity(characterData);
            
            // Obtenemos los datos actuales
            const currentData = await http.get(charactersEndpoint);
            const currentCharacters = currentData.data;
            
            // Encontramos el índice del personaje a actualizar
            const characterIndex = currentCharacters.data.findIndex(c => c._id === id);
            
            if (characterIndex === -1) {
                throw new Error(`Personaje con ID ${id} no encontrado`);
            }
            
            // Actualizamos los datos manteniendo el ID original
            resourceData._id = id;
            resourceData.updatedAt = new Date().toISOString();
            
            // Reemplazamos el personaje en el array
            currentCharacters.data[characterIndex] = {
                ...currentCharacters.data[characterIndex],
                ...resourceData
            };
            
            // Actualizamos todo el recurso
            await http.put(charactersEndpoint, currentCharacters);
            
            return CharacterAssembler.toEntityFromResource(resourceData);
        } catch (err) {
            console.error(`Error actualizando personaje ${id}:`, err);
            throw err;
        }
    }

    static async deleteCharacter(id) {
        try {
            // Obtenemos los datos actuales
            const currentData = await http.get(charactersEndpoint);
            const currentCharacters = currentData.data;
            
            // Filtramos el personaje a eliminar
            const updatedCharacters = {
                ...currentCharacters,
                data: currentCharacters.data.filter(c => c._id !== id),
                info: {
                    ...currentCharacters.info,
                    count: currentCharacters.data.length - 1
                }
            };
            
            // Actualizamos todo el recurso
            await http.put(charactersEndpoint, updatedCharacters);
            
            return true;
        } catch (err) {
            console.error(`Error eliminando personaje ${id}:`, err);
            throw err;
        }
    }
}