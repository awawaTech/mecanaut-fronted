
export class MaintenancePlanResource {
    constructor({
      id = 0,
      planId = 0,
      planName = '',
      productionLineId = 0,
      startDate = '',
      durationDays = 1,
      userCreator = 0,
      items = [],
    } = {}) {
      this.id = id || null;
      this.planId = planId || null;
      this.planName = planName || null;
      this.productionLineId = productionLineId || null;
      this.startDate = startDate ? new Date(startDate) : null;
      this.durationDays = durationDays || 0;
      this.userCreator = userCreator || null;
      this.items = Array.isArray(items) ? items : [];
    }
  }
  