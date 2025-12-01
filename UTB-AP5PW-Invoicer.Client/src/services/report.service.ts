import type { AxiosInstance } from 'axios';
import type { Report } from '@/types/report';

export class ReportService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getReport(periodStart?: string, periodEnd?: string): Promise<Report> {
    const params = new URLSearchParams();
    if (periodStart) params.append('periodStart', periodStart);
    if (periodEnd) params.append('periodEnd', periodEnd);
    
    const response = await this.api.get<Report>(`/reports?${params.toString()}`);
    return response.data;
  }

  async exportCsv(periodStart?: string, periodEnd?: string): Promise<Blob> {
    const params = new URLSearchParams();
    if (periodStart) params.append('periodStart', periodStart);
    if (periodEnd) params.append('periodEnd', periodEnd);
    
    const response = await this.api.get(`/reports/csv?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}
