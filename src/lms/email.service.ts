import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER ?? 'replace-me',
      pass: process.env.SMTP_PASS ?? 'replace-me',
    },
  });

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'lms@example.com',
      to,
      subject,
      html,
    });
  }
}
