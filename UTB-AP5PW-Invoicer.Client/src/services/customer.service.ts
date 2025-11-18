import type { AxiosInstance } from 'axios';
import type { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/customer';

export class CustomerService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAll(): Promise<Customer[]> {
    const response = await this.api.get<Customer[]>('/customers');
    return response.data;
  }

  async getById(id: number): Promise<Customer> {
    const response = await this.api.get<Customer>(`/customers/${id}`);
    return response.data;
  }

  async create(customer: CreateCustomerDto): Promise<Customer> {
    const response = await this.api.post<Customer>('/customers', customer);
    return response.data;
  }

  async update(customer: UpdateCustomerDto): Promise<void> {
    await this.api.put(`/customers/${customer.id}`, customer);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`/customers/${id}`);
  }
}
