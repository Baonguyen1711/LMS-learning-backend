# Complete LMS Backend Endpoint Reference

This file documents every endpoint currently implemented in the backend so the frontend team can integrate against it.

## Base URL

- http://localhost:3000

## Authentication

### POST /api/auth/google
Creates or retrieves a user from a Google sign-in payload and sets session cookies.

Request body:
- role: admin | teacher | assistant-teacher | student
- profile: { email, name, picture?, googleId? }

Response:
- user
- sessionId

Cookies set:
- sessionId: httpOnly cookie containing the session identifier
- role: httpOnly cookie containing the user role

### GET /api/auth/me
Returns the authenticated user profile based on the session cookies.

Cookies required:
- sessionId
- role

## Admin endpoints

### GET /api/admin/users
List all users. Admin only.

### POST /api/admin/users
Create a user. Admin only.

Request body:
- email
- name
- picture?
- role?

### PATCH /api/admin/users/:id
Update a user. Admin only.

### PATCH /api/admin/users/:id/suspend
Suspend a user. Admin only.

### DELETE /api/admin/users/:id
Delete a user. Admin only.

### GET /api/admin/grades
List all grades. Admin only.

### POST /api/admin/grades
Create a grade. Admin only.

Request body:
- name
- description?
- teacherId

### PATCH /api/admin/grades/:id
Update a grade. Admin only.

### DELETE /api/admin/grades/:id
Delete a grade. Admin only.

### GET /api/admin/classes
List all classes. Admin only.

### POST /api/admin/classes
Create a class. Admin only.

Request body:
- name
- gradeId
- teacherId

### PATCH /api/admin/classes/:id
Update a class. Admin only.

### DELETE /api/admin/classes/:id
Delete a class. Admin only.

## Grades and classes

### POST /api/grades
Create a grade. Teacher or admin.

Request body:
- name
- description?
- teacherId

### GET /api/grades
List grades.

### POST /api/classes
Create a class. Teacher or admin.

Request body:
- name
- gradeId
- teacherId

### GET /api/classes
List classes.

### PATCH /api/classes/:id/students
Add a student to a class. Teacher or admin.

Request body:
- studentId

### DELETE /api/classes/:id/students/:studentId
Remove a student from a class. Teacher or admin.

## Tests and assignments

### POST /api/tests
Create a test and optionally upload files. Teacher or admin.

Multipart form-data:
- files: file[]
- title
- description?
- questionType
- difficulty?
- gradeLevel?
- hashtags?
- answerFormat?
- latexTemplate?
- ownerId

### GET /api/tests
List tests. Supports optional search query: ?q=term

### POST /api/tests/:id/assign
Assign a test to a grade or class. Teacher or admin.

Request body:
- testId
- gradeId?
- classId?
- dueDate?
- showAnswersAfterSubmission?
- maxRetries?
- displayMode?
- antiCheatEnabled?
- createdById

## Submissions

### POST /api/submissions
Submit a student response. Student only.

Request body:
- assignmentId
- studentId
- answers?

### GET /api/submissions
List submissions. Supports ?studentId=...

### POST /api/submissions/:id/grade
Grade a submission. Teacher, assistant-teacher, or admin.

Request body:
- score
- feedback?
- gradedById

## Comments

### POST /api/comments
Create a comment.

Request body:
- content
- targetType
- targetId
- authorId

### GET /api/comments
List comments for a target. Supports ?targetType=...&targetId=...

## Theorems

### POST /api/theorems
Create a theorem. Teacher or admin.

Request body:
- title
- content?
- latexContent?
- fileName?
- storagePath?
- ownerId

### GET /api/theorems
Search the theorem bank. Supports ?query=...

## Notifications

### GET /api/notifications/:userId
Get notifications for a specific user.
