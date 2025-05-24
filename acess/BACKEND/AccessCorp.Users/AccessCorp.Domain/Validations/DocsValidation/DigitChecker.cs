namespace AccessCorpUsers.Domain.Validations.DocsValidation
{
    public class DigitChecker
    {
        private string _number;
        private const int Module = 11;
        private readonly List<int> _multipliers = [2, 3, 4, 5, 6, 7, 8, 9];
        private readonly Dictionary<int, string> _replacements = [];
        private readonly bool _complementaryToModule = true;

        public DigitChecker(string number)
        {
            _number = number;
        }

        public DigitChecker WithMultipliersUpTo(int firstMultiplier, int lastMultiplier)
        {
            _multipliers.Clear();
            for (var i = firstMultiplier; i <= lastMultiplier; i++)
            {
                _multipliers.Add(i);
            }

            return this;
        }

        public DigitChecker Replacing(string substitute, params int[] digits)
        {
            foreach (var digit in digits)
            {
                _replacements[digit] = substitute;
            }

            return this;
        }

        public void AddDigit(string digit)
        {
            _number = string.Concat(_number, digit);
        }

        public string CalculateDigit()
        {
            return !(_number.Length > 0) ? "" : GetDigitSum();
        }

        private string GetDigitSum()
        {
            var sum = 0;
            for (int i = _number.Length - 1, m = 0; i >= 0; i--)
            {
                var product = (int)char.GetNumericValue(_number[i]) * _multipliers[m];
                sum += product;

                if (++m >= _multipliers.Count) m = 0;
            }

            var mod = (sum % Module);
            var result = _complementaryToModule ? Module - mod : mod;

            return _replacements.ContainsKey(result) ? _replacements[result] : result.ToString();
        }
    }
}
