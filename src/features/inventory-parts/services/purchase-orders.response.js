export class PurchaseOrderResource {
    constructor({
        id = 0,
        inventory_part_id = 0,
        quantity = 0,
        price = 0.00,
        order_date = '',
        received_date = null,
        status = 'PENDING',
        user_id = 0
    } = {}) {
        this.id = id;
        this.inventory_part_id = inventory_part_id;
        this.quantity = quantity;
        this.price = price;
        this.order_date = order_date;
        this.received_date = received_date;
        this.status = status;
        this.user_id = user_id;
    }
}

export class PurchaseOrderResponse {
    constructor(data = []) {
        this.data = data;
        this.info = {
            count: data.length
        };
    }
}
