# DECISIONS.md

## Architectural Decision Records

## Phase 1 Decisions

**Date:** 2026-05-21

### Scope
- Authentication will use standard Email/Password via Appwrite.
- Styling will be implemented using Vanilla CSS.

### Approach
- Chose: Option B (Infra First). 
- Reason: User wants to establish the Docker and Traefik backend configuration first, then build the frontend around these established components.

### Constraints
- Development happens locally, with manual `git pull` deployments to the VPS.
- Appwrite credentials: Project ID is `propoj-os`, running on `https://appwrite.propoj.app/v1`.

## Phase 2 Decisions

**Date:** 2026-05-21

### Scope
- Global State: Using `zustand` to manage OS-level state (layout, active apps).
- Dashboard Layout: Using `react-grid-layout` for a draggable, customizable widget grid.

### Approach
- Chose: Option B (Draggable Dashboard)
- Reason: Provides the best mix of rigidity and customizability as requested by the user.

## Phase 5 Decisions

**Date:** 2026-05-21

### Scope
- **Appwrite Persistence & Realtime:** We will store active widgets, grid layouts, and visual workflow connections in Appwrite database collections. Appwrite Realtime subscriptions will sync these states instantly across multiple open tabs or devices.
- **Appwrite Serverless Functions:** We will build/integrate a serverless function that acts as a visual workflow event processor (e.g. taking visual flow signals and logging them or calling a mock external webhook).
- **UX & UI Polish:** Apply a sleek dark glassmorphism aesthetic across the OS shell, widgets, and custom React Flow canvas nodes with glowing connector handles and smooth animations.
- **Documentation:** Create premium user/operational documentation rather than VPS deployment guides.

### Approach
- Chose: DB-Driven Realtime Engine.
- Reason: Simplifies State Management by using Appwrite Database as the single source of truth, synchronizing it dynamically to all active clients using Realtime triggers.

### Constraints
- Remove the redundant `traefik` service from `docker-compose.yml` because the user already runs a global Traefik instance in their Appwrite setup. PropojOS will simply register labels with the existing Traefik.
