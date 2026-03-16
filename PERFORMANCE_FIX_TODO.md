# Performance Fix TODO

## Problem: Loading and section switching is slow

## Root Causes Identified:

1. All 12 office components are eagerly imported (no code splitting)
2. 30-second auto-refresh interval running constantly
3. No React.memo optimization
4. Heavy components loaded upfront (ClientManagement is 2000+ lines)

## Fix Plan:

- [ ] 1. Convert eager imports to React.lazy() with Suspense
- [ ] 2. Remove or increase auto-refresh interval
- [ ] 3. Add Suspense boundaries for better UX

## Files to Edit:

- components/OfficeUserDashboard.tsx
