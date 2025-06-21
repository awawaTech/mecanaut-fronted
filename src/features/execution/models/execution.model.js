
export const ExecutionTask = {
    label: String,
    completed: Boolean,
  };
  
  export const ExecutionProduct = {
    name: String,
    quantity: Number,
  };
  
  export const ExecutionCardData = {
    machineryName: String,
    workOrderId: String,
    tasks: Array,
    observations: String,
    products: Array,
  };
  
  export const WorkOrderExecution = {
    id: String,
    name: String,
  };
  