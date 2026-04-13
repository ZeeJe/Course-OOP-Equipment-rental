using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Models
{
    public class Tariff
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty; // Наприклад: "30_min", "1_hour"
        
        public decimal Price { get; set; } // Вартість тарифу
    }
}