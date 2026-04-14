using BlazorApp.Models;

namespace BlazorApp.Patterns;

/// <summary>
/// Інтерфейс State паттерну для керування станом транспорту
/// </summary>
public interface ITransportState
{
    /// <summary>
    /// Обробляє запит на оренду транспорту
    /// </summary>
    Task HandleRent(Transport transport);

    /// <summary>
    /// Обробляє повернення (завершення оренди) транспорту
    /// </summary>
    Task HandleReturn(Transport transport);
}

/// <summary>
/// Стан: Транспорт доступний для оренди
/// </summary>
public class AvailableState : ITransportState
{
    public Task HandleRent(Transport transport) => Task.CompletedTask;

    public Task HandleReturn(Transport transport)
    {
        // Повер потім це викликається, коли транспорт уже в Available - це ненормально
        throw new InvalidOperationException("Транспорт вже доступний, немає чого повертати!");
    }
}

/// <summary>
/// Стан: Транспорт на обслуговуванні
/// </summary>
public class MaintenanceState : ITransportState
{
    public Task HandleRent(Transport transport)
    {
        // Не можна взяти на оренду транспорт на ремонті
        throw new TransportUnavailableException("Транспорт на обслуговуванні!");
    }

    public Task HandleReturn(Transport transport)
    {
        // Якщо на ремонті - залишається на ремонті
        return Task.CompletedTask;
    }
}

/// <summary>
/// Стан: Транспорт в оренді (в користуванні)
/// </summary>
public class InUseState : ITransportState
{
    public Task HandleRent(Transport transport)
    {
        // Не можна взяти на оренду транспорт, який вже орендований
        throw new TransportUnavailableException("Транспорт уже орендовано!");
    }

    public Task HandleReturn(Transport transport)
    {
        // Повернення дозволено - переводимо в Available
        return Task.CompletedTask;
    }
}