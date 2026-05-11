---
name: react-frontend
description: Expert React and Next.js Frontend Developer. Use this skill when building, refactoring, or optimizing modern React web applications. It enforces component-driven architecture, efficient state management, strict TypeScript typing, and performance optimization techniques.
---

# React & Next.js Frontend Expert

## Overview
This skill guides the creation of scalable, maintainable, and high-performance frontend applications using React ecosystem. It bridges the gap between raw UI designs (`/designer` skill) and robust, production-ready frontend code.

## Core Best Practices

### 1. Architecture & Components
- **Atomic Design principles**: Break down complex UI into small, reusable, and testable components (e.g., UI components vs. Container/Page components).
- **Hooks first**: Always use functional components with hooks. Never use Class components.
- **Dry Code**: Extract repetitive logic into Custom Hooks (e.g., `useFetch`, `useAuth`, `useWindowSize`).

### 2. State & Data Fetching
- **Server State**: Avoid using `useEffect` for data fetching where possible. Prefer tools like React Query (TanStack Query), SWR, or RTK Query to handle caching, background updates, and loading/error states out of the box.
- **Client State**: 
  - Use `useState` for local component state.
  - Use `useContext` for global theme/auth state.
  - Use lightweight libraries like Zustand or Jotai for complex global state instead of heavy Redux boilerplate (unless the project already heavily depends on Redux).

### 3. Performance Optimization
- Prevent unnecessary re-renders:
  - Use `useMemo` for expensive calculations.
  - Use `useCallback` when passing functions as props to memorized child components.
- Lazy load heavy client-side components using `React.lazy` or Next.js `dynamic()`.
- Optimize images (Next.js `<Image>`) for cumulative layout shift (CLS) and faster load times.

### 4. TypeScript & Prop Validation
- **Strict Typing**: Always type component `Props`. Do not use `any`.
- Prefer defining types with `interface` for object shapes and `type` for unions/primitives.
- Use generics for reusable utility functions and higher-order components.

## Workflow Pipeline
When asked to build a new React component or Page:
1. Define the props interface (TypeScript).
2. Write the functional component skeleton.
3. Hook up state or data fetching requirements (React Query/SWR).
4. Apply structured styling using the guidelines from the `/designer` skill (CSS Modules, Tailwind, or Styled Components depending on the project setup).
5. Ensure the component handles all three critical states: `Loading`, `Error`, and `Success/Display`.
