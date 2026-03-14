using System;
using BlazorApp.Models; // Дозволяє бачити класи Transport, Scooter, Bicycle

namespace BlazorApp.Patterns // <-- ОСЬ ЦЕ ГОЛОВНЕ! Має бути Patterns
{
    // Абстрактна фабрика
    public abstract class TransportFactory
    {
        public abstract Transport CreateTransport();
    }

    // Фабрика для створення самокатів
    public class ScooterFactory : TransportFactory
    {
        public override Transport CreateTransport()
        {
            var rnd = new Random();
            return new Scooter
            {
                StateCode = "AA" + rnd.Next(1000, 9999) + "XX",
                BatteryLevel = 100,
                MotorPower = 350,
                Latitude = 50.6199 + (rnd.NextDouble() * 0.04 - 0.02),
                Longitude = 26.2516 + (rnd.NextDouble() * 0.04 - 0.02)
            };
        }
    }

    // Фабрика для створення велосипедів
    public class BicycleFactory : TransportFactory
    {
        public override Transport CreateTransport()
        {
            var rnd = new Random();
            return new Bicycle
            {
                StateCode = "BIKE-" + rnd.Next(100, 999),
                FrameSize = "L",
                HasBasket = true,
                Latitude = 50.6199 + (rnd.NextDouble() * 0.04 - 0.02),
                Longitude = 26.2516 + (rnd.NextDouble() * 0.04 - 0.02)
            };
        }
    }
}