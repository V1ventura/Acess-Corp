using System.Text.RegularExpressions;
using AccessCorp.Domain.Interfaces;

namespace AccessCorp.Domain.Services;

public class CepValidationService : ICepValidationService
{
    public bool CepIsValid(string cep)
    {
        if (string.IsNullOrWhiteSpace(cep))
            return false;

        string normalizedCep = Normalize(cep);

        return HasOnlyNumbers(normalizedCep) && HasValidLength(normalizedCep);
    }

    private string Normalize(string cep)
    {
        return new string(cep.Where(char.IsDigit).ToArray());
    }

    private bool HasOnlyNumbers(string cep)
    {
        return cep.All(char.IsDigit);
    }

    private bool HasValidLength(string cep)
    {
        return cep.Length == 8;
    }
}