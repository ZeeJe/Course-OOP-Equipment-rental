namespace BlazorApp.Models
{
    public class Scooter : Transport
    {
        public int? MotorPower { get; set; }
        public string? FirmwareVersion { get; set; }
        public int? MaxLoad { get; set; }
        public int? SpeedLimit { get; set; }
    }
}