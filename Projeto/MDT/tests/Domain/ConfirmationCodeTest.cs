using System;
using MDT.Domain.PickupAndDeliveryTasks;
using Xunit;

namespace MDT.tests.Domain
{
    public class ConfirmationCodeTest
    {
        [Fact]
        public void Constructor_WithCodeLessThan4Chars_ThrowsException()
        {
            // Arrange
            string invalidCode = "123";

            // Act & Assert
            Assert.Throws<Exception>(() => new ConfirmationCode(invalidCode));
        }

        [Fact]
        public void Constructor_WithCodeMoreThan6Chars_ThrowsException()
        {
            // Arrange
            string invalidCode = "1234567";

            // Act & Assert
            Assert.Throws<Exception>(() => new ConfirmationCode(invalidCode));
        }

        [Fact]
        public void Constructor_WithValidCode_Success()
        {
            // Arrange
            string validCode = "12345";

            // Act
            var confirmationCode = new ConfirmationCode(validCode);

            // Assert
            Assert.Equal(validCode, confirmationCode.Code);
        }
    }
}
