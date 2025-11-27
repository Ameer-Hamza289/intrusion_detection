// Types for API responses
export interface Insight {
  _id: string;
  attack_session_id: string;
  insights: string[]; // Array of chart URLs
  created_at: string;
}

export interface Attack {
  id: string;
  attack_session_id: string;
  insights: string[];
  created_at: string;
  chartCount: number;
}

export interface AttackOverview {
  totalCount: number;
  totalCharts: number;
  uniqueSessions: number;
  recentSessions: {
    session_id: string;
    chartCount: number;
    created_at: string;
  }[];
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

// Add auth interceptor (optional for now)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch all insights from Express server
export const fetchAllInsights = async (): Promise<Insight[]> => {
  const response = await api.get('/data');
  return response.data.insights || [];
};

// Fetch insights by session
export const fetchInsightsBySession = async (sessionId: string): Promise<Insight[]> => {
  const response = await api.get(`/data/session/${sessionId}`);
  return response.data.insights || [];
};

// Get overview statistics
export const fetchAttacks = async (): Promise<AttackOverview> => {
  const insights = await fetchAllInsights();

  // Calculate statistics
  const totalCount = insights.length;
  const totalCharts = insights.reduce((sum, insight) => sum + (insight.insights?.length || 0), 0);
  const uniqueSessions = new Set(insights.map(i => i.attack_session_id)).size;

  // Get recent sessions (last 10)
  const recentSessions = insights
    .slice(0, 10)
    .map(insight => ({
      session_id: insight.attack_session_id,
      chartCount: insight.insights?.length || 0,
      created_at: insight.created_at
    }));

  // Generate time series data (last 7 days)
  const timeSeriesData = generateTimeSeriesData(insights);

  return {
    totalCount,
    totalCharts,
    uniqueSessions,
    recentSessions,
    timeSeriesData
  };
};

// Get attacks list (converted from insights)
export const fetchAttacksList = async (): Promise<Attack[]> => {
  const insights = await fetchAllInsights();

  return insights.map(insight => ({
    id: insight._id,
    attack_session_id: insight.attack_session_id,
    insights: insight.insights || [],
    created_at: insight.created_at,
    chartCount: insight.insights?.length || 0
  }));
};

// Get attack detail by ID
export const fetchAttackDetail = async (id: string): Promise<Attack | null> => {
  const insights = await fetchAllInsights();
  const insight = insights.find(i => i._id === id);

  if (!insight) return null;

  return {
    id: insight._id,
    attack_session_id: insight.attack_session_id,
    insights: insight.insights || [],
    created_at: insight.created_at,
    chartCount: insight.insights?.length || 0
  };
};

// Helper function to generate time series data
function generateTimeSeriesData(insights: Insight[]) {
  const days = 7;
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = insights.filter(insight => {
      const insightDate = new Date(insight.created_at);
      return insightDate >= date && insightDate < nextDate;
    }).length;

    data.push({
      timestamp: date.toISOString().split('T')[0],
      attacks: count
    });
  }

  return data;
}