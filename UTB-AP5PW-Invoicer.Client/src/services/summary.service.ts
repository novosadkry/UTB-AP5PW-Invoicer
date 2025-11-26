import type { AxiosInstance } from 'axios';
import type { DashboardSummary } from "@/types/summary.ts";

export class SummaryService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await this.api.get<DashboardSummary>('/summary/dashboard');
    return response.data;
  }
}
