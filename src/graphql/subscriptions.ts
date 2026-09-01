export interface ShuttleTelemetry {
  shuttle_id: string;
  latitude: string;
  longitude: string;
  speed_kmh: number;
  passenger_count: number;
  max_capacity: number;
  occupancy_status: 'GREEN' | 'YELLOW' | 'RED';
  last_ping: number;
}

export interface OnShuttleLocationUpdatedResponse {
  onShuttleLocationUpdated: ShuttleTelemetry;
}

export const onShuttleLocationUpdated = /* GraphQL */ `
  subscription OnShuttleLocationUpdated {
    onShuttleLocationUpdated {
      shuttle_id
      latitude
      longitude
      speed_kmh
      passenger_count
      max_capacity
      occupancy_status
      last_ping
    }
  }
`;