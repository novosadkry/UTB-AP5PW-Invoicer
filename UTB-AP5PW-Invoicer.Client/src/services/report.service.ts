import type { AxiosInstance } from 'axios';
import type { Report, ReportCsv } from '@/types/report';

export class ReportService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getReport(periodStart?: Date, periodEnd?: Date): Promise<Report> {
    const params = new URLSearchParams();
    if (periodStart) params.append('periodStart', periodStart.toISOString());
    if (periodEnd) params.append('periodEnd', periodEnd.toISOString());
    
    const response = await this.api.get<Report>(`/reports?${params.toString()}`);
    return response.data;
  }

  async exportCsv(periodStart?: Date, periodEnd?: Date): Promise<ReportCsv> {
    const params = new URLSearchParams();
    if (periodStart) params.append('periodStart', periodStart.toISOString());
    if (periodEnd) params.append('periodEnd', periodEnd.toISOString());
    
    const response = await this.api.get(`/reports/csv?${params.toString()}`, {
      responseType: 'blob'
    });
    const filename = response.headers['content-disposition'].match(/filename=([^"]+);/);

    return {
      filename: filename ? filename[1] : 'report.csv',
      data: response.data
    }
  }
}
