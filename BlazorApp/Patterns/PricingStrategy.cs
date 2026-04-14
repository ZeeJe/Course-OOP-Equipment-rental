using BlazorApp.Data;

namespace BlazorApp.Patterns
{
    public interface IPricingStrategy
    {
        double CalculateCost(string tariffType, int discountPercent);
    }

    /// <summary>
    /// Стратегія 1: Фіксовані тарифи (наприклад 30 хв = 90 грн)
    /// </summary>
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

    /// <summary>
    /// Стратегія 2: Оплата за хвилину (наприклад 2 грн/хв)
    /// Розраховується як: кількість хвилин * ціна за хвилину
    /// </summary>
    public class PerMinuteStrategy : IPricingStrategy
    {
        private const double PRICE_PER_MINUTE = 2.0; // 2 грн за хвилину

        public double CalculateCost(string tariffType, int discountPercent)
        {
            // Парсимо кількість хвилин з tariffType (наприклад "30" або "60")
            if (!int.TryParse(tariffType, out int minutes))
            {
                // Якщо не число, беремо значення за замовчуванням
                minutes = tariffType switch
                {
                    "30_min" or "30m" => 30,
                    "1_hour" or "1h" => 60,
                    "12h" => 720,
                    "24h" => 1440,
                    _ => 30
                };
            }

            double basePrice = minutes * PRICE_PER_MINUTE;

            if (discountPercent > 0)
            {
                double discountAmount = basePrice * (discountPercent / 100.0);
                return basePrice - discountAmount;
            }

            return basePrice;
        }
    }

    /// <summary>
    /// Стратегія 3: Підписка (фіксована плата за період, наприклад 500 грн/місяць)
    /// </summary>
    public class SubscriptionStrategy : IPricingStrategy
    {
        private readonly ApplicationDbContext? _db;

        public SubscriptionStrategy(ApplicationDbContext db)
        {
            _db = db;
        }

        public SubscriptionStrategy()
        {
            _db = null;
        }

        public double CalculateCost(string tariffType, int discountPercent)
        {
            double basePrice = tariffType switch
            {
                "7_days" => 150.0,      // Тиденева підписка
                "30_days" => 500.0,     // Місячна підписка
                "1_month" => 500.0,
                "3_months" => 1200.0,   // 3-місячна підписка
                "annual" => 4500.0,     // Річна підписка
                _ => 500.0
            };

            if (discountPercent > 0)
            {
                double discountAmount = basePrice * (discountPercent / 100.0);
                return basePrice - discountAmount;
            }

            return basePrice;
        }
    }
}