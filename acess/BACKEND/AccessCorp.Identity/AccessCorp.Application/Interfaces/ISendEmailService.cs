namespace AccessCorp.Application.Interfaces;

public interface ISendEmailService
{
    public Task<bool> SendEmail(string toEmail, string token);
}