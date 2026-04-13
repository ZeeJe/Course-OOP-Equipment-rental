using System.ComponentModel.DataAnnotations;

namespace BlazorApp.Models
{
    public class PromoCode
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Код є обов'язковим")]
        public string Code { get; set; } = string.Empty; // Наприклад: "WELCOME100"
        
        public int DiscountPercentage { get; set; } // Знижка у відсотках (наприклад, 20)
        
        public bool IsActive { get; set; } = true; // Чи діє код зараз
    }
}