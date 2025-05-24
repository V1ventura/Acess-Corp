namespace AccessCorpUsers.Application.Entities;

public class Result
{
    public bool Success { get; private set; }
    public List<string> Errors { get; private set; }
    public object Data { get; private set; }

    private Result(bool success, List<string> errors, object data)
    {
        Success = success;
        Errors = errors ?? new List<string>();
        Data = data;
    }

    public static Result Ok(object data) => new Result(true, null, data);
    public static Result Fail(List<string> errors) => new Result(false, errors, null);
    public static Result Fail(string error) => new Result(false, new List<string> { error }, null);
}