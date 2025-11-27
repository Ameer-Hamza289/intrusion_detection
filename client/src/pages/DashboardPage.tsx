import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  // PieChart,
  // Pie,
  // Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchAttacks } from "../services/api";
import {
  ShieldExclamationIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

// const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

export function DashboardPage() {
  const { data: overview, isLoading, error } = useQuery({
    queryKey: ["attacks-overview"],
    queryFn: fetchAttacks,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard data. Make sure the Express server is running.</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const sessionChartData = overview?.recentSessions?.slice(0, 5).map(session => ({
    name: session.session_id.split('_').slice(-1)[0] || 'Session',
    charts: session.chartCount
  })) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Intrusion Detection System Analytics</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
              <p className="text-4xl font-bold mt-2">{overview?.uniqueSessions || 0}</p>
            </div>
            <ShieldExclamationIcon className="h-12 w-12 text-blue-200" />
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400">
            <p className="text-blue-100 text-xs">Unique attack analysis sessions</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Charts</p>
              <p className="text-4xl font-bold mt-2">{overview?.totalCharts || 0}</p>
            </div>
            <ChartBarIcon className="h-12 w-12 text-purple-200" />
          </div>
          <div className="mt-4 pt-4 border-t border-purple-400">
            <p className="text-purple-100 text-xs">Visualizations generated</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Insights Stored</p>
              <p className="text-4xl font-bold mt-2">{overview?.totalCount || 0}</p>
            </div>
            <DocumentChartBarIcon className="h-12 w-12 text-green-200" />
          </div>
          <div className="mt-4 pt-4 border-t border-green-400">
            <p className="text-green-100 text-xs">Total insight records</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Avg Charts/Session</p>
              <p className="text-4xl font-bold mt-2">
                {overview?.uniqueSessions
                  ? Math.round((overview.totalCharts || 0) / overview.uniqueSessions)
                  : 0}
              </p>
            </div>
            <ClockIcon className="h-12 w-12 text-orange-200" />
          </div>
          <div className="mt-4 pt-4 border-t border-orange-400">
            <p className="text-orange-100 text-xs">Average per session</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Series Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Attack Sessions Timeline</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={overview?.timeSeriesData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="timestamp"
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="attacks"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
                name="Sessions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Sessions Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Sessions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="charts" fill="#8b5cf6" name="Charts" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Attack Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Charts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overview?.recentSessions?.map((session, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {session.session_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {session.chartCount} charts
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(session.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a
                      href={`/attacks?session=${session.session_id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View →
                    </a>
                  </td>
                </tr>
              ))}
              {(!overview?.recentSessions || overview.recentSessions.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
