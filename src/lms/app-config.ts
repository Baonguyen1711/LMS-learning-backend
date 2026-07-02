export const appConfig = {
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  postgres: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    username: process.env.POSTGRES_USER ?? 'postgres',
    password: process.env.POSTGRES_PASSWORD ?? 'postgres',
    database: process.env.POSTGRES_DB ?? 'lms_backend',
  },
  storage: {
    bucket: process.env.S3_BUCKET ?? 'lms-storage',
    region: process.env.S3_REGION ?? 'us-east-1',
    accessKey: process.env.S3_ACCESS_KEY ?? 'replace-me',
    secretKey: process.env.S3_SECRET_KEY ?? 'replace-me',
  },
};
