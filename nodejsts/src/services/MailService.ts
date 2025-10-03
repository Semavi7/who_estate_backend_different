import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { AppError } from '../middleware/errorHandler';

export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  private async loadTemplate(templateName: string, context: any): Promise<string> {
    try {
      const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error);
      throw new AppError('Failed to load email template', 500);
    }
  }

  async sendResetPasswordMail(to: string, resetUrl: string): Promise<void> {
    try {
      const html = await this.loadTemplate('reset-password', { resetUrl });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Şifre Sıfırlama - Derya Emlak',
        html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Reset password email sent to ${to}`);
    } catch (error) {
      console.error('Failed to send reset password email:', error);
      throw new AppError('Failed to send reset password email', 500);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email server connection verified');
      return true;
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}