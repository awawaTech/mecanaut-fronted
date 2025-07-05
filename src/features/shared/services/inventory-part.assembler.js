import { InventoryPartResponse, InventoryPartResource } from "./inventory-parts.response.js";
import { InventoryPartEntity } from "../models/inventory-part.entity.js";

export class InventoryPartAssembler {
    static toEntitiesFromResponse(response) {
        if (!response.data) {
            console.error("Respuesta inesperada:", response);
            return [];
        }
        
        // Crear respuesta formateada
        const inventoryPartResponse = new InventoryPartResponse(response.data);
        
        // Mapear cada item a una entidad
        return inventoryPartResponse.data.map(part => this.toEntityFromResource(part));
    }

    static toEntityFromResource(resource) {
        // Verificamos si resource es undefined o null
        if (!resource) {
            throw new Error('Resource is undefined or null');
        }

        return new InventoryPartEntity({
            id: resource.id,
            code: resource.code,
            name: resource.name,
            description: resource.description,
            currentStock: resource.currentStock || 0,
            minStock: resource.minStock || 0,
            unitPrice: resource.unitPrice || 0,
            stockStatus: this.calculateStockStatus(resource.currentStock, resource.minStock),
            purchaseOrders: resource.purchaseOrders || []
        });
    }
    
    static toResourceFromEntity(entity) {
        const now = new Date().toISOString();

        return {
            id: entity.id,
            code: entity.code,
            name: entity.name,
            description: entity.description,
            currentStock: entity.currentStock,
            minStock: entity.minStock,
            unitPrice: entity.unitPrice,
            stockStatus: this.calculateStockStatus(entity.currentStock, entity.minStock)
        };
    }

    static calculateStockStatus(current, minimum) {
        if (!current || current === 0) return "OUT_OF_STOCK";
        if (current < minimum) return "LOW";
        if (current === minimum) return "MEDIUM";
        return "OK";
    }
}
