import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fetchAttackDetail, type Attack } from "../services/api";
import {
  ArrowLeftIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentChartBarIcon,
  LinkIcon
} from "@heroicons/react/24/outline";

export function AttackDetailPage() {
  const { id } = useParams();
  const { data: attack, isLoading, error } = useQuery<Attack | null>({
    queryKey: ["attack", id],
    queryFn: () => fetchAttackDetail(id as string),
    enabled: !!id
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
          <p className="text-red-800">Error loading attack details.</p>
        </div>
      </div>
    );
  }

  if (!attack) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Attack session not found.</p>
          <Link to="/attacks" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
            ← Back to Attacks
          </Link>
        </div>
      </div>
    );
  }

  // const getDirectImageURL = (url: string) => {
  //   // Match Google Drive file ID
  //   const match = url.match(/\/d\/([^/]+)\//);
  //   if (match && match[1]) {
  //     return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  //   }

  //   return url; // return original if not Google Drive
  // };
  const extractId = (url: string) => {
    // Matches: /file/d/<FILE_ID>/ OR /open?id=<FILE_ID>
    const match1 = url.match(/\/d\/([^/]+)\//);
    if (match1) return match1[1];

    const match2 = url.match(/id=([^&]+)/);
    if (match2) return match2[1];

    return null; // Not a Google Drive link
  };

  // Extract filename from URL for display
  const getChartName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts[pathParts.length - 1] || 'chart.png';
    } catch {
      return url.split('/').pop() || 'chart.png';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/attacks"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Attacks
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Attack Session Details</h1>
          <p className="text-gray-600 mt-1">{attack.attack_session_id}</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Session ID</p>
              <p className="text-lg font-semibold text-blue-900 mt-2 break-all">
                {attack.attack_session_id}
              </p>
            </div>
            <DocumentChartBarIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Charts</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {attack.chartCount}
              </p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Created</p>
              <div className="flex items-center mt-2">
                <CalendarIcon className="h-5 w-5 text-green-500 mr-2" />
                <p className="text-sm font-semibold text-green-900">
                  {new Date(attack.created_at).toLocaleDateString()}
                </p>
              </div>
              <p className="text-xs text-green-700 mt-1">
                {new Date(attack.created_at).toLocaleTimeString()}
              </p>
            </div>
            <CalendarIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visualizations & Charts</h2>
            <p className="text-gray-600 mt-1">
              {attack.chartCount} chart{attack.chartCount !== 1 ? 's' : ''} generated for this session
            </p>
          </div>
        </div>

        {attack.insights && attack.insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attack.insights.map((chartUrl, index) =>
            {
              const fileId = extractId(chartUrl);
              return (
              <div
                key={index}
                className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  <LazyLoadImage
                    src={`${import.meta.env.VITE_API_URL}/api/drive-img/${fileId}`}
                    alt={`Chart ${index + 1}`}
                    effect="blur"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="16"%3EImage not available%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate flex-1">
                      {getChartName(chartUrl)}
                    </h3>
                    <a
                      href={chartUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                      title="Open in new tab"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    Chart {index + 1} of {attack.chartCount}
                  </p>
                </div>
                <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
              </div>
            );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No charts available</h3>
            <p className="mt-1 text-sm text-gray-500">
              This session doesn't have any visualizations yet.
            </p>
          </div>
        )}
      </div>

      {/* Session Info */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Session Information</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Database ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{attack.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Session ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono break-all">{attack.attack_session_id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(attack.created_at).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Total Insights</dt>
            <dd className="mt-1 text-sm text-gray-900">{attack.insights.length} URLs</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
