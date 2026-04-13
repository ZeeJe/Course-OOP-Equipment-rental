namespace BlazorApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public double Balance { get; set; } = 0.0;
        public bool HasUsedPromoCode { get; set; } = false;
    }
}