import FleetMap from './components/FleetMap';
import { useEffect, useState } from 'react';
import { generateClient, type GraphQLSubscription } from 'aws-amplify/api';
import {
  onShuttleLocationUpdated,
  type ShuttleTelemetry,
  type OnShuttleLocationUpdatedResponse,
} from './graphql/subscriptions';
import { Bus, Users, Gauge, ShieldCheck } from 'lucide-react';

const client = generateClient();

export default function App() {
  const [shuttles, setShuttles] = useState<Record<string, ShuttleTelemetry>>({
    SHUTTLE_01: {
      shuttle_id: 'SHUTTLE_01',
      latitude: '12.971598',
      longitude: '79.158812',
      speed_kmh: 0,
      passenger_count: 0,
      max_capacity: 40,
      occupancy_status: 'GREEN',
      // eslint-disable-next-line react-hooks/purity
      last_ping: Math.floor(Date.now() / 1000),
    },
  });

  useEffect(() => {
    // Subscribe to live AppSync WebSockets with strict typing
    const subscription = client
      .graphql<GraphQLSubscription<OnShuttleLocationUpdatedResponse>>({
        query: onShuttleLocationUpdated,
        authMode: 'apiKey'
      })
      .subscribe({
        next: ({ data }) => {
          const update = data?.onShuttleLocationUpdated;
          if (update) {
            setShuttles((prev) => ({
              ...prev,
              [update.shuttle_id]: update,
            }));
          }
        },
        error: (err: unknown) => console.error('AppSync Subscription Error:', err),
      });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      {/* Header */}
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Bus className="text-blue-500 w-8 h-8" />
            ShuttleSense Operations Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Live Fleet Telemetry & Transit Management
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          AppSync Real-Time Active
        </div>
      </header>

      {/* Fleet Grid */}
      <main className="mt-8">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">
          Active Fleet Telemetry
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(shuttles).map((bus) => (
            <div
              key={bus.shuttle_id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{bus.shuttle_id}</h3>
                  <span className="text-xs text-slate-400">
                    Lat: {bus.latitude}, Lng: {bus.longitude}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    bus.occupancy_status === 'RED'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : bus.occupancy_status === 'YELLOW'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {bus.occupancy_status} OCCUPANCY
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    Occupancy
                  </div>
                  <div className="text-xl font-bold text-white">
                    {bus.passenger_count}{' '}
                    <span className="text-xs text-slate-500 font-normal">
                      / {bus.max_capacity}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Gauge className="w-4 h-4 text-indigo-400" />
                    Speed
                  </div>
                  <div className="text-xl font-bold text-white">
                    {bus.speed_kmh}{' '}
                    <span className="text-xs text-slate-500 font-normal">km/h</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Driver Safe
                </span>
                <span>Updated just now</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-2">
            Live Fleet Tracking Map
          </h2>
          <FleetMap shuttles={shuttles} />
        </div>
      </main>
    </div>
  );
}