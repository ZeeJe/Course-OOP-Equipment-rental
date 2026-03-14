using BlazorApp.Data;
using BlazorApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BlazorApp.Services
{
    // Реалізація інтерфейсу з UML-діаграми
    public class TransportRepository : ITransportRepository
    {
        private readonly ApplicationDbContext _db;

        public TransportRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<List<Transport>> GetAvailableAsync()
        {
            // Повертає тільки доступні транспорти (не в оренді і не в ремонті)
            var allTransports = await _db.Transports.ToListAsync();
            var activeSessions = await _db.RentalSessions.Where(s => string.IsNullOrEmpty(s.EndTime)).ToListAsync();
            
            return allTransports.Where(t => 
                !activeSessions.Any(s => s.TransportId == t.Id) && 
                !(t.StateCode != null && t.StateCode.Contains("рем", StringComparison.OrdinalIgnoreCase))
            ).ToList();
        }

        public async Task UpdateTransportAsync(Transport t)
        {
            _db.Transports.Update(t);
            await _db.SaveChangesAsync();
        }
    }
}