namespace BlazorApp.Models
{
    public class Bicycle : Transport
    {
        public string? FrameSize { get; set; }
        public string? BrakeType { get; set; }
        public bool HasBasket { get; set; }
    }
}