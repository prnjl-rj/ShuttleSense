import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { ShuttleTelemetry } from '../graphql/subscriptions';

interface FleetMapProps {
  shuttles: Record<string, ShuttleTelemetry>;
}

export default function FleetMap({ shuttles }: FleetMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markers = useRef<Record<string, maplibregl.Marker>>({});

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [79.158812, 12.971598],
      zoom: 15,
    });

    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      'top-right'
    );

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    Object.values(shuttles).forEach((shuttle) => {
      const lng = parseFloat(shuttle.longitude);
      const lat = parseFloat(shuttle.latitude);

      if (isNaN(lng) || isNaN(lat)) return;

      if (!markers.current[shuttle.shuttle_id]) {
        const el = document.createElement('div');
        el.className =
          'w-7 h-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white transition-transform duration-300';
        el.style.backgroundColor =
          shuttle.occupancy_status === 'RED'
            ? '#ef4444'
            : shuttle.occupancy_status === 'YELLOW'
            ? '#f59e0b'
            : '#10b981';
        el.innerText = '🚌';

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 15 }).setText(
              `${shuttle.shuttle_id} (${shuttle.occupancy_status})`
            )
          )
          .addTo(mapInstance.current!);

        markers.current[shuttle.shuttle_id] = marker;
      } else {
        markers.current[shuttle.shuttle_id].setLngLat([lng, lat]);
      }
    });
  }, [shuttles]);

  return (
    <div className="w-full h-112.5 rounded-xl overflow-hidden border border-slate-800 shadow-xl mt-4">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}