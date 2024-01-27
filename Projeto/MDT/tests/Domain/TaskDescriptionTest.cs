using System;
using MDT.Domain.PickupAndDeliveryTasks;
using Xunit;

namespace MDT.tests.Domain
{
    public class TaskDescriptionTest
    {
        [Fact]
        public void Constructor_WithDescriptionMoreThan1000Chars_ThrowsException()
        {
            // Arrange
            string invalidDescription = new string('T', 1001);

            // Act & Assert
            Assert.Throws<Exception>(() => new TaskDescription(invalidDescription));
        }

        [Fact]
        public void Constructor_WithValidDescription_Success()
        {
            // Arrange
            string validDescription = "Valid description within limit.";

            // Act
            var taskDescription = new TaskDescription(validDescription);

            // Assert
            Assert.Equal(validDescription, taskDescription.Description);
        }
    }
}
