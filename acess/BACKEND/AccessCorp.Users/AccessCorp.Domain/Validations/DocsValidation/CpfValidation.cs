namespace AccessCorpUsers.Domain.Validations.DocsValidation
{
    public class CpfValidation
    {
        public const int CpfLength = 11;

        public static bool Validate(string cpf)
        {
            var cpfNumeros = Utils.OnlyNumbers(cpf);

            if (!ValidLength(cpfNumeros)) return false;

            return !HasRepeatedDigits(cpfNumeros) && HasDigitValid(cpfNumeros);
        }

        private static bool ValidLength(string value)
        {
            return value.Length == CpfLength;
        }

        private static bool HasRepeatedDigits(string value)
        {
            string[] invalidNumbers =
            [
                "00000000000",
                "11111111111",
                "22222222222",
                "33333333333",
                "44444444444",
                "55555555555",
                "66666666666",
                "77777777777",
                "88888888888",
                "99999999999"
            ];
            return invalidNumbers.Contains(value);
        }

        private static bool HasDigitValid(string value)
        {
            var number = value.Substring(0, CpfLength - 2);

            var digitChecker = new DigitChecker(number)
                .WithMultipliersUpTo(2, 11)
                .Replacing("0", 10, 11);

            var firstDigit = digitChecker.CalculateDigit();

            digitChecker.AddDigit(firstDigit);

            var secondDigit = digitChecker.CalculateDigit();

            return string.Concat(firstDigit, secondDigit) == value.Substring(CpfLength - 2, 2);
        }
    }
}