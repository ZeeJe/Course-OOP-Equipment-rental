namespace BlazorApp.Models
{
    public class Scooter : Vehicle
    {
        public int BatteryCapacity { get; set; }
        public int CurrentChargePercentage { get; set; } = 100;
    }
}