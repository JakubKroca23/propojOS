# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
PropojOS is a highly scalable, web-based operating system deployed via Docker and powered by Appwrite. It features a grid/dashboard UI and a native plugin system for custom apps. A core capability is its node-based workflow editor, allowing users to automate background tasks and visually pipe data between apps in real-time.

## Goals
1. Establish a native, high-performance plugin system for custom apps to share state and Appwrite session.
2. Build a grid/dashboard-based UI that provides an organized, productive workspace.
3. Implement a visual node-based workflow editor for background automation and real-time app-to-app data piping.
4. Seamlessly integrate with Appwrite for Auth, Database, Realtime, and Serverless Functions.

## Non-Goals (Out of Scope)
- 3rd-party untrusted app store (apps are custom-built and highly trusted).
- Floating window (traditional desktop) metaphors.
- Strict iframe sandboxing for apps.

## Users
The primary user is the creator (a power user/developer) wanting to build personal workflows, organize tasks, and connect custom micro-apps into a unified system.

## Constraints
- **Deployment:** Must run in Docker on a Linux VPS behind Traefik.
- **Backend:** Must use existing Appwrite instance on the `appwrite` docker network.
- **Integration:** Apps must be built natively (e.g., dynamically loaded modules) rather than embedded via iframes.

## Success Criteria
- [ ] The OS shell successfully loads a custom app plugin dynamically.
- [ ] Two apps successfully communicate in real-time via a user-defined node workflow.
- [ ] The system securely authenticates via the Appwrite backend.
- [ ] The dashboard grid layout manages multiple active apps cleanly.
