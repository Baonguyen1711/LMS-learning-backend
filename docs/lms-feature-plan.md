# LMS NestJS Feature Plan

## Authentication and access control
- Google OAuth login is mocked with a placeholder ID token and profile payload.
- The backend returns HTTP-only cookies for sessionId and role.
- The /api/me endpoint verifies the session and returns the current user.
- Role-based guards protect teacher, student, assistant-teacher, and admin endpoints.

## Grade and class management
- Teachers can create grades and classes with generated unique codes.
- Future work can add Excel import, student roster management, and grade/class ownership checks.

## Test bank and assignment flow
- Teachers can upload tests via the test bank endpoint.
- Mock metadata supports test name, grade, difficulty, and hashtags.
- Assignment settings include due date, answer visibility, retry count, display mode, and anti-cheat toggle.

## Theorem bank and notifications
- Teachers can add theorem records and students can search them.
- Notification endpoints are scaffolded for future real-time email/web notification delivery.

## Media and PostgreSQL readiness
- The API is prepared for file and image storage via a PostgreSQL-backed extension layer.
- Replace the mock session and storage implementation with real PostgreSQL repositories and cloud media uploads when credentials are available.
