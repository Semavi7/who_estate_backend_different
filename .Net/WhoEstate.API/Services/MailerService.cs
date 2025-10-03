using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace WhoEstate.API.Services
{
    public class MailerService : IMailerService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<MailerService> _logger;

        public MailerService(IConfiguration configuration, ILogger<MailerService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendResetPasswordMailAsync(string to, string resetUrl)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configuration["Email:From"]));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = "Şifre Sıfırlama Talebi";

                var htmlContent = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Şifre Sıfırlama</title>
                </head>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>
                        <h2 style='color: #2c3e50; text-align: center;'>Şifre Sıfırlama Talebi</h2>
                        <p>Merhaba,</p>
                        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
                        <div style='text-align: center; margin: 30px 0;'>
                            <a href='{resetUrl}' style='background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;'>
                                Şifremi Sıfırla
                            </a>
                        </div>
                        <p>Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                        <p>Saygılarımızla,<br>DERYA EMLAK WHO ESTATE Ekibi</p>
                    </div>
                </body>
                </html>";

                email.Body = new TextPart(TextFormat.Html) { Text = htmlContent };

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(
                    _configuration["Email:Host"],
                    int.Parse(_configuration["Email:Port"]),
                    SecureSocketOptions.StartTls
                );
                
                await smtp.AuthenticateAsync(
                    _configuration["Email:Username"],
                    _configuration["Email:Password"]
                );
                
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation($"Şifre sıfırlama maili gönderildi: {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Mail gönderilirken hata oluştu");
                throw new Exception($"Mail gönderilemedi: {ex.Message}");
            }
        }

        public async Task SendWelcomeMailAsync(string to, string userName)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_configuration["Email:From"]));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = "Hoş Geldiniz - DERYA EMLAK WHO ESTATE";

                var htmlContent = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Hoş Geldiniz</title>
                </head>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;'>
                        <h2 style='color: #2c3e50; text-align: center;'>Hoş Geldiniz {userName}!</h2>
                        <p>DERYA EMLAK WHO ESTATE ailesine katıldığınız için teşekkür ederiz.</p>
                        <p>Artık emlak portföyümüzü inceleyebilir, favori ilanlarınızı kaydedebilir ve daha birçok özellikten yararlanabilirsiniz.</p>
                        <p>Herhangi bir sorunuz veya öneriniz olursa, bizimle iletişime geçmekten çekinmeyin.</p>
                        <p>Saygılarımızla,<br>DERYA EMLAK WHO ESTATE Ekibi</p>
                    </div>
                </body>
                </html>";

                email.Body = new TextPart(TextFormat.Html) { Text = htmlContent };

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(
                    _configuration["Email:Host"],
                    int.Parse(_configuration["Email:Port"]),
                    SecureSocketOptions.StartTls
                );
                
                await smtp.AuthenticateAsync(
                    _configuration["Email:Username"],
                    _configuration["Email:Password"]
                );
                
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                _logger.LogInformation($"Hoş geldin maili gönderildi: {to}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Hoş geldin maili gönderilirken hata oluştu");
                // Don't throw for welcome emails to avoid blocking user registration
            }
        }
    }

    public interface IMailerService
    {
        Task SendResetPasswordMailAsync(string to, string resetUrl);
        Task SendWelcomeMailAsync(string to, string userName);
    }
}