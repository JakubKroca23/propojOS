# PropojOS Production User Documentation

Welcome to **PropojOS** — the next-generation micro-frontend workbench and serverless orchestration environment. This manual guides you through using, customizing, and automating your workflows within the premium glassmorphic interface.

---

## 1. Dashboard Grid Layout Management

PropojOS features a fully responsive, drag-and-drop grid system built on high-fidelity visual cards. It allows you to organize your active widgets exactly the way you want.

### Organizing Your Workspace
- **Drag-and-Drop Reordering**: Each widget features a header bar. Click and drag the header to move the widget to any grid position.
- **Responsive Resizing**: Hover over the bottom-right corner of a widget card to expose the grab handle. Drag to scale the widget's width and height. Other widgets will automatically compact vertically.
- **Dynamic Compacting**: To maximize space efficiency, the dashboard enforces vertical auto-compaction, pulling widgets upwards to eliminate wasted spacing.

### Persistent Cloud Saves
Every move, resize, widget addition, or removal is **automatically saved** to your secure Appwrite cloud configuration. You never have to manually click a save button; your workspace returns exactly as you left it, regardless of which browser or machine you use to log in.

---

## 2. Real-Time Synchronization

PropojOS keeps your workspaces synced in sub-second real-time across multiple browsers, screens, and devices.

### How it Works
1. When you authenticate with your credentials, PropojOS hydrates your workspace layout and widgets list from the `os_configs` collection.
2. A persistent, secure Appwrite WebSockets connection is established.
3. If you re-position a widget on a second monitor (Tab A), the layout state changes are immediately serialized to the cloud.
4. Tab B instantly receives the WebSocket event payload, detects the changes, and fluidly updates the UI layout in real-time, preventing state drifts.

---

## 3. Visual Workflow Programming

Transition from the **Dashboard** view to the **Workflow** canvas to construct real-time logic pipelines and visual wireframes between active widgets.

### Core Visual Nodes
- 📤 **Data Sender**: Emits random numeric events into the communication bus at the click of a button. Has a single output handle (`out`).
- 📥 **Data Receiver**: Reactively listens to incoming values from the communication bus and displays them in real-time. Has a single input handle (`in`).
- ⚡ **Serverless Runner**: A high-speed retro-styled console node. When an event is mapped here, it triggers an external or simulated Serverless Function and outputs detailed execution logs. Has a single input handle (`in`).
- ⚙️ **Custom Plugins**: Dynamically loaded external Micro-Frontends. These can host custom inputs (`in`) and outputs (`out`) for infinite extensibility.

### Wires and Animations
- **Drawing Connections**: Click and drag from an output port (right side of a node) to an input port (left side of a node) to build a data pipeline.
- **Pulsing Connections**: Active pipelines pulse and dash with glowing neon colors, visually indicating active communication flows.

---

## 4. Serverless Event Automations

The **Serverless Runner** widget bridges visual workflows with scalable serverless cloud logic.

### Local Simulation & Cloud Execution
1. **Cloud Production Execution**: When an input event flows into the Serverless node, the widget calls the secure Appwrite functions SDK (`functions.createExecution`) targeting the `event-processor` function on your host.
2. **Simulation Fallback**: If the serverless function is not deployed yet or is offline, the runtime seamlessly runs a robust local simulation to test your pipeline safely, outputting simulated JSON payloads.
3. **Console Logging**: The integrated monospace logs terminal displays detailed timestamps, input payloads, processing signatures, execution status codes, and serverless response strings.

---

## 5. Extensibility with Custom Plugins

PropojOS is built from the ground up to support dynamic, federated micro-frontends loaded directly from external repositories or bundles.

### Loading Dynamic Widgets
- Enter the registration credentials or remote URLs in your plugin manager.
- The **PluginLoader** loads the Javascript entry points asynchronously, resolves dependencies, and dynamically mounts the remote micro-frontends as active dashboard cards.
- These plugins can immediately participate in visual flow connections, enabling you to build fully distributed dashboard networks.
