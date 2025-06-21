import axios from 'axios';

import { InventoryPartAssembler } from '../../shared/services/inventory-part.assembler.js';
import { PurchaseOrderAssembler } from '../../shared/services/purchase-order.assembler.js';

const baseEndpoint = 'http://localhost:3000';
const purchaseOrdersEndpoint = `https://6854b3de6a6ef0ed662fcca2.mockapi.io/api/v1/purchase-orders`;
const inventoryPartsEndpoint = `https://6854b3de6a6ef0ed662fcca2.mockapi.io/api/v1/inventory-parts`;

const http = axios.create({
    baseURL: baseEndpoint
});

export class PurchaseOrdersApiService {
    static async getPurchaseOrders() {
        try {
            const response = await http.get(purchaseOrdersEndpoint);
            return PurchaseOrderAssembler.toEntitiesFromResponse(response);
        } catch (err) {
            console.error('Error cargando órdenes de compra:', err);
            return [];
        }
    }

    static async getPurchaseOrderById(id) {
        try {
            // Obtenemos la orden de compra
            const purchaseOrderResponse = await http.get(`${purchaseOrdersEndpoint}/${id}`);
            
            // Obtenemos la parte de inventario relacionada
            const inventoryPartResponse = await http.get(`${inventoryPartsEndpoint}/${purchaseOrderResponse.data.inventory_part_id}`);
            
            // Combinamos la información
            const completeData = {
                ...purchaseOrderResponse.data,
                inventoryPart: InventoryPartAssembler.toEntityFromResource(inventoryPartResponse.data)
            };
            
            return PurchaseOrderAssembler.toEntityFromResource(completeData);
        } catch (err) {
            console.error(`Error cargando orden de compra ${id}:`, err);
            throw err;
        }
    }

    static async createPurchaseOrder(purchaseOrderData) {
        try {
            if (!purchaseOrderData.inventory_part_id || !purchaseOrderData.quantity) {
                throw new Error("La parte de inventario y la cantidad son obligatorias");
            }
            
            const resourceData = PurchaseOrderAssembler.toResourceFromEntity(purchaseOrderData);
            
            const response = await http.post(purchaseOrdersEndpoint, resourceData);
            
            return PurchaseOrderAssembler.toEntityFromResource(response.data);
        } catch (err) {
            console.error('Error creando orden de compra:', err);
            throw err;
        }
    }

    static async updatePurchaseOrder(id, purchaseOrderData) {
        try {
            const resourceData = PurchaseOrderAssembler.toResourceFromEntity({
                ...purchaseOrderData,
                id
            });
            
            const response = await http.put(`${purchaseOrdersEndpoint}/${id}`, resourceData);
            
            return PurchaseOrderAssembler.toEntityFromResource(response.data);
        } catch (err) {
            console.error(`Error actualizando orden de compra ${id}:`, err);
            throw err;
        }
    }

    static async deletePurchaseOrder(id) {
        try {
            await http.delete(`${purchaseOrdersEndpoint}/${id}`);
            return true;
        } catch (err) {
            console.error(`Error eliminando orden de compra ${id}:`, err);
            throw err;
        }
    }
}
