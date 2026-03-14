using System;

namespace BlazorApp.Models
{
    public class RentalSession
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public int TransportId { get; set; }
        public Transport? Transport { get; set; }
        
        public string StartTime { get; set; } = "";
        public string EndTime { get; set; } = "";
        public double? TotalCost { get; set; }

        // НОВІ ПОЛЯ ДЛЯ БІЗНЕС-ЛОГІКИ (Тарифи та Промокоди):
        public string TariffType { get; set; } = ""; 
        public int DiscountPercent { get; set; } = 0; 
    }
}