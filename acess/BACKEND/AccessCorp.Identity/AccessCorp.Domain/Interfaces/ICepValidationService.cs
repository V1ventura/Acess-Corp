namespace AccessCorp.Domain.Interfaces;

public interface ICepValidationService
{
    public bool CepIsValid(string cep);
}