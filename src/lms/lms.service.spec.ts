import { LmsService } from './lms.service';

describe('LmsService', () => {
  let service: LmsService;

  beforeEach(() => {
    service = new LmsService();
  });

  it('creates a session for a verified Google mock login', () => {
    const result = service.authenticateGoogle('mock-google-id-token', 'student', {
      email: 'student@example.com',
      name: 'Student User',
      picture: 'https://example.com/avatar.png',
    });

    expect(result.user.email).toBe('student@example.com');
    expect(result.sessionId).toBeDefined();
    expect(result.user.role).toBe('student');
  });

  it('creates a grade with a unique code', () => {
    const grade = service.createGrade('Grade 8', 'Junior high', 'teacher-1');

    expect(grade.code).toMatch(/^GRADE-/);
    expect(grade.name).toBe('Grade 8');
  });
});
