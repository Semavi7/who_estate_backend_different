import os
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from fastapi import HTTPException, status
from typing import Optional

class MailService:
    def __init__(self):
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", 587))
        self.smtp_user = os.getenv("SMTP_USER")
        self.smtp_password = os.getenv("SMTP_PASS")
        self.smtp_secure = os.getenv("SMTP_SECURE", "False").lower() == "true"

    async def send_reset_password_mail(self, to_email: str, reset_url: str):
        """Send password reset email"""
        subject = "Şifre Sıfırlama Talebi"
        
        # HTML template for reset password email
        html_template = """
        <table style="max-width:600px;margin:auto;font-family:Arial,Helvetica,sans-serif">
          <tr><td>
            <h2>Şifre Sıfırlama</h2>
            <p>Şifrenizi yenilemek için aşağıdaki butona tıklayın:</p>
            <p>
              <a href="{{ reset_url }}" style="display:inline-block;padding:10px 16px;text-decoration:none;border-radius:8px;border:1px solid #ddd">
                Şifreyi Sıfırla
              </a>
            </p>
            <p>Bu bağlantı kısa süreliğine geçerlidir. Siz talep etmediyseniz bu e-postayı yok sayabilirsiniz.</p>
          </td></tr>
        </table>
        """
        
        # Render template
        template = Template(html_template)
        html_content = template.render(reset_url=reset_url)
        
        # Plain text version
        text_content = f"""
        Şifre Sıfırlama
        
        Şifrenizi yenilemek için aşağıdaki bağlantıyı kullanın:
        {reset_url}
        
        Bu bağlantı kısa süreliğine geçerlidir. Siz talep etmediyseniz bu e-postayı yok sayabilirsiniz.
        """
        
        await self._send_email(to_email, subject, text_content, html_content)

    async def _send_email(
        self, 
        to_email: str, 
        subject: str, 
        text_content: str, 
        html_content: Optional[str] = None
    ):
        """Send email using SMTP"""
        if not all([self.smtp_user, self.smtp_password]):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Email configuration is missing"
            )

        try:
            # Create message
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = self.smtp_user
            message['To'] = to_email

            # Attach text and HTML parts
            part1 = MIMEText(text_content, 'plain')
            message.attach(part1)

            if html_content:
                part2 = MIMEText(html_content, 'html')
                message.attach(part2)

            # Send email
            async with aiosmtplib.SMTP(
                hostname=self.smtp_host,
                port=self.smtp_port,
                use_tls=self.smtp_secure
            ) as server:
                await server.login(self.smtp_user, self.smtp_password)
                await server.sendmail(self.smtp_user, to_email, message.as_string())

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to send email: {str(e)}"
            )

# Create singleton instance
mail_service = MailService()