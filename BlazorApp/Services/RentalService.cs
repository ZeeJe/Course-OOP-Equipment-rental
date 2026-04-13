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

        // ВІДКРИТТЯ ОРЕНДИ (з перевірками)
        public async Task ProcessRental(int userId, int transportId, string tariff, int discount)
        {
            // 1. Знаходимо користувача
            var user = await _db.Users.FindAsync(userId);
            if (user == null) throw new Exception("Користувача не знайдено");

            // 2. ПЕРЕВІРКА ПРОМОКОДУ (ліміт: 1 раз на акаунт)
            if (discount > 0)
            {
                if (user.HasUsedPromoCode)
                {
                    throw new InvalidOperationException("Помилка: Ви вже використовували промокод раніше! Знижка надається лише один раз.");
                }
                user.HasUsedPromoCode = true; // Фіксуємо, що клієнт спалив свій шанс
                _db.Users.Update(user);
            }

            // 3. ПЕРЕВІРКА БАЛАНСУ
            IPricingStrategy pricingStrategy = new FixedTariffStrategy(_db);
            double expectedCost = pricingStrategy.CalculateCost(tariff, discount);
            
            if (user.Balance < expectedCost)
            {
                throw new InsufficientFundsException($"Недостатньо коштів! Для оренди потрібно {expectedCost} грн, а на вашому балансі {user.Balance} грн.");
            }

            // 4. Якщо все окей - створюємо сесію
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
            
            // Використовуємо стратегію з підключенням до бази даних
            IPricingStrategy pricingStrategy = new FixedTariffStrategy(_db);
            
            // Рахуємо фінальну ціну
            session.TotalCost = pricingStrategy.CalculateCost(session.TariffType, session.DiscountPercent);
            
            // Знімаємо гроші
            if (session.User == null)
            {
                session.User = await _db.Users.FindAsync(session.UserId);
            }

            if (session.User != null)
            {
                session.User.Balance -= session.TotalCost.Value; 
                _db.Users.Update(session.User); // Оновлюємо баланс
            }

            _db.RentalSessions.Update(session);
            
            // Оновлюємо транспорт
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