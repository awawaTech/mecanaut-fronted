// inventory-part.entity.ts

export class InventoryPartEntity {
    constructor({
        id = 0,
        code = '',
        name = '',
        description = '',
        currentStock = 0,
        minStock = 0,
        unitPrice = 0,
        stockStatus = '',
        purchaseOrders = []
    }) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.unitPrice = unitPrice;
        this.stockStatus = stockStatus;
        this.purchaseOrders = purchaseOrders;
    }
}
