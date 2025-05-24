using System.ComponentModel.DataAnnotations;

namespace AccessCorpUsers.Application.Entities
{
    public class ResidentVM
    {

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [StringLength(40, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
        public string Name { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [StringLength(40, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [EmailAddress(ErrorMessage = "O campo {0} está em formato inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [RegularExpression(@"^\d{8,9}$", ErrorMessage = "O número de telefone deve conter apenas 8 ou 9 dígitos.")] 
        public string Phone { get; set; }
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "O campo {0} precisa conter {1} caracteres")]
        public string Cpf { get; set; }
        public string Image { get; set; }
        public string ImageUpload { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "O campo {0} precisa ter {1} digitos")]
        public string Cep { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        public int HouseNumber { get; set; }
    }
}
