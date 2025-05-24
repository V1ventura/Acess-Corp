namespace AccessCorpUsers.Domain.Entities
{
    public class Delivery : Entity
    {
        public string Receiver { get; set; }
        public DateTime DeliveryDate { get; set; }
        public string Enterprise { get; set; }
        public string DeliveredTo { get; set; }
        public int NumberHouse { get; set; }
        public string Cep { get; set; }
    }
}
