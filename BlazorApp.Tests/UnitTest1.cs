using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using BlazorApp.Services;
using BlazorApp.Models;
using BlazorApp.Patterns; 
using BlazorApp.Data;
using Microsoft.EntityFrameworkCore;

namespace BlazorApp.Tests;

/// =====================================================================
/// БЛОК 1: UNIT-ТЕСТИ PRICING STRATEGY ПАТТЕРНУ
/// =====================================================================
public class PricingStrategyTests
{
    [Fact]
    public void FixedTariffStrategy_ThirtyMin_NoDiscount_Returns90()
    {
        // Arrange
        var strategy = new FixedTariffStrategy();
        
        // Act
        var result = strategy.CalculateCost("30_min", 0);
        
        // Assert
        Assert.Equal(90.0, result);
    }

    [Fact]
    public void FixedTariffStrategy_OneHour_NoDiscount_Returns150()
    {
        // Arrange
        var strategy = new FixedTariffStrategy();
        
        // Act
        var result = strategy.CalculateCost("1_hour", 0);
        
        // Assert
        Assert.Equal(150.0, result);
    }

    [Fact]
    public void FixedTariffStrategy_ThirtyMin_With10PercentDiscount_Returns81()
    {
        // Arrange
        var strategy = new FixedTariffStrategy();
        
        // Act
        var result = strategy.CalculateCost("30_min", 10);
        
        // Assert
        Assert.Equal(81.0, result);
    }

    [Fact]
    public void FixedTariffStrategy_OneHour_With20PercentDiscount_Returns120()
    {
        // Arrange
        var strategy = new FixedTariffStrategy();
        
        // Act
        var result = strategy.CalculateCost("1_hour", 20);
        
        // Assert
        Assert.Equal(120.0, result);
    }

    [Fact]
    public void FixedTariffStrategy_UnknownTariff_ReturnsDefault150()
    {
        // Arrange
        var strategy = new FixedTariffStrategy();
        
        // Act
        var result = strategy.CalculateCost("unknown", 0);
        
        // Assert
        Assert.Equal(150.0, result);
    }

    [Fact]
    public void FixedTariffStrategy_With100PercentDiscount_ReturnsFree()
    {
        // Arrange
        var strategy = new FixedTariffStrategy();
        
        // Act
        var result = strategy.CalculateCost("30_min", 100);
        
        // Assert
        Assert.Equal(0.0, result);
    }
}

/// =====================================================================
/// БЛОК 2: UNIT-ТЕСТИ STATE ПАТТЕРНУ
/// =====================================================================
public class StatePatternTests
{
    [Fact]
    public async Task AvailableState_HandleRent_DoesNotThrow()
    {
        // Arrange
        var transport = new Scooter { Id = 1, StateCode = "Available" };
        var state = new AvailableState();
        
        // Act & Assert
        await state.HandleRent(transport);
    }

    [Fact]
    public async Task AvailableState_HandleReturn_ThrowsInvalidOperationException()
    {
        // Arrange
        var transport = new Scooter { Id = 1, StateCode = "Available" };
        var state = new AvailableState();
        
        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            async () => await state.HandleReturn(transport)
        );
    }

    [Fact]
    public async Task MaintenanceState_HandleRent_ThrowsTransportUnavailableException()
    {
        // Arrange
        var transport = new Scooter { Id = 1, StateCode = "Maintenance" };
        var state = new MaintenanceState();
        
        // Act & Assert
        await Assert.ThrowsAsync<TransportUnavailableException>(
            async () => await state.HandleRent(transport)
        );
    }

    [Fact]
    public async Task MaintenanceState_HandleReturn_DoesNotThrow()
    {
        // Arrange
        var transport = new Scooter { Id = 1, StateCode = "Maintenance" };
        var state = new MaintenanceState();
        
        // Act & Assert
        await state.HandleReturn(transport);
    }

    [Fact]
    public async Task InUseState_HandleRent_ThrowsTransportUnavailableException()
    {
        // Arrange
        var transport = new Scooter { Id = 1, StateCode = "InUse" };
        var state = new InUseState();
        
        // Act & Assert
        await Assert.ThrowsAsync<TransportUnavailableException>(
            async () => await state.HandleRent(transport)
        );
    }

    [Fact]
    public async Task InUseState_HandleReturn_AllowsReturn()
    {
        // Arrange
        var transport = new Scooter { Id = 1, StateCode = "InUse" };
        var state = new InUseState();
        
        // Act & Assert
        await state.HandleReturn(transport);
    }
}

/// =====================================================================
/// БЛОК 3: UNIT-ТЕСТИ FACTORY ПАТТЕРНУ
/// =====================================================================
public class FactoryPatternTests
{
    [Fact]
    public void ScooterFactory_CreateTransport_ReturnsScooterInstance()
    {
        // Arrange
        var factory = new ScooterFactory();
        
        // Act
        var transport = factory.CreateTransport();
        
        // Assert
        Assert.IsType<Scooter>(transport);
    }

    [Fact]
    public void ScooterFactory_CreateTransport_ScooterHasValidStateCode()
    {
        // Arrange
        var factory = new ScooterFactory();
        
        // Act
        var scooter = factory.CreateTransport();
        
        // Assert
        Assert.NotNull(scooter.StateCode);
        Assert.NotEmpty(scooter.StateCode);
        Assert.False(string.IsNullOrWhiteSpace(scooter.StateCode));
    }

    [Fact]
    public void ScooterFactory_CreateTransport_ScooterHasFullBattery()
    {
        // Arrange
        var factory = new ScooterFactory();
        
        // Act
        var scooter = (Scooter)factory.CreateTransport();
        
        // Assert
        Assert.Equal(100, scooter.BatteryLevel);
    }

    [Fact]
    public void ScooterFactory_CreateTransport_ScooterHasMotorPower()
    {
        // Arrange
        var factory = new ScooterFactory();
        
        // Act
        var scooter = (Scooter)factory.CreateTransport();
        
        // Assert
        Assert.True(scooter.MotorPower > 0);
        Assert.Equal(350, scooter.MotorPower);
    }

    [Fact]
    public void BicycleFactory_CreateTransport_ReturnsBicycleInstance()
    {
        // Arrange
        var factory = new BicycleFactory();
        
        // Act
        var transport = factory.CreateTransport();
        
        // Assert
        Assert.IsType<Bicycle>(transport);
    }

    [Fact]
    public void BicycleFactory_CreateTransport_BicycleHasValidStateCode()
    {
        // Arrange
        var factory = new BicycleFactory();
        
        // Act
        var bicycle = factory.CreateTransport();
        
        // Assert
        Assert.NotNull(bicycle.StateCode);
        Assert.NotEmpty(bicycle.StateCode);
        Assert.StartsWith("BIKE-", bicycle.StateCode);
    }

    [Fact]
    public void BicycleFactory_CreateTransport_BicycleHasBasket()
    {
        // Arrange
        var factory = new BicycleFactory();
        
        // Act
        var bicycle = (Bicycle)factory.CreateTransport();
        
        // Assert
        Assert.True(bicycle.HasBasket);
    }
}

/// =====================================================================
/// БЛОК 4: UNIT-ТЕСТИ CUSTOM EXCEPTIONS
/// =====================================================================
public class CustomExceptionsTests
{
    [Fact]
    public async Task TransportUnavailableException_CanBeThrown()
    {
        // Act & Assert
        var exception = await Assert.ThrowsAsync<TransportUnavailableException>(async () => 
            throw new TransportUnavailableException("Test message")
        );
        
        Assert.Equal("Test message", exception.Message);
    }

    [Fact]
    public async Task InsufficientFundsException_CanBeThrown()
    {
        // Act & Assert
        var exception = await Assert.ThrowsAsync<InsufficientFundsException>(async () => 
            throw new InsufficientFundsException("Недостатньо грошей")
        );
        
        Assert.Equal("Недостатньо грошей", exception.Message);
    }
}

/// =====================================================================
/// БЛОК 5: UNIT-ТЕСТИ MODELS
/// =====================================================================
public class ModelsTests
{
    [Fact]
    public void User_CanBeCreated_WithDefaults()
    {
        // Act
        var user = new User { Id = 1, Name = "John", Balance = 100.0 };
        
        // Assert
        Assert.Equal(1, user.Id);
        Assert.Equal("John", user.Name);
        Assert.Equal(100.0, user.Balance);
        Assert.False(user.HasUsedPromoCode);
    }

    [Fact]
    public void Scooter_InheritsFromTransport()
    {
        // Act
        var scooter = new Scooter 
        { 
            Id = 1, 
            StateCode = "AA1234XX", 
            BatteryLevel = 95,
            MotorPower = 350
        };
        
        // Assert
        Assert.Equal(1, scooter.Id);
        Assert.Equal("AA1234XX", scooter.StateCode);
        Assert.Equal(95, scooter.BatteryLevel);
    }

    [Fact]
    public void Bicycle_InheritsFromTransport()
    {
        // Act
        var bicycle = new Bicycle 
        { 
            Id = 1, 
            StateCode = "BIKE-123", 
            FrameSize = "L",
            HasBasket = true
        };
        
        // Assert
        Assert.Equal("BIKE-123", bicycle.StateCode);
        Assert.Equal("L", bicycle.FrameSize);
        Assert.True(bicycle.HasBasket);
    }

    [Fact]
    public void RentalSession_CanBeCreated()
    {
        // Act
        var session = new RentalSession
        {
            Id = 1,
            UserId = 10,
            TransportId = 5,
            StartTime = "10:30:00",
            EndTime = "10:45:00",
            TotalCost = 50.0,
            TariffType = "30_min",
            DiscountPercent = 0
        };
        
        // Assert
        Assert.Equal(1, session.Id);
        Assert.Equal(10, session.UserId);
        Assert.Equal(5, session.TransportId);
        Assert.Equal(50.0, session.TotalCost);
    }

    [Fact]
    public void Transport_HasDefaultCoordinates()
    {
        // Act
        var transport = new Scooter { Id = 1 };
        
        // Assert
        Assert.Equal(50.6199, transport.Latitude);
        Assert.Equal(26.2516, transport.Longitude);
    }
}

/// =====================================================================
/// БЛОК 6: UNIT-ТЕСТИ REPOSITORY ПАТТЕРНУ
/// =====================================================================
public class RepositoryPatternTests
{
    [Fact]
    public async Task TransportRepository_GetAvailableAsync_ReturnsAvailableTransports()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_GetAvailable")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            // Додаємо тестові дані
            context.Scooters.Add(new Scooter { Id = 1, StateCode = "AA1001XX", BatteryLevel = 100 });
            context.Scooters.Add(new Scooter { Id = 2, StateCode = "AA1002XX", BatteryLevel = 50 });
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var repository = new TransportRepository(context);
            
            // Act
            var available = await repository.GetAvailableAsync();
            
            // Assert
            Assert.NotEmpty(available);
        }
    }

    [Fact]
    public async Task TransportRepository_UpdateTransportAsync_UpdatesTransport()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_Update")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            var scooter = new Scooter { Id = 1, StateCode = "AA1001XX", BatteryLevel = 100 };
            context.Scooters.Add(scooter);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var repository = new TransportRepository(context);
            var scooter = await context.Scooters.FindAsync(1);
            scooter!.BatteryLevel = 50;
            
            // Act
            await repository.UpdateTransportAsync(scooter);
            
            // Assert
            var updated = await context.Scooters.FindAsync(1);
            Assert.Equal(50, updated!.BatteryLevel);
        }
    }
}

/// =====================================================================
/// БЛОК 7: UNIT-ТЕСТИ RENTAL SERVICE ЛОГІКИ
/// =====================================================================
public class RentalServiceTests
{
    [Fact]
    public async Task RentalService_ProcessRental_ThrowsException_WhenUserNotFound()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_ProcessRental")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            var mockRepo = new Mock<ITransportRepository>();
            var service = new RentalService(context, mockRepo.Object);
            
            // Act & Assert
            await Assert.ThrowsAsync<Exception>(
                async () => await service.ProcessRental(999, 1, "30_min", 0)
            );
        }
    }

    [Fact]
    public async Task RentalService_ProcessRental_ThrowsException_WhenInsufficientFunds()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_InsufficientFunds")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            // Користувач з малою кількістю коштів
            var user = new User { Id = 1, Name = "Poor User", Balance = 10.0 };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var mockRepo = new Mock<ITransportRepository>();
            var service = new RentalService(context, mockRepo.Object);
            
            // Act & Assert
            await Assert.ThrowsAsync<InsufficientFundsException>(
                async () => await service.ProcessRental(1, 1, "30_min", 0)
            );
        }
    }

    [Fact]
    public async Task RentalService_ProcessRental_Success_WhenUserHasSufficientFunds()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_SuccessfulRental")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            var user = new User { Id = 1, Name = "Rich User", Balance = 200.0 };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var mockRepo = new Mock<ITransportRepository>();
            var service = new RentalService(context, mockRepo.Object);
            
            // Act
            await service.ProcessRental(1, 1, "30_min", 0);
            
            // Assert
            var sessions = context.RentalSessions.ToList();
            Assert.NotEmpty(sessions);
            Assert.Equal(1, sessions[0].UserId);
        }
    }

    [Fact]
    public async Task RentalService_ProcessRental_ThrowsException_WhenPromoCodeReused()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_PromoReuse")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            var user = new User 
            { 
                Id = 1, 
                Name = "User", 
                Balance = 500.0,
                HasUsedPromoCode = true  // Вже використав
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            var mockRepo = new Mock<ITransportRepository>();
            var service = new RentalService(context, mockRepo.Object);
            
            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(
                async () => await service.ProcessRental(1, 1, "30_min", 10)
            );
        }
    }

    [Fact]
    public async Task RentalService_CompleteRental_UpdatesUserBalance()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_CompleteRental_Balance")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            var user = new User { Id = 1, Name = "John", Balance = 500.0 };
            var scooter = new Scooter { Id = 1, StateCode = "AA1001XX", BatteryLevel = 100 };
            
            // <--- ДОДАНО: Створюємо тариф для тестової бази
            var tariff = new Tariff { Name = "30_min", Price = 90.0m };
            
            context.Users.Add(user);
            context.Scooters.Add(scooter);
            context.Tariffs.Add(tariff);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var mockRepo = new Mock<ITransportRepository>();
            mockRepo.Setup(r => r.UpdateTransportAsync(It.IsAny<Transport>()))
                .Returns(Task.CompletedTask);
            
            var service = new RentalService(context, mockRepo.Object);
            
            var user = await context.Users.FindAsync(1);
            var transport = await context.Scooters.FindAsync(1);
            
            var session = new RentalSession 
            { 
                UserId = 1, 
                TransportId = 1, 
                StartTime = DateTime.Now.AddMinutes(-30).ToString("HH:mm:ss"),
                TariffType = "30_min",
                DiscountPercent = 0,
                User = user,
                Transport = transport
            };
            context.RentalSessions.Add(session);
            await context.SaveChangesAsync();
            
            // Act
            await service.CompleteRental(session);
            
            // Assert
            var updatedUser = await context.Users.FindAsync(1);
            Assert.Equal(410.0, updatedUser!.Balance); // 500 - 90 (30_min тариф)
        }
    }

    [Fact]
    public async Task RentalService_CompleteRental_SetsTotalCost()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_CompleteRental_Cost")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            var user = new User { Id = 1, Name = "John", Balance = 500.0 };
            var scooter = new Scooter { Id = 1, StateCode = "AA1001XX", BatteryLevel = 100 };
            
            var tariff = new Tariff { Name = "1_hour", Price = 150.0m };

            context.Users.Add(user);
            context.Scooters.Add(scooter);
            context.Tariffs.Add(tariff);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var mockRepo = new Mock<ITransportRepository>();
            mockRepo.Setup(r => r.UpdateTransportAsync(It.IsAny<Transport>()))
                .Returns(Task.CompletedTask);
            
            var service = new RentalService(context, mockRepo.Object);
            
            var user = await context.Users.FindAsync(1);
            var transport = await context.Scooters.FindAsync(1);
            
            var session = new RentalSession 
            { 
                UserId = 1, 
                TransportId = 1, 
                StartTime = DateTime.Now.AddMinutes(-30).ToString("HH:mm:ss"),
                TariffType = "1_hour",
                DiscountPercent = 0,
                User = user,
                Transport = transport
            };
            context.RentalSessions.Add(session);
            await context.SaveChangesAsync();
            
            // Act
            await service.CompleteRental(session);
            
            // Assert
            var updatedSession = await context.RentalSessions.FindAsync(session.Id);
            Assert.Equal(150.0, updatedSession!.TotalCost); // 1_hour тариф
            Assert.NotNull(updatedSession.EndTime);
        }
    }

    [Fact]
    public async Task RentalService_CompleteRental_UpdatesTransportState()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb_CompleteRental_State")
            .Options;

        using (var context = new ApplicationDbContext(options))
        {
            var user = new User { Id = 1, Name = "John", Balance = 500.0 };
            var scooter = new Scooter { Id = 1, StateCode = "InUse", BatteryLevel = 100 };
            
            context.Users.Add(user);
            context.Scooters.Add(scooter);
            await context.SaveChangesAsync();
        }

        using (var context = new ApplicationDbContext(options))
        {
            var mockRepo = new Mock<ITransportRepository>();
            mockRepo.Setup(r => r.UpdateTransportAsync(It.IsAny<Transport>()))
                .Returns(Task.CompletedTask);
            
            var service = new RentalService(context, mockRepo.Object);
            
            var user = await context.Users.FindAsync(1);
            var transport = await context.Scooters.FindAsync(1);
            
            var session = new RentalSession 
            { 
                UserId = 1, 
                TransportId = 1, 
                StartTime = DateTime.Now.AddMinutes(-30).ToString("HH:mm:ss"),
                TariffType = "30_min",
                DiscountPercent = 0,
                User = user,
                Transport = transport
            };
            context.RentalSessions.Add(session);
            await context.SaveChangesAsync();
            
            // Act
            await service.CompleteRental(session);
            
            // Assert
            Assert.NotNull(transport);
            Assert.Equal("Available", transport.StateCode); // Повинен бути Available після повернення
            mockRepo.Verify(r => r.UpdateTransportAsync(It.IsAny<Transport>()), Times.Once);
        }
    }
}

/// =====================================================================
/// БЛОК 8: UNIT-ТЕСТИ PER-MINUTE PRICING STRATEGY
/// =====================================================================
public class PerMinutePricingStrategyTests
{
    [Fact]
    public void PerMinuteStrategy_ThirtyMinutes_NoDiscount_Returns60()
    {
        // Arrange
        var strategy = new PerMinuteStrategy();
        
        // Act
        var result = strategy.CalculateCost("30", 0);
        
        // Assert
        Assert.Equal(60.0, result); // 30 хв * 2 грн/хв
    }

    [Fact]
    public void PerMinuteStrategy_SixtyMinutes_NoDiscount_Returns120()
    {
        // Arrange
        var strategy = new PerMinuteStrategy();
        
        // Act
        var result = strategy.CalculateCost("60", 0);
        
        // Assert
        Assert.Equal(120.0, result); // 60 хв * 2 грн/хв
    }

    [Fact]
    public void PerMinuteStrategy_OneHourTariff_NoDiscount_Returns120()
    {
        // Arrange
        var strategy = new PerMinuteStrategy();
        
        // Act
        var result = strategy.CalculateCost("1_hour", 0);
        
        // Assert
        Assert.Equal(120.0, result); // 60 хв * 2 грн/хв
    }

    [Fact]
    public void PerMinuteStrategy_TwelveHours_NoDiscount_Returns1440()
    {
        // Arrange
        var strategy = new PerMinuteStrategy();
        
        // Act
        var result = strategy.CalculateCost("12h", 0);
        
        // Assert
        Assert.Equal(1440.0, result); // 720 хв * 2 грн/хв
    }

    [Fact]
    public void PerMinuteStrategy_TwentyFourHours_NoDiscount_Returns2880()
    {
        // Arrange
        var strategy = new PerMinuteStrategy();
        
        // Act
        var result = strategy.CalculateCost("24h", 0);
        
        // Assert
        Assert.Equal(2880.0, result); // 1440 хв * 2 грн/хв
    }

    [Fact]
    public void PerMinuteStrategy_ThirtyMinutes_With50PercentDiscount_Returns30()
    {
        // Arrange
        var strategy = new PerMinuteStrategy();
        
        // Act
        var result = strategy.CalculateCost("30", 50);
        
        // Assert
        Assert.Equal(30.0, result); // (30 * 2) * 0.5
    }

    [Fact]
    public void PerMinuteStrategy_SixtyMinutes_With25PercentDiscount_Returns90()
    {
        // Arrange
        var strategy = new PerMinuteStrategy();
        
        // Act
        var result = strategy.CalculateCost("60", 25);
        
        // Assert
        Assert.Equal(90.0, result); // (60 * 2) * 0.75
    }
}

/// =====================================================================
/// БЛОК 9: UNIT-ТЕСТИ SUBSCRIPTION PRICING STRATEGY
/// =====================================================================
public class SubscriptionPricingStrategyTests
{
    [Fact]
    public void SubscriptionStrategy_SevenDays_NoDiscount_Returns150()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("7_days", 0);
        
        // Assert
        Assert.Equal(150.0, result);
    }

    [Fact]
    public void SubscriptionStrategy_ThirtyDays_NoDiscount_Returns500()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("30_days", 0);
        
        // Assert
        Assert.Equal(500.0, result);
    }

    [Fact]
    public void SubscriptionStrategy_OneMonth_NoDiscount_Returns500()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("1_month", 0);
        
        // Assert
        Assert.Equal(500.0, result);
    }

    [Fact]
    public void SubscriptionStrategy_ThreeMonths_NoDiscount_Returns1200()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("3_months", 0);
        
        // Assert
        Assert.Equal(1200.0, result);
    }

    [Fact]
    public void SubscriptionStrategy_Annual_NoDiscount_Returns4500()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("annual", 0);
        
        // Assert
        Assert.Equal(4500.0, result);
    }

    [Fact]
    public void SubscriptionStrategy_SevenDays_With50PercentDiscount_Returns75()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("7_days", 50);
        
        // Assert
        Assert.Equal(75.0, result); // 150 * 0.5
    }

    [Fact]
    public void SubscriptionStrategy_ThirtyDays_With10PercentDiscount_Returns450()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("30_days", 10);
        
        // Assert
        Assert.Equal(450.0, result); // 500 * 0.9
    }

    [Fact]
    public void SubscriptionStrategy_Annual_With20PercentDiscount_Returns3600()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("annual", 20);
        
        // Assert
        Assert.Equal(3600.0, result); // 4500 * 0.8
    }

    [Fact]
    public void SubscriptionStrategy_UnknownTariff_ReturnsDefault500()
    {
        // Arrange
        var strategy = new SubscriptionStrategy();
        
        // Act
        var result = strategy.CalculateCost("unknown_subscription", 0);
        
        // Assert
        Assert.Equal(500.0, result); // Значення за замовчуванням
    }
}