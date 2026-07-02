import { Injectable } from '@nestjs/common';

export type UserRole = 'admin' | 'teacher' | 'assistant-teacher' | 'student';

export interface GoogleProfile {
  email: string;
  name: string;
  picture?: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  sessionId?: string;
  managedGradeIds: string[];
  managedClassIds: string[];
}

export interface SessionPayload {
  role: UserRole;
  sessionId: string;
  email: string;
}

export interface GradeRecord {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId: string;
}

export interface ClassRecord {
  id: string;
  name: string;
  code: string;
  gradeId: string;
  teacherId: string;
}

@Injectable()
export class LmsService {
  private users: UserRecord[] = [];
  private grades: GradeRecord[] = [];
  private classes: ClassRecord[] = [];
  private sessions = new Map<string, SessionPayload>();

  authenticateGoogle(
    googleIdToken: string,
    role: UserRole,
    profile: GoogleProfile,
  ) {
    const sessionId = `session-${Date.now()}`;
    const user: UserRecord = {
      id: `user-${this.users.length + 1}`,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      role,
      sessionId,
      managedGradeIds: [],
      managedClassIds: [],
    };

    this.users.push(user);
    this.sessions.set(sessionId, {
      role,
      sessionId,
      email: profile.email,
    });

    return {
      user,
      sessionId,
      cookieValue: `session=${sessionId}; role=${role}`,
    };
  }

  getSession(sessionId?: string): SessionPayload | null {
    if (!sessionId) return null;
    return this.sessions.get(sessionId) ?? null;
  }

  getUserBySession(sessionId?: string): UserRecord | null {
    if (!sessionId) return null;
    const session = this.getSession(sessionId);
    if (!session) return null;
    return this.users.find((user) => user.email === session.email) ?? null;
  }

  createGrade(name: string, description: string, teacherId: string): GradeRecord {
    const grade: GradeRecord = {
      id: `grade-${this.grades.length + 1}`,
      name,
      code: `GRADE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      description,
      teacherId,
    };
    this.grades.push(grade);
    return grade;
  }

  createClass(name: string, gradeId: string, teacherId: string): ClassRecord {
    const classItem: ClassRecord = {
      id: `class-${this.classes.length + 1}`,
      name,
      code: `CLASS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      gradeId,
      teacherId,
    };
    this.classes.push(classItem);
    return classItem;
  }
}
