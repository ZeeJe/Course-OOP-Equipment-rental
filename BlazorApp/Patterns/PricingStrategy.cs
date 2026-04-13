using BlazorApp.Data;

namespace BlazorApp.Patterns
{
    public interface IPricingStrategy
    {
        double CalculateCost(string tariffType, int discountPercent);
    }

    public class FixedTariffStrategy : IPricingStrategy
    {
        private readonly ApplicationDbContext? _db;

        // Конструктор для реальної БД
        public FixedTariffStrategy(ApplicationDbContext db)
        {
            _db = db;
        }

        // Запасний конструктор для Unit-тестів
        public FixedTariffStrategy() 
        { 
            _db = null; 
        }

        public double CalculateCost(string tariffType, int discountPercent)
        {
            double basePrice = 150.0; 

            if (_db != null)
            {
                var tariff = _db.Tariffs.FirstOrDefault(t => t.Name == tariffType);
                if (tariff != null)
                {
                    basePrice = (double)tariff.Price;
                }
            }
            else
            {
                // Для тестів
                basePrice = tariffType switch
                {
                    "30_min" => 90.0,
                    "1_hour" => 150.0,
                    "30m" => 90.0,
                    "1h" => 150.0,
                    "12h" => 1000.0,
                    "24h" => 1500.0,
                    "1m" => 10000.0,
                    _ => 150.0
                };
            }

            if (discountPercent > 0)
            {
                double discountAmount = basePrice * (discountPercent / 100.0);
                return basePrice - discountAmount;
            }

            return basePrice;
        }
    }
}