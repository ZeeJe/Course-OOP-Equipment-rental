using BlazorApp.Models;

namespace BlazorApp.Patterns;

public interface ITransportState
{
    Task HandleRent(Transport transport);
}

public class AvailableState : ITransportState
{
    public Task HandleRent(Transport transport) => Task.CompletedTask;
}

public class MaintenanceState : ITransportState
{
    public Task HandleRent(Transport transport)
    {
        // Ось тут ми викидаємо помилку, яку потім перевіряємо в тестах
        throw new TransportUnavailableException("Транспорт на обслуговуванні!");
    }
}

public class InUseState : ITransportState
{
    public Task HandleRent(Transport transport)
    {
        throw new TransportUnavailableException("Транспорт уже орендовано!");
    }
}