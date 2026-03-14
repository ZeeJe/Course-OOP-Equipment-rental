using BlazorApp.Models;

namespace BlazorApp.Services
{
    // Цей інтерфейс є на твоїй UML-схемі
    public interface ITransportRepository
    {
        Task<List<Transport>> GetAvailableAsync();
        Task UpdateTransportAsync(Transport t);
    }
}