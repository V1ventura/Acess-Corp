namespace AccessCorpUsers.Domain.Validations.DocsValidation
{
    public class CepValidation
    {
        public const int CepLength = 8;

        public static bool Validate(string cep)
        {
            var cepNumeros = Utils.OnlyNumbers(cep); 

            if (!ValidLength(cepNumeros)) return false;

            return !HasRepeatedDigits(cepNumeros); 
        }

        private static bool ValidLength(string value)
        {
            return value.Length == CepLength;
        }

        private static bool HasRepeatedDigits(string value)
        {
            string[] invalidNumbers =
            {
                "00000000",
                "11111111",
                "22222222",
                "33333333",
                "44444444",
                "55555555",
                "66666666",
                "77777777",
                "88888888",
                "99999999"
            };

            return invalidNumbers.Contains(value);
        }
    }
}
