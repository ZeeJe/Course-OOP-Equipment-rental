namespace BlazorApp.Models
{
    public class Bicycle : Vehicle
    {
        public string BikeType { get; set; } = string.Empty; 
        public int FrameSize { get; set; }
    }
}