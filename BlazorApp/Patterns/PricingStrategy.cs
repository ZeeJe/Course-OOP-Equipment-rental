namespace BlazorApp.Patterns
{
    // Оновлений інтерфейс стратегії
    public interface IPricingStrategy
    {
        double CalculateCost(string tariffType, int discountPercent);
    }

    // Нова стратегія: Фіксовані тарифи (Fixed Tariff) з урахуванням штрафу за дострокове завершення
    public class FixedTariffStrategy : IPricingStrategy
    {
        public double CalculateCost(string tariffType, int discountPercent)
        {
            // 1. Визначаємо базову ціну (чим довший тариф, тим вигідніше в перерахунку на час)
            double basePrice = tariffType switch
            {
                "30m" => 90.0,       // 30 хв
                "1h" => 150.0,       // 1 година
                "12h" => 1000.0,     // 12 годин
                "24h" => 1500.0,     // 24 години
                "1m" => 10000.0,     // 1 місяць (Максимальна вигода)
                _ => 150.0           // За замовчуванням
            };

            // 2. Рахуємо знижку
            if (discountPercent > 0)
            {
                double discountAmount = basePrice * (discountPercent / 100.0);
                return basePrice - discountAmount;
            }

            return basePrice;
        }
    }
}