// Types for API responses
export interface Attack {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  status: 'mitigated' | 'ongoing' | 'failed';
  timestamp: string;
  metrics: {
    packetsPerSecond: number;
    bandwidth: number;
    duration: number;
    sourceIpCount: number;
  };
  visualizations: {
    title: string;
    imageUrl: string;
    description: string;
  }[];
  mitigation: {
    actions: string[];
    recommendations: string[];
  };
}

export interface AttackOverview {
  totalCount: number;
  highSeverityCount: number;
  mitigationRate: number;
  timeSeriesData: {
    timestamp: string;
    attacks: number;
  }[];
}

// API Service
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const fetchAttacks = async (timeRange: string): Promise<AttackOverview> => {
  const response = await api.get(`/attacks/overview?timeRange=${timeRange}`);
  return response.data;
};

export const fetchAttacksList = async (): Promise<Attack[]> => {
  const response = await api.get('/attacks');
  return response.data;
};

export const fetchAttackDetail = async (id: string): Promise<Attack> => {
  const response = await api.get(`/attacks/${id}`);
  return response.data;
};