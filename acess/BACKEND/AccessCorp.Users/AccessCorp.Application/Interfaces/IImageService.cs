using AccessCorpUsers.Application.Entities;

namespace AccessCorpUsers.Application.Interfaces
{
    public interface IImageService
    {
        public Result UploadFile(string file, string fileName);
    }
}
