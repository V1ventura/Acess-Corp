using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;

namespace AccessCorpUsers.Application.Services
{
    public class ImageService : IImageService
    {
        public Result UploadFile(string file, string fileName)
        {
            if (string.IsNullOrEmpty(file))
                return Result.Fail("Forneça uma imagem!");

            var imageDataByteArray = Convert.FromBase64String(file);

            return Result.Ok(imageDataByteArray);
        }

        //public async Task<string> GetResidentImage(string email)
        //{
        //    var resident = await _residentRepository.GetResidentByEmail(email);
        //    if (resident?.Image == null)
        //        return null;

        //    return Convert.ToBase64String(resident.Image); 
        //}
    }
}
