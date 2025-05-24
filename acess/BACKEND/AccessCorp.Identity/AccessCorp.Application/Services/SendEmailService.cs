using Microsoft.Extensions.Options;
using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace AccessCorp.Application.Services;

public class SendEmailService : ISendEmailService
{
    private readonly SendGridSettings _sendGridSettings;

    public SendEmailService(IOptions<SendGridSettings> sendGridSettings)
    {
        _sendGridSettings = sendGridSettings.Value;
    }

    public async Task<bool> SendEmail(string toEmail, string token)
    {
        try
        {
            var client = new SendGridClient(_sendGridSettings.ApiKey);
            var from = new EmailAddress(_sendGridSettings.FromEmail, _sendGridSettings.FromName);
            var to = new EmailAddress(toEmail);
            var subject = "Redefinição de Password - AccessCorp";
            var body = EmailBody(token);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, body, body);

            var response = await client.SendEmailAsync(msg);

            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao enviar e-mail: {ex.Message}");
            return false;
        }
    }

    private static string EmailBody(string token)
    {
        return $@"
            <html>
                <head>
                    {CssEmailBody()}
                </head>
                <body>
                    <div class='container'>
                        <h2>Redefinição de Password - AccessCorp</h2>
                        <p>Olá,</p>
                        <p>Recebemos uma solicitação para redefinir a sua senha. Para concluir o processo, utilize o código abaixo:</p>
                        <span class='token'>{token}</span>
                        <p>Por favor, insira este código na página de redefinição de senha para concluir a alteração.</p>
                        <p>Se você não solicitou essa redefinição, por favor, ignore este e-mail.</p>
                        <div class='footer'>
                            <p>Atenciosamente,<br/>Equipe AccessCorp</p>
                        </div>
                    </div>
                </body>
            </html>";
    }

    private static string CssEmailBody()
    { 
        return @"
           <style>
               body {
                   font-family: Arial, sans-serif;
                   background-color: #f4f4f9;
                   margin: 0;
                   padding: 0;
               }
               .container {
                   width: 100%;
                   max-width: 600px;
                   margin: 0 auto;
                   padding: 20px;
                   background-color: #ffffff;
                   border-radius: 8px;
                   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
               }
               h2 {
                   color: #2c3e50;
                   text-align: center;
               }
               p {
                   font-size: 16px;
                   color: #34495e;
               }
               .token {
                   font-size: 18px;
                   font-weight: bold;
                   color: #e74c3c;
                   background-color: #ecf0f1;
                   padding: 10px;
                   border-radius: 5px;
                   text-align: center;
                   display: block;
                   margin: 20px 0;
               }
               .footer {
                   font-size: 14px;
                   color: #7f8c8d;
                   text-align: center;
                   margin-top: 30px;
               }
               .footer a {
                   color: #3498db;
                   text-decoration: none;
               }
           </style>
        ";
    }
}