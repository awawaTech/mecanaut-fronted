import { WorkOrderEntity } from '../models/work-order.entity';

const MOCK_WORK_ORDERS = [
  {
    id: 1,
    code: 'WO-2024-001',
    date: '2024-03-15',
    productionLine: 'L-01',
    type: 'Preventivo',
    status: 'pending',
    description: 'Mantenimiento preventivo línea 1',
    priority: 'high',
    technicians: [
      {
        id: 1,
        name: 'Juan Pérez',
        email: 'juan@example.com',
        machines: ['MT-430', 'MT-450'],
        assignedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 1,
    updatedBy: 1
  },
  {
    id: 2,
    code: 'WO-2024-002',
    date: '2024-03-16',
    productionLine: 'L-02',
    type: 'Correctivo',
    status: 'in_progress',
    description: 'Reparación urgente línea 2',
    priority: 'medium',
    technicians: [
      {
        id: 2,
        name: 'María López',
        email: 'maria@example.com',
        machines: ['MT-500', 'MT-600'],
        assignedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 1,
    updatedBy: 1
  }
];

export class WorkOrderService {
  static async getOrders() {
    return MOCK_WORK_ORDERS.map(order => new WorkOrderEntity(order));
  }

  static async getOrder(id) {
    const order = MOCK_WORK_ORDERS.find(o => o.id === id);
    return order ? new WorkOrderEntity(order) : null;
  }

  static async createOrder(orderData) {
    const newOrder = {
      ...orderData,
      id: MOCK_WORK_ORDERS.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 1,
      updatedBy: 1
    };
    MOCK_WORK_ORDERS.push(newOrder);
    return new WorkOrderEntity(newOrder);
  }

  static async updateOrder(id, orderData) {
    const index = MOCK_WORK_ORDERS.findIndex(o => o.id === id);
    if (index !== -1) {
      MOCK_WORK_ORDERS[index] = {
        ...MOCK_WORK_ORDERS[index],
        ...orderData,
        updatedAt: new Date(),
        updatedBy: 1
      };
      return new WorkOrderEntity(MOCK_WORK_ORDERS[index]);
    }
    throw new Error('Order not found');
  }

  static async deleteOrder(id) {
    const index = MOCK_WORK_ORDERS.findIndex(o => o.id === id);
    if (index !== -1) {
      MOCK_WORK_ORDERS.splice(index, 1);
      return true;
    }
    throw new Error('Order not found');
  }
}
