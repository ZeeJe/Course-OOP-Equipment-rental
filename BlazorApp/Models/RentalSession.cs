namespace BlazorApp.Models
{
    public class RentalSession
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int TransportId { get; set; }
        public Transport? Transport { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string? EndTime { get; set; }
        public double? TotalCost { get; set; }
    }
}