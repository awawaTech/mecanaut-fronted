// execution.assembler.js

export class WorkOrderExecutionAssembler {
    static fromResource(resource) {
      return {
        id: resource.id,
        name: resource.name,
      };
    }
  }
  
  export class ExecutionAssembler {
    static fromResource(resource) {
      return {
        machineryName: resource.machineryName,
        workOrderId: resource.workOrderId,
        tasks: ExecutionAssembler.getHardcodedTasks(),
        observations: 'Observación generada automáticamente para la maquinaria.',
        products: ExecutionAssembler.getHardcodedProducts(),
      };
    }
  
    // Métodos para obtener los datos hardcodeados
    static getHardcodedTasks() {
      return [
        { label: 'Drenar aceite viejo al depósito aprobado', completed: false },
        { label: 'Reemplazar filtro hidráulico', completed: false },
        { label: 'Rellenar con aceite nuevo', completed: false },
        { label: 'Arranque de prueba y verificación de presión', completed: false },
        { label: 'Inspección de fugas en un recorrido de 5 min', completed: false },
      ];
    }
  
    static getHardcodedProducts() {
      return [
        { name: 'Aceite hidráulico', quantity: 2 },
        { name: 'Filtro hidráulico', quantity: 1 },
      ];
    }
  }
  