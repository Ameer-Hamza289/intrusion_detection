import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchAttacks } from "../services/api";

export function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const { data: attacks, isLoading } = useQuery({
    queryKey: ["attacks", timeRange],
    queryFn: () => fetchAttacks(timeRange)
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attack Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Attacks</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {attacks?.totalCount || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">High Severity</h3>
          <p className="text-3xl font-bold text-red-600">
            {attacks?.highSeverityCount || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {attacks?.mitigationRate || 0}%
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attack Trends</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as "24h" | "7d" | "30d")}
            className="p-2 border rounded-md"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
        <div className="w-full h-64">
          {attacks?.timeSeriesData && (
            <LineChart
              width={800}
              height={300}
              data={attacks.timeSeriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attacks" stroke="#8884d8" />
            </LineChart>
          )}
        </div>
      </div>
    </div>
  );
}
