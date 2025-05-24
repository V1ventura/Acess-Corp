namespace AccessCorpUsers.Domain.Validations.DocsValidation
{
    public class Utils
    {
        public static string OnlyNumbers(string value)
        {
            var onlyNumber = "";

            foreach (var digit in value)
            {
                if (char.IsDigit(digit))
                {
                    onlyNumber += digit;
                }
            }

            return onlyNumber.Trim();
        }
    }
}

