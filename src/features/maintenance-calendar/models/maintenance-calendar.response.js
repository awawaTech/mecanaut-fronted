import { MaintenanceCalendarResource } from "./maintenance-calendar.resource.js";


export class ApiInfo {
  constructor({ registers = 0, status = 'success', message = '' } = {}) {
    this.registers = registers;
    this.status = status;
    this.message = message;
  }
}


export class MaintenanceCalendarListResponse {
  constructor({ info = [], data = [] } = {}) {
    // «info» puede venir como array o como objeto
    const rawInfo = Array.isArray(info) ? info[0] : info;
    this.info = new ApiInfo(rawInfo);
    this.data = Array.isArray(data)
      ? data.map((p) => new MaintenanceCalendarResource(p))
      : [];
  }
}
