import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fetchAttackDetail, type Attack } from "../services/api";

export function AttackDetailPage() {
  const { id } = useParams();
  const { data: attack, isLoading } = useQuery<Attack>({
    queryKey: ["attack", id],
    queryFn: () => fetchAttackDetail(id as string),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (!attack) {
    return <div className="p-6">Attack not found</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Attack Details</h1>
        <p className="text-gray-600">ID: {attack.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="text-lg">{attack.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Severity</dt>
              <dd className="text-lg">
                <span
                  className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full
                  ${
                    attack.severity === "high"
                      ? "bg-red-100 text-red-800"
                      : attack.severity === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {attack.severity}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-lg">
                <span
                  className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full
                  ${
                    attack.status === "mitigated"
                      ? "bg-green-100 text-green-800"
                      : attack.status === "ongoing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {attack.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
              <dd className="text-lg">
                {new Date(attack.timestamp).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Attack Metrics</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Packets/Second
              </dt>
              <dd className="text-lg">{attack.metrics.packetsPerSecond}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Bandwidth</dt>
              <dd className="text-lg">{attack.metrics.bandwidth} Mbps</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="text-lg">{attack.metrics.duration}s</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Source IPs</dt>
              <dd className="text-lg">{attack.metrics.sourceIpCount}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Attack Visualizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {attack.visualizations.map((viz, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-lg font-medium">{viz.title}</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <LazyLoadImage
                  src={viz.imageUrl}
                  alt={viz.title}
                  effect="blur"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-sm text-gray-600">{viz.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Mitigation Details</h2>
        <div className="prose max-w-none">
          <h3 className="text-lg font-medium mb-2">Actions Taken</h3>
          <ul className="list-disc pl-5 mb-4">
            {attack.mitigation.actions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
          <h3 className="text-lg font-medium mb-2">Recommendations</h3>
          <ul className="list-disc pl-5">
            {attack.mitigation.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
