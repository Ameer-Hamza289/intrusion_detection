import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { fetchAttacksList, type Attack } from "../services/api";
import {
  // MagnifyingGlassIcon,
  ChartBarIcon,
  CalendarIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";

export function AttacksPage() {
  const [searchParams] = useSearchParams();
  const sessionFilter = searchParams.get('session');

  const { data: attacks, isLoading, error } = useQuery<Attack[]>({
    queryKey: ["attacks-list"],
    queryFn: fetchAttacksList,
    refetchInterval: 30000,
  });

  // Filter by session if provided
  const filteredAttacks = sessionFilter
    ? attacks?.filter(attack => attack.attack_session_id === sessionFilter)
    : attacks;

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
          <p className="text-red-800">Error loading attacks. Make sure the Express server is running.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attack Sessions</h1>
          <p className="text-gray-600 mt-1">
            {sessionFilter
              ? `Filtered by session: ${sessionFilter}`
              : 'All intrusion detection analysis sessions'}
          </p>
        </div>
        {sessionFilter && (
          <Link
            to="/attacks"
            className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Clear Filter
          </Link>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {filteredAttacks?.length || 0}
              </p>
            </div>
            <ChartBarIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Charts</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {filteredAttacks?.reduce((sum, attack) => sum + attack.chartCount, 0) || 0}
              </p>
            </div>
            <ChartBarIcon className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Avg Charts/Session</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {filteredAttacks?.length
                  ? Math.round((filteredAttacks.reduce((sum, attack) => sum + attack.chartCount, 0) || 0) / filteredAttacks.length)
                  : 0}
              </p>
            </div>
            <ChartBarIcon className="h-10 w-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Attacks Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Session History</h2>
        </div>

        {filteredAttacks && filteredAttacks.length > 0 ? (
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
                {filteredAttacks.map((attack) => (
                  <tr
                    key={attack.id}
                    className="hover:bg-indigo-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100">
                          <ChartBarIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {attack.attack_session_id}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {attack.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        {attack.chartCount} charts
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        {new Date(attack.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/attacks/${attack.id}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
                      >
                        View Details
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {sessionFilter
                ? 'No sessions match the current filter.'
                : 'Start analyzing attacks to see sessions here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
