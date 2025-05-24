namespace AccessCorpUsers.Application.Interfaces
{
    public interface IQrCodeGeneratorService
    {
        public byte[] GenerateQRCode(string text);
    }
}
