export class PurchaseOrderEntity {
    constructor({
        id = 0,
        inventory_part_id = 0,
        quantity = 0,
        price = 0.00,
        order_date = '',
        received_date = null,
        status = 'PENDING',
        user_id = 0
    }) {
        this.id = id;
        this.inventoryPartId = inventory_part_id;
        this.quantity = quantity;
        this.price = price;
        this.orderDate = order_date;
        this.receivedDate = received_date;
        this.status = status;
        this.userId = user_id;
    }
}
