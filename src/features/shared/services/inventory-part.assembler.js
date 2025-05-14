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
            current_stock: resource.current_stock || 0,
            min_stock: resource.min_stock || 0,
            unit_price: resource.unit_price || 0,
            stock_status: resource.stock_status || this.calculateStockStatus(resource.current_stock, resource.min_stock),
            last_restock: resource.last_restock || new Date().toISOString(),
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
            current_stock: entity.currentStock,
            min_stock: entity.minStock,
            unit_price: entity.unitPrice,
            stock_status: this.calculateStockStatus(entity.currentStock, entity.minStock),
            last_restock: entity.lastRestock || now
        };
    }

    static calculateStockStatus(current, minimum) {
        if (!current || current === 0) return "OUT_OF_STOCK";
        if (current < minimum) return "LOW";
        if (current === minimum) return "MEDIUM";
        return "OK";
    }
}
