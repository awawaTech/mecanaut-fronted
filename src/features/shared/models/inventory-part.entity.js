// inventory-part.entity.ts

export class InventoryPartEntity {
    constructor({
        id = 0,
        code = '',
        name = '',
        description = '',
        current_stock = 0,
        min_stock = 0,
        unit_price = 0,
        stock_status = '',
        last_restock = '',
        purchaseOrders = []
    }) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.currentStock = current_stock;
        this.minStock = min_stock;
        this.unitPrice = unit_price;
        this.stockStatus = stock_status;
        this.lastRestock = last_restock;
        this.purchaseOrders = purchaseOrders;
    }
}
