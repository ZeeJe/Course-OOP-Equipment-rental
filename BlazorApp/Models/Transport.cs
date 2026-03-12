namespace BlazorApp.Models
{
    public abstract class Transport
    {
        public int Id { get; set; }
        public double? BatteryLevel { get; set; }
        public string StateCode { get; set; } = string.Empty;
    }
}