# ROADMAP.md

> **Current Phase**: 4
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Grid/dashboard UI shell
- [x] Native plugin system for custom apps
- [ ] Visual node-based workflow editor
- [ ] Appwrite integration (Auth, DB, Realtime)
- [ ] Docker + Traefik deployment

## Phases

### Phase 1: Foundation & Auth
**Status**: ✅ Complete
**Objective**: Scaffold the React/Vite application, configure Docker/Traefik routing, and implement Appwrite Authentication.
**Requirements**: REQ-02, REQ-06

### Phase 2: Core Shell & Dashboard Grid
**Status**: ✅ Complete
**Objective**: Build the main grid/dashboard UI, state management, and routing for the OS shell.
**Requirements**: REQ-01

### Phase 3: Plugin System Architecture
**Status**: ✅ Complete
**Objective**: Implement dynamic module loading (Module Federation) to allow importing and rendering custom apps within the grid.
**Requirements**: REQ-03

### Phase 4: Workflow Editor & App Communication
**Status**: ⬜ Not Started
**Objective**: Build the node-based visual workflow editor and establish the global event bus / real-time piping between apps.
**Requirements**: REQ-04, REQ-05

### Phase 5: Appwrite Realtime & Polish
**Status**: ⬜ Not Started
**Objective**: Integrate Appwrite Realtime and Serverless Functions, polish the UI, and write deployment documentation.
