namespace BlazorApp.Models
{
    // Базовий абстрактний клас (спільні властивості для всієї техніки)
    public abstract class Transport
    {
        public int Id { get; set; }
        public string StateCode { get; set; } = string.Empty;

        // Координати для відображення на інтерактивній карті 
        // (За замовчуванням стоять координати Рівненської області / Клевані)
        // Змінили на координати центру Рівного
        public double Latitude { get; set; } = 50.6199;
        public double Longitude { get; set; } = 26.2516;
    }

    // Клас Самоката (успадковує все від Transport і додає своє)
    public class Scooter : Transport
    {
        public int BatteryLevel { get; set; }
        public int MotorPower { get; set; }
    }

    // Клас Велосипеда (успадковує все від Transport і додає своє)
    public class Bicycle : Transport
    {
        public string FrameSize { get; set; } = string.Empty;
        public bool HasBasket { get; set; }
    }
}