import { Appointment } from '@/app/redux/dashboardSlice';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface StatusCount {
  confirmed: number;
  pending: number;
  completed: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get all appointments with optional filters
  async getAppointments(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const endpoint = `/appointments${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.request<Appointment[]>(endpoint);
    return response.data;
  }

  // Get appointment by ID
  async getAppointment(id: number): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}`);
    return response.data;
  }

  // Create new appointment
  async createAppointment(appointment: {
    patientName: string;
    time: string;
    status?: string;
  }): Promise<Appointment> {
    const response = await this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    });
    return response.data;
  }

  // Update appointment
  async updateAppointment(
    id: number,
    updates: Partial<Appointment>
  ): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  // Delete appointment
  async deleteAppointment(id: number): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  // Get status count statistics
  async getStatusCount(): Promise<StatusCount> {
    const response = await this.request<StatusCount>('/appointments/stats/status-count');
    return response.data;
  }
}

export const apiService = new ApiService(); 