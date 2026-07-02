import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) NOT NULL UNIQUE,
        name varchar(255) NOT NULL,
        picture varchar(255),
        role varchar(255) NOT NULL DEFAULT 'student',
        googleId varchar(255),
        isSuspended boolean NOT NULL DEFAULT false,
        createdAt timestamp NOT NULL DEFAULT now(),
        updatedAt timestamp NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS grades (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL UNIQUE,
        code varchar(255) NOT NULL UNIQUE,
        description varchar(255),
        teacherId uuid NOT NULL,
        createdAt timestamp NOT NULL DEFAULT now(),
        CONSTRAINT fk_grades_teacher FOREIGN KEY (teacherId) REFERENCES users(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS grades;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
