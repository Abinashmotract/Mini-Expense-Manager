import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mini-expense-manager.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Expense {
  id: number;
  date: string;
  amount: number;
  vendor_name: string;
  description: string;
  category_id: number;
  category_name: string;
  is_anomaly: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface VendorMapping {
  id: number;
  vendor_name: string;
  category_id: number;
  category_name: string;
}

export interface DashboardData {
  monthlyTotals: Array<{ category: string; total: string }>;
  topVendors: Array<{ vendor_name: string; total_spend: string; transaction_count: string }>;
  anomalies: Expense[];
  anomalyCount: number;
}

export const expenseApi = {
  getAll: async (): Promise<Expense[]> => {
    const response = await api.get('/expenses');
    return response.data;
  },

  add: async (expense: {
    date: string;
    amount: number;
    vendor_name: string;
    description?: string;
  }): Promise<Expense> => {
    const response = await api.post('/expenses', expense);
    return response.data;
  },

  getAnomalies: async (): Promise<Expense[]> => {
    const response = await api.get('/expenses/anomalies');
    return response.data;
  },

  uploadCSV: async (file: File): Promise<{ success: boolean; imported: number; errors: number }> => {
    const formData = new FormData();
    formData.append('csv', file);
    const response = await api.post('/expenses/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const dashboardApi = {
  getData: async (year?: number, month?: number): Promise<DashboardData> => {
    const params: any = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const response = await api.get('/dashboard', { params });
    return response.data;
  },
};

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export const vendorMappingApi = {
  getAll: async (): Promise<VendorMapping[]> => {
    const response = await api.get('/vendor-mappings');
    return response.data;
  },

  create: async (vendor_name: string, category_id: number): Promise<VendorMapping> => {
    const response = await api.post('/vendor-mappings', { vendor_name, category_id });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/vendor-mappings/${id}`);
  },
};
