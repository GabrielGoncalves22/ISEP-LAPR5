using System;
using MDT.Domain.SharedValueObjects;
using Xunit;

namespace MDT.tests.Domain
{
    public class DateTimeCreationTest
    {
        [Fact]
        public void DefaultConstructor_ShouldSetCurrentDateTime()
        {
            // Arrange
            DateTime now = DateTime.Now;

            // Act
            var dateTimeCreation = new DateTimeCreation();

            // Assert
            Assert.InRange(dateTimeCreation.GetValue(), now, DateTime.Now);
        }

        [Fact]
        public void Constructor_WithEmptyDateTimeInformation_ThrowsException()
        {
            // Act & Assert
            Assert.Throws<Exception>(() => new DateTimeCreation(""));
        }

        [Theory]
        [InlineData("2023-01-01")] // Invalid format
        [InlineData("01-01-2023 12:34:56")] // Another invalid format
        public void Constructor_WithInvalidDateTimeInformation_ThrowsException(string invalidDateTimeInformation)
        {
            // Act & Assert
            Assert.Throws<Exception>(() => new DateTimeCreation(invalidDateTimeInformation));
        }

        [Fact]
        public void Constructor_WithValidDateTimeInformation_Success()
        {
            // Arrange
            string validDateTimeInformation = "01/01/2023 12:34:56";

            // Act
            var dateTimeCreation = new DateTimeCreation(validDateTimeInformation);

            // Assert
            Assert.Equal(validDateTimeInformation, dateTimeCreation.ToString());
        }
    }
}
