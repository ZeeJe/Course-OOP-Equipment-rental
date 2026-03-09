namespace BlazorApp.Models
{
    public abstract class Vehicle
    {
        public int Id { get; set; }
        public string Brand { get; set; } = string.Empty;
        public decimal RentalPricePerHour { get; set; }
        public bool IsAvailable { get; set; } = true;
    }
}