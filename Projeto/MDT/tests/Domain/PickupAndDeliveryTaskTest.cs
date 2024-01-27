using MDT.Domain.PickupAndDeliveryTasks;
using MDT.Exceptions;
using Xunit;

namespace MDT.tests.Domain
{
    public class PickupAndDeliveryTaskTest
    {
        [Fact]
        public void Constructor_WithEmptyPickupRoomName_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Pickup Room field is required!", result.Message);
        }

        [Fact]
        public void Constructor_WithEmptyPickupBuildingCode_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Pickup Building Code field is required!", result.Message);

        }

        [Fact]
        public void Constructor_WithEmptyDeliveryRoomName_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Delivery Room field is required!", result.Message);
        }

        [Fact]
        public void Constructor_WithEmptyDeliveryBuildingCode_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Delivery Building Code field is required!", result.Message);

        }

        [Fact]
        public void Constructor_WithEmptyPickupContactName_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Pickup Contact Name field is required!", result.Message);

        }

        [Fact]
        public void Constructor_WithEmptyPickupContactPhoneNumber_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Pickup Contact Phone Number field is required!", result.Message);

        }

        [Fact]
        public void Constructor_WithEmptyDeliveryContactName_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Delivery Contact Name field is required!", result.Message);

        }

        [Fact]
        public void Constructor_WithEmptyDeliveryContactPhoneNumber_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "";
            string confirmationCode = "123456";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Delivery Contact Phone Number field is required!", result.Message);

        }

        [Fact]
        public void Constructor_WithEmptyConfirmationCode_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            string pickupRoomName = "PickupRoom";
            string pickupBuildingCode = "BuildingCode";
            string deliveryRoomName = "DeliveryRoom";
            string deliveryBuildingCode = "DeliveryBuildingCode";
            string pickupContactName = "PickupContactName";
            string pickupContactPhoneNumber = "911111111";
            string deliveryContactName = "DeliveryContactName";
            string deliveryContactPhoneNumber = "911222333";
            string confirmationCode = "";
            string robotTaskStatus = "Requested";
            string createdByUser = "User";
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask(pickupContactName, pickupContactPhoneNumber, deliveryContactName, deliveryContactPhoneNumber,
                    "TaskDescription", confirmationCode, robotTaskStatus, pickupBuildingCode,
                    pickupRoomName, deliveryBuildingCode, deliveryRoomName, createdByUser, createdDate));
            Assert.Equal("The Confirmation Code field is required!", result.Message);

        }

        [Theory]
        [InlineData("911 11 11 11")]
        [InlineData("9111111111")]
        [InlineData("abc")]
        public void Constructor_WithInvalidPickupContactPhoneNumber_ThrowsInvalidPickupAndDeliveryTaskException(string invalidPhoneNumber)
        {
            // Arrange
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask("PickupContactName", invalidPhoneNumber, "DeliveryContactName", "911222333",
                    "TaskDescription", "CODE", "Requested", "PickupBuildingCode",
                    "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate));
            Assert.Equal("The phone number is invalid. It must follow the correct pattern. (eg., 911222333 or 911 222 333)", result.Message);

        }

        [Theory]
        [InlineData("911222333")]
        [InlineData("911 222 333")]
        public void Constructor_WithValidPickupContactPhoneNumber_CreatesPickupAndDeliveryTask(string validPhoneNumber)
        {
            // Arrange
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var pickupAndDeliveryTask = new PickupAndDeliveryTask("PickupContactName", validPhoneNumber, "DeliveryContactName",
                "911222333", "TaskDescription", "CODE", "Requested", "PickupBuildingCode",
                "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate);

            // Assert
            Assert.NotNull(pickupAndDeliveryTask);
        }

        [Theory]
        [InlineData("911 11 11 11")]
        [InlineData("9111111111")]
        [InlineData("abc")]
        public void Constructor_WithInvalidDeliveryContactPhoneNumber_ThrowsInvalidPickupAndDeliveryTaskException(string invalidPhoneNumber)
        {
            // Arrange
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask("PickupContactName", "911111111", "DeliveryContactName", invalidPhoneNumber,
                    "TaskDescription", "CODE", "Requested", "PickupBuildingCode",
                    "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate));
            Assert.Equal("The phone number is invalid. It must follow the correct pattern. (eg., 911222333 or 911 222 333)", result.Message);

        }

        [Theory]
        [InlineData("911222333")]
        [InlineData("911 222 333")]
        public void Constructor_WithValidDeliveryContactPhoneNumber_CreatesPickupAndDeliveryTask(string validPhoneNumber)
        {
            // Arrange
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var pickupAndDeliveryTask = new PickupAndDeliveryTask("PickupContactName", "911111111", "DeliveryContactName",
                validPhoneNumber, "TaskDescription", "CODE", "Requested", "PickupBuildingCode",
                "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate);

            // Assert
            Assert.NotNull(pickupAndDeliveryTask);
        }

        [Fact]
        public void Constructor_WithTooLongTaskDescription_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            DateTime createdDate = DateTime.Now;
            string longTaskDescription = new string('T', 1001);

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask("PickupContactName", "911111111", "DeliveryContactName", "911222333",
                    longTaskDescription, "CODE", "Requested", "PickupBuildingCode",
                    "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate));
            Assert.Equal("Invalid length of description. It can have at most 1000 chars.", result.Message);
        }

        [Fact]
        public void Constructor_WithTooShortConfirmationCode_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            DateTime createdDate = DateTime.Now;
            string shortCode = "123";

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask("PickupContactName", "911111111", "DeliveryContactName", "911222333",
                    "TaskDescription", shortCode, "Requested", "PickupBuildingCode",
                    "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate));
            Assert.Equal("The inserted code is invalid. It must have from 4 up to 6 digits.", result.Message);
        }

        [Fact]
        public void Constructor_WithTooLongConfirmationCode_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            DateTime createdDate = DateTime.Now;
            string longCode = "1234567";

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask("PickupContactName", "911111111", "DeliveryContactName", "911222333",
                    "TaskDescription", longCode, "Requested", "PickupBuildingCode",
                    "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate));
            Assert.Equal("The inserted code is invalid. It must have from 4 up to 6 digits.", result.Message);
        }

        [Fact]
        public void Constructor_WithInvalidRobotTaskStatus_ThrowsInvalidPickupAndDeliveryTaskException()
        {
            // Arrange
            DateTime createdDate = DateTime.Now;
            string invalidRobotTaskStatus = "InvalidStatus";

            // Act & Assert
            var result = Assert.Throws<InvalidPickupAndDeliveryTask>(() =>
                new PickupAndDeliveryTask("PickupContactName", "911111111", "DeliveryContactName", "911222333",
                    "TaskDescription", "CODE", invalidRobotTaskStatus, "PickupBuildingCode",
                    "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate));
            Assert.Equal("The inserted Robot Task Status doesn't exists!", result.Message);
        }

        [Theory]
        [InlineData("Requested")]
        [InlineData("Approved")]
        [InlineData("Rejected")]
        public void Constructor_WithValidRobotTaskStatus_CreatesPickupAndDeliveryTask(string validRobotTaskStatus)
        {
            // Arrange
            DateTime createdDate = DateTime.Now;

            // Act & Assert
            var pickupAndDeliveryTask = new PickupAndDeliveryTask("PickupContactName", "911111111", "DeliveryContactName",
                "911222333", "TaskDescription", "CODE", validRobotTaskStatus, "PickupBuildingCode",
                "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", createdDate);

            // Assert
            Assert.NotNull(pickupAndDeliveryTask);
        }

        [Fact]
        public void Constructor_WithValidParameters_CreatesPickupAndDeliveryTask()
        {
            // Arrange
            DateTime validDateTime = DateTime.Now;

            // Act & Assert
            var pickupAndDeliveryTask = new PickupAndDeliveryTask(
                "PickupContactName", "911111111", "DeliveryContactName", "911222333",
                "TaskDescription", "CODE", "Requested", "PickupBuildingCode",
                "PickupRoomName", "DeliveryBuildingCode", "DeliveryRoomName", "User", validDateTime);

            // Assert
            Assert.NotNull(pickupAndDeliveryTask);
        }

    }
}
