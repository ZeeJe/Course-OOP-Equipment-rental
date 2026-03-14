using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using BlazorApp.Services;
using BlazorApp.Models;
using BlazorApp.Patterns; 
using BlazorApp.Data;

namespace BlazorApp.Tests;

public class RentalTests
{
    [Theory]
    [InlineData("30_min", 0, 50)]
    [InlineData("1_hour", 10, 81)]
    public void Pricing_Test(string tariff, int discount, double expected)
    {
        var strategy = new FixedTariffStrategy();
        var result = strategy.CalculateCost(tariff, discount);
        Assert.Equal(expected, result);
    }

    [Fact]
    public async Task State_Maintenance_ShouldThrowException()
    {
        // Arrange
        var transport = new Scooter { Id = 1 };
        // Якщо MaintenanceState все одно червоний, спробуй написати повний шлях: 
        // var state = new BlazorApp.Patterns.MaintenanceState();
        var state = new MaintenanceState(); 
        
        // Act & Assert
        await Assert.ThrowsAsync<TransportUnavailableException>(async () => 
            await state.HandleRent(transport)
        );
    }

    [Fact]
    public void Factory_Creation_Test()
    {
        var factory = new ScooterFactory();
        var result = factory.CreateTransport();
        Assert.IsType<Scooter>(result);
    }
}