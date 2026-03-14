namespace BlazorApp.Patterns;

public class TransportUnavailableException : Exception
{
    public TransportUnavailableException(string message) : base(message) { }
}