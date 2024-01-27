using System;
using MDT.Domain.SharedValueObjects;
using Xunit;

namespace MDT.tests.Domain
{
    public class ContactTest
    {
        [Fact]
        public void Constructor_WithEmptyPhoneNumber_ThrowsException()
        {
            // Arrange
            string emptyPhoneNumber = string.Empty;

            // Act & Assert
            var result = Assert.Throws<Exception>(() => new Contact(emptyPhoneNumber));
            Assert.Equal("The phone number cannot be empty!", result.Message);
        }

        [Theory]
        [InlineData("91 234 56 78")] // PhoneNumber with a different format
        [InlineData("9876 54 321")] // PhoneNumber with another different format
        public void Constructor_WithInvalidPhoneNumberFormat_ThrowsException(string invalidPhoneNumber)
        {
            // Act & Assert
            Assert.Throws<Exception>(() => new Contact(invalidPhoneNumber));
        }

        [Theory]
        [InlineData("911111111")]
        [InlineData("911 111 111")]
        [InlineData("911222333")]
        public void Constructor_WithValidPhoneNumber_Success(string validPhoneNumber)
        {
            // Act
            var contact = new Contact(validPhoneNumber);

            // Assert
            Assert.Equal(validPhoneNumber, contact.phoneNumber);
        }
    }
}
