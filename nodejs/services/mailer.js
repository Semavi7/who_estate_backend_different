const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendResetPasswordMail(to, resetUrl) {
    try {
      // Read email template
      const templatePath = path.join(__dirname, '../templates/reset-password.html');
      let htmlContent = fs.readFileSync(templatePath, 'utf8');
      
      // Replace template variables
      htmlContent = htmlContent.replace('{{resetUrl}}', resetUrl);

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@deryaemlak.co',
        to,
        subject: 'Şifre Sıfırlama Talebi',
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Reset password email sent to: ${to}`);
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw error;
    }
  }

  async sendContactMail(contactData) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@deryaemlak.co',
        to: process.env.CONTACT_EMAIL || 'info@deryaemlak.co',
        subject: 'Yeni İletişim Formu Mesajı',
        html: `
          <h2>Yeni İletişim Formu Mesajı</h2>
          <p><strong>Ad Soyad:</strong> ${contactData.name}</p>
          <p><strong>E-posta:</strong> ${contactData.email}</p>
          <p><strong>Telefon:</strong> ${contactData.phone}</p>
          <p><strong>Mesaj:</strong> ${contactData.message}</p>
          <hr>
          <p><em>Bu mesaj web sitesi iletişim formundan gönderilmiştir.</em></p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Contact email sent for: ${contactData.name}`);
    } catch (error) {
      console.error('Error sending contact email:', error);
      throw error;
    }
  }

  async sendClientIntakeMail(clientData) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@deryaemlak.co',
        to: process.env.CLIENT_INTAKE_EMAIL || 'info@deryaemlak.co',
        subject: 'Yeni Müşteri Kaydı',
        html: `
          <h2>Yeni Müşteri Kaydı</h2>
          <p><strong>Ad Soyad:</strong> ${clientData.name}</p>
          <p><strong>E-posta:</strong> ${clientData.email}</p>
          <p><strong>Telefon:</strong> ${clientData.phone}</p>
          <p><strong>Emlak Tipi:</strong> ${clientData.propertyType}</p>
          <p><strong>Bütçe:</strong> ${clientData.budget}</p>
          <p><strong>Lokasyon:</strong> ${clientData.location}</p>
          <p><strong>Zaman Çizelgesi:</strong> ${clientData.timeline}</p>
          <p><strong>Mesaj:</strong> ${clientData.message}</p>
          <hr>
          <p><em>Bu mesaj müşteri kayıt formundan gönderilmiştir.</em></p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Client intake email sent for: ${clientData.name}`);
    } catch (error) {
      console.error('Error sending client intake email:', error);
      throw error;
    }
  }
}

// Create singleton instance
const mailService = new MailService();

module.exports = {
  sendResetPasswordMail: mailService.sendResetPasswordMail.bind(mailService),
  sendContactMail: mailService.sendContactMail.bind(mailService),
  sendClientIntakeMail: mailService.sendClientIntakeMail.bind(mailService)
};