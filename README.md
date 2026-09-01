<div align="center">

# <img src="https://img.icons8.com/isometric/512/bus.png" width="46" height="46" valign="middle" alt="ShuttleSense Logo"/> ShuttleSense

### **IoT-Enabled Smart Shuttle Monitoring & Campus Transportation Management System**

[![AWS Serverless](https://img.shields.io/badge/AWS-Serverless_Architecture-FF9900?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![AWS AppSync](https://img.shields.io/badge/AWS_AppSync-GraphQL_WebSockets-E7157B?logo=graphql&logoColor=white)](https://aws.amazon.com/appsync/)
[![AWS IoT Core](https://img.shields.io/badge/AWS_IoT_Core-MQTT_Telemetry-232F3E?logo=amazon-aws&logoColor=white)](https://aws.amazon.com/iot-core/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-Vector_Maps-3969EC?logo=maplibre&logoColor=white)](https://maplibre.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  A high-throughput, low-latency campus transit management platform providing real-time fleet telemetry streaming, dynamic passenger occupancy tracking, geofence boundary detection, and automated dispatch operations.
</p>

[System Architecture](#-system-architecture) •
[Key Features](#-key-features) •
[Tech Stack](#-tech-stack) •
[Telemetry & GraphQL API](#-telemetry-specification--graphql-api) •
[Core Implementation](#-core-implementation-snippets) •
[Getting Started](#-local-installation--setup) •
[Roadmap](#-future-roadmap)

---

</div>

## 📸 Operations Console Preview

<table>
<tr>
<td colspan="2" bgcolor="#0b1120">
  <b>🚌 ShuttleSense Operations Console</b> &nbsp;|&nbsp; <code>Live Fleet Telemetry & Transit Management</code>
  <span align="right" style="float: right;">🟢 <b>AppSync Real-Time Active</b></span>
</td>
</tr>
<tr>
<td width="50%" bgcolor="#0f172a">
  <h4>🚍 SHUTTLE_01 <span style="background-color: #78350f; color: #fbbf24; padding: 2px 8px; border-radius: 4px; font-size: 11px;">🟡 YELLOW OCCUPANCY</span></h4>
  <p><code>Lat: 12.972100, Lng: 79.159400</code></p>
  <table>
    <tr>
      <td bgcolor="#020617">👥 <b>Occupancy</b><br/><h3>36 / 40</h3></td>
      <td bgcolor="#020617">⚡ <b>Speed</b><br/><h3>42.5 km/h</h3></td>
    </tr>
  </table>
  <small>🛡️ Driver Safe &nbsp;•&nbsp; Updated: <i>Just now</i></small>
</td>
<td width="50%" bgcolor="#0f172a">
  <h4>🚍 SHUTTLE_02 <span style="background-color: #064e3b; color: #34d399; padding: 2px 8px; border-radius: 4px; font-size: 11px;">🟢 GREEN OCCUPANCY</span></h4>
  <p><code>Lat: 12.974500, Lng: 79.162300</code></p>
  <table>
    <tr>
      <td bgcolor="#020617">👥 <b>Occupancy</b><br/><h3>14 / 40</h3></td>
      <td bgcolor="#020617">⚡ <b>Speed</b><br/><h3>28.0 km/h</h3></td>
    </tr>
  </table>
  <small>🛡️ Driver Safe &nbsp;•&nbsp; Updated: <i>Just now</i></small>
</td>
</tr>
<tr>
<td colspan="2" bgcolor="#020617" align="center">
  <br/>
  <b>🗺️ Interactive Campus Vector Map (MapLibre GL Engine)</b><br/>
  <code>📍 Center: 12.971598 N, 79.158812 E &nbsp;|&nbsp; Zoom: 15x &nbsp;|&nbsp; Geofence Stops: Main Gate, Tech Park, Hostels</code>
  <br/><br/>
</td>
</tr>
</table>

---

### **Architectural Layers Breakdown**

| Layer | AWS Component | Protocols / Engines | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **1. Edge & Telemetry** | IoT Edge Node | MQTT v5 (`QoS 1`) | Captures GPS coordinates, vehicle speed, and IR sensor passenger counts; packages and transmits JSON telemetry packets every 3–5 seconds. |
| **2. Ingestion & Routing** | AWS IoT Core | IoT SQL Rules Engine | Ingests MQTT topic messages on `shuttlesense/telemetry/+` and invokes the serverless processing function without queue latency. |
| **3. Compute & Business Logic** | AWS Lambda | Python 3.12 Serverless | Computes threshold occupancy categories (`GREEN`, `YELLOW`, `RED`), updates the datastore, evaluates stop geofences, and executes AppSync mutations. |
| **4. Persistence & Cache** | Amazon DynamoDB | Key-Value NoSQL (`PAY_PER_REQUEST`) | Stores current vehicle states in the `LiveShuttles` table with a 600-second Time-To-Live (TTL) for auto-expiring stale records. |
| **5. Real-Time Fanout** | AWS AppSync | GraphQL over WebSockets (`wss://`) | Delivers sub-second push notifications to connected clients on the `onShuttleLocationUpdated` subscription whenever a mutation occurs. |
| **6. Security & Identity** | Amazon Cognito | OAuth 2.0 / JWT User Pools | Enforces Role-Based Access Control (RBAC) separating administrative fleet managers from students and drivers. |
| **7. Geospatial & Mapping** | Amazon Location & MapLibre | Vector Tiles & Geofences | Evaluates virtual perimeters around campus stops and renders vector tracking layers in the frontend interface. |
| **8. Operations & Client UI** | React 19 & Flutter | Vite 6, Tailwind CSS v4, Dart SDK | Provides administrative monitoring consoles for dispatchers and dynamic transit passes for mobile users. |

---

### **Step-by-Step Telemetry Lifecycle**

1. **Edge Broadcast:** The vehicle hardware sends a lightweight JSON payload to topic `shuttlesense/telemetry/SHUTTLE_01`.
2. **Rule Ingestion:** AWS IoT Core intercepts the MQTT payload via SQL topic rule `SELECT * FROM 'shuttlesense/telemetry/+'` and triggers `TelemetryProcessorLambda`.
3. **Classification & Storage:** Lambda calculates whether the shuttle is under capacity (`GREEN`), near capacity (`YELLOW`), or full (`RED`), then writes the record directly to DynamoDB with a 10-minute TTL.
4. **AppSync Broadcast:** Lambda performs an authenticated `publishLocation` GraphQL mutation to the AppSync endpoint.
5. **Real-Time Client Updates:** AppSync fans out the updated telemetry payload across active WebSocket connections, updating React operations cards and moving MapLibre map markers without refreshing the page.