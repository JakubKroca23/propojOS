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
