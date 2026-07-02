# LMS Backend API Reference

This document describes the backend endpoints available for the frontend.

## Authentication

### POST /api/auth/google
Create or return a user from the Google sign-in flow.

Request body:
- role: string
- profile: object containing email, name, picture, googleId

Response:
- user
- accessToken

### GET /api/auth/me
Returns the authenticated user profile.

Headers:
- Authorization: Bearer <token>

## Users and roles

### GET /api/admin/users
Admin-only endpoint to list all users.

### POST /api/admin/users
Admin-only endpoint to create a new user.

### PATCH /api/admin/users/:id
Admin-only endpoint to update a user.

### PATCH /api/admin/users/:id/suspend
Admin-only endpoint to suspend a user.

### DELETE /api/admin/users/:id
Admin-only endpoint to delete a user.

## Grades and classes

### POST /api/grades
Create a grade. Teacher/admin only.

Body:
- name
- description
- teacherId

### GET /api/grades
List grades.

### POST /api/classes
Create a class. Teacher/admin only.

Body:
- name
- gradeId
- teacherId

### GET /api/classes
List classes.

### PATCH /api/classes/:id/students
Add a student to a class.

### DELETE /api/classes/:id/students/:studentId
Remove a student from a class.

## Tests and assignments

### POST /api/tests
Upload a test. Teacher/admin only.

Form-data:
- files: PDF or other test assets
- title
- description
- questionType
- difficulty
- gradeLevel
- hashtags
- answerFormat
- latexTemplate
- ownerId

### GET /api/tests
List tests with optional search query parameter q.

### POST /api/tests/:id/assign
Assign a test to a grade or class.

Body:
- gradeId or classId
- dueDate
- showAnswersAfterSubmission
- maxRetries
- displayMode
- antiCheatEnabled
- createdById

## Submissions and grading

### POST /api/submissions
Submit a student response.

Body:
- assignmentId
- studentId
- answers

### GET /api/submissions
List submissions. Supports studentId filter.

### POST /api/submissions/:id/grade
Grade a submission.

Body:
- score
- feedback
- gradedById

## Comments

### POST /api/comments
Create a comment for a class, grade, test, or assignment.

Body:
- content
- targetType
- targetId
- authorId

### GET /api/comments
Retrieve comments for a target.

## Theorems

### POST /api/theorems
Create a theorem. Teacher/admin only.

Body:
- title
- content
- latexContent
- fileName
- storagePath
- ownerId

### GET /api/theorems
Search theorem bank.

Query params:
- query

## Notifications

### GET /api/notifications/:userId
Get notifications for a user.
