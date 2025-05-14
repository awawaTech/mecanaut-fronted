// inventory-parts-api.service.ts
import axios from 'axios';

import { InventoryPartAssembler } from './inventory-part.assembler.js';
import { PurchaseOrderAssembler } from './purchase-order.assembler.js';

const baseEndpoint = 'http://localhost:3000';
const inventoryPartsEndpoint = `${baseEndpoint}/inventory-parts`;
const purchaseOrdersEndpoint = `${baseEndpoint}/purchase-orders`;

const http = axios.create({
    baseURL: baseEndpoint
})
 

// URL base para json-server


export class InventoryPartsApiService {
    static async getParts() {
        try {
            const response = await http.get('/inventoryParts');
            return InventoryPartAssembler.toEntitiesFromResponse(response);
        } catch (err) {
            console.error('Error cargando partes:', err);
            return [];
        }
    }

    
    static async getPartById(id) {
        try {
            // Obtenemos la parte del inventario
            const inventoryPartResponse = await http.get(`/inventoryParts/${id}`);
            
            // Obtenemos las órdenes de compra relacionadas
            const purchaseOrdersResponse = await http.get(`/purchaseOrders?inventory_part_id=${id}`);
            
            // Combinamos la información
            const completeData = {
                ...inventoryPartResponse.data,
                purchaseOrders: PurchaseOrderAssembler.toEntitiesFromResponse({
                    data: purchaseOrdersResponse.data
                })
            };
            
            return InventoryPartAssembler.toEntityFromResource(completeData);
        } catch (err) {
            console.error(`Error cargando parte ${id}:`, err);
            throw err;
        }
    }

    static async createPart(partData) {
        try {
            if (!partData.code || !partData.name) {
                throw new Error("El código y nombre son obligatorios");
            }
            
            const resourceData = InventoryPartAssembler.toResourceFromEntity(partData);
            
            const response = await http.post(inventoryPartsEndpoint, resourceData);
            
            return InventoryPartAssembler.toEntityFromResource(response.data);
        } catch (err) {
            console.error('Error creando parte:', err);
            throw err;
        }
    }

    static async updatePart(id, partData) {
        try {
            const resourceData = InventoryPartAssembler.toResourceFromEntity({
                ...partData,
                id
            });
            
            const response = await http.put(`${inventoryPartsEndpoint}/${id}`, resourceData);
            
            return InventoryPartAssembler.toEntityFromResource(response.data);
        } catch (err) {
            console.error(`Error actualizando parte ${id}:`, err);
            throw err;
        }
    }

    static async deletePart(id) {
        try {
            await http.delete(`${inventoryPartsEndpoint}/${id}`);
            return true;
        } catch (err) {
            console.error(`Error eliminando parte ${id}:`, err);
            throw err;
        }
    }
}
