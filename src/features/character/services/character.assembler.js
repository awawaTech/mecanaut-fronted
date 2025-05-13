import {CharacterResponse, CharacterResource} from "./characters.response.js";
import {CharacterEntity} from "../models/character.entity.js";

export class CharacterAssembler {

    static toEntitiesFromResponse(response) {
        // JSON Server devuelve directamente el objeto del formato que definimos
        if (!response.data || !response.data.data) {
            console.error("Respuesta inesperada:", response);
            return [];
        }
        
        const characterResponse = new CharacterResponse(response.data);
        return characterResponse.data.map((character) => {
            return this.toEntityFromResource(character);
        });
    }

    static toEntityFromResource(resource) {
        return new CharacterEntity({
            id: resource._id,
            name: resource.name,
            createdAt: resource.createdAt,
            sourceUrl: resource.sourceUrl,
            imageUrl: resource.imageUrl,
            films: resource.films,
            tvShows: resource.tvShows,
        });
    }
    
    static toResourceFromEntity(entity) {
        // Asegurarnos que createdAt sea una fecha válida
        let createdAt;
        try {
            // Si es una fecha, usamos su valor ISO
            if (entity.createdAt instanceof Date && !isNaN(entity.createdAt)) {
                createdAt = entity.createdAt.toISOString();
            } else {
                // Si no es una fecha válida, usamos la fecha actual
                createdAt = new Date().toISOString();
            }
        } catch (error) {
            console.error("Error con la fecha:", error);
            createdAt = new Date().toISOString();
        }

        return {
            _id: entity.id,
            name: entity.name,
            films: entity.films || [],
            shortFilms: [],
            tvShows: entity.tvShows || [],
            videoGames: [],
            parkAttractions: [],
            allies: [],
            enemies: [],
            sourceUrl: entity.sourceUrl || "",
            imageUrl: entity.imageUrl || "",
            createdAt: createdAt,
            updatedAt: new Date().toISOString(),
            url: ""
        };
    }
}