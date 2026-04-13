using System;

namespace BlazorApp.Patterns
{
    // Помилка: Транспорт недоступний (наприклад, на ремонті)
    public class TransportUnavailableException : Exception
    {
        public TransportUnavailableException(string message) : base(message) { }
    }

    // Помилка: Недостатньо коштів (НОВЕ)
    public class InsufficientFundsException : Exception
    {
        public InsufficientFundsException(string message) : base(message) { }
    }
}