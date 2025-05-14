import { PurchaseOrderResponse, PurchaseOrderResource } from "./purchase-orders.response.js";
import { PurchaseOrderEntity } from "../models/purchase-order.entity.js";

export class PurchaseOrderAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;

        return new PurchaseOrderEntity({
            id: resource.id,
            inventory_part_id: resource.inventory_part_id,
            quantity: resource.quantity,
            price: resource.price,
            order_date: resource.order_date,
            received_date: resource.received_date,
            status: resource.status || 'PENDING',
            user_id: resource.user_id,
            inventoryPart: resource.inventoryPart
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;

        return new PurchaseOrderResource({
            id: entity.id,
            inventory_part_id: entity.inventory_part_id,
            quantity: entity.quantity,
            price: entity.price,
            order_date: entity.order_date,
            received_date: entity.received_date,
            status: entity.status,
            user_id: entity.user_id
        });
    }

    static toEntitiesFromResponse(response) {
        if (!response || !response.data) return [];
        
        const purchaseOrderResponse = new PurchaseOrderResponse(response.data);
        return purchaseOrderResponse.data.map(resource => this.toEntityFromResource(resource));
    }
}
