export class InventoryPartResource {
    constructor({
        id = 0,
        code = '',
        name = '',
        description = '',
        currentStock = 0,
        minStock = 0,
        unitPrice = 0.00,
        stockStatus = ''
    } = {}) {
        this._id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.currentStock = currentStock;
        this.minStock = minStock;
        this.unitPrice = unitPrice;
        this.stockStatus = stockStatus;
    }
}

export class InventoryPartResponse {
    constructor(data = []) {
        this.data = data;
        this.info = {
            count: data.length
        };
    }
}
