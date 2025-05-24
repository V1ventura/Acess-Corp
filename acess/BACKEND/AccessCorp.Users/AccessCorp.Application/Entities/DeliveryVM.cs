using System.ComponentModel.DataAnnotations;

namespace AccessCorpUsers.Application.Entities
{
    public class DeliveryVM
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [StringLength(40, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
        public string Receiver { get; set; }

        public DateTime DeliveryDate { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [StringLength(40, MinimumLength = 2, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
        public string Enterprise { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [StringLength(40, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
        public string DeliveredTo { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        public int NumberHouse { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório ")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "O campo {0} precisa ter {1} digitos")]
        public string Cep { get; set; }
    }
}
