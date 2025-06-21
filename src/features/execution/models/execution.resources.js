// resources.js
export const WorkOrderExecutionResource = {
    id: String,
    name: String,
  };
  
  export const MachineryExecutionResource = {
    id: String, // El ID de la maquinaria
    machineryName: String, // El nombre de la maquinaria
    workOrderId: String, // El ID de la orden de trabajo (por ejemplo, "OT01")
    tasks: Array, // [{ label: String, completed: Boolean }]
    observations: String, // Observaciones (serán hardcodeado)
    products: Array, // [{ name: String, quantity: Number }] // Productos relacionados (serán hardcodeados)
};
