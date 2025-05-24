using AccessCorpUsers.Application.Interfaces;
using QRCoder;
using System.Drawing;

namespace AccessCorpUsers.Application.Services
{
    public class QrCodeGeneratorService : IQrCodeGeneratorService
    {
        public byte[] GenerateQRCode(string text)
        {
            QRCodeGenerator qrGenerator = new QRCodeGenerator();
            QRCodeData qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);

            PngByteQRCode qrCode = new PngByteQRCode(qrCodeData);
            return qrCode.GetGraphic(20);
        }
    }
}
