using System;
using BlazorApp.Data;
using BlazorApp.Models;
using BlazorApp.Patterns;
using Microsoft.EntityFrameworkCore;

namespace BlazorApp.Services
{
    public class RentalService
    {
        private readonly ApplicationDbContext _db;
        private readonly ITransportRepository _transportRepo;

        public RentalService(ApplicationDbContext db, ITransportRepository transportRepo)
        {
            _db = db;
            _transportRepo = transportRepo;
        }

        // ВІДКРИТТЯ ОРЕНДИ (Тепер приймаємо тариф і відсоток знижки)
        public async Task ProcessRental(int userId, int transportId, string tariff, int discount)
        {
            var session = new RentalSession 
            { 
                UserId = userId, 
                TransportId = transportId, 
                StartTime = DateTime.Now.ToString("HH:mm:ss"),
                TariffType = tariff,
                DiscountPercent = discount
            };
            _db.RentalSessions.Add(session);
            await _db.SaveChangesAsync();
        }

        // ЗАВЕРШЕННЯ ОРЕНДИ
        public async Task CompleteRental(RentalSession session)
        {
            session.EndTime = DateTime.Now.ToString("HH:mm:ss");
            
            // Використовуємо нову стратегію фіксованого тарифу
            IPricingStrategy pricingStrategy = new FixedTariffStrategy();
            
            // Рахуємо ціну (час фактичної поїздки ігнорується, береться повна вартість тарифу)
            session.TotalCost = pricingStrategy.CalculateCost(session.TariffType, session.DiscountPercent);
            
            // Знімаємо гроші
            if (session.User != null)
            {
                session.User.Balance -= session.TotalCost.Value; 
            }

            _db.RentalSessions.Update(session);
            
            // Оновлюємо транспорт через репозиторій
            if (session.Transport != null)
            {
                await _transportRepo.UpdateTransportAsync(session.Transport);
            }
            else
            {
                await _db.SaveChangesAsync();
            }
        }
    }
}