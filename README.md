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

## 🏗 System Architecture

The ShuttleSense architecture bridges IoT telemetry edge ingestion with a serverless event-driven processing backbone, pushing sub-second updates directly to web and mobile clients.

```mermaid
flowchart TD
    subgraph EdgeLayer [Edge Devices & Transit Fleet]
        VehicleNode["📡 GPS & IR Vehicle Node"] -->|MQTT Publish| IoTTopic["shuttlesense/telemetry/{id}"]
    end

    subgraph AWSCloud [AWS Serverless Processing Engine]
        IoTTopic -->|IoT Rule Evaluation| LambdaProc["⚡ TelemetryProcessorLambda"]
        LambdaProc -->|PutItem with TTL| DynamoDB[("🗄️ DynamoDB LiveShuttles")]
        LambdaProc -->|GraphQL Mutation| AppSyncAPI["🔄 AWS AppSync GraphQL API"]
        LambdaProc -->|Track Coordinates| LocationSvc["📍 Amazon Location Geofencing"]
        LocationSvc -->|Geofence Breach| SNSAlert["🔔 Amazon SNS Notification Hub"]
    end

    subgraph Presentation [Web & Mobile Client Interface]
        AppSyncAPI -->|WSS Subscriptions| AdminDashboard["💻 React 19 Admin Operations Console"]
        AppSyncAPI -->|WSS Subscriptions| MobileApp["📱 Flutter Student & Driver App"]
        CognitoAuth["🔐 Amazon Cognito User Pool"] -.->|JWT Auth| AdminDashboard
        CognitoAuth -.->|RBAC Verification| MobileApp
    end