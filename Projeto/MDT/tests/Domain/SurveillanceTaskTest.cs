using MDT.Domain.SurveillanceTasks;
using MDT.Exceptions;
using Xunit;

namespace MDT.tests.Domain
{
    public class SurveillanceTaskTest
    {
        [Fact]
        public void Constructor_WithEmptyBuildingCode_ThrowsInvalidSurveillanceTaskException()
        {
            // Arrange
            string buildingCode = "";
            string emergencyContactName = "EmergencyContactName";
            string emergencyContactPhoneNumber = "911111111";
            string robotTaskStatus = "Requested";
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act & Assert
            var result = Assert.Throws<InvalidSurveillanceTask>(() =>
                new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber, robotTaskStatus,
                    surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate)));
            Assert.Equal("Building code cannot be empty!", result.Message);
        }

        [Fact]
        public void Constructor_WithEmptyEmergencyContactName_ThrowsInvalidSurveillanceTaskException()
        {
            // Arrange
            string buildingCode = "BuildingCode";
            string emergencyContactName = "";
            string emergencyContactPhoneNumber = "911111111";
            string robotTaskStatus = "Requested";
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act & Assert
            var result = Assert.Throws<InvalidSurveillanceTask>(() =>
                new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber, robotTaskStatus,
                    surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate)));
            Assert.Equal("Emergency Contact Name cannot be empty!", result.Message);
        }

        [Fact]
        public void Constructor_WithEmptyEmergencyContactPhoneNumber_ThrowsInvalidSurveillanceTaskException()
        {
            // Arrange
            string buildingCode = "BuildingCode";
            string emergencyContactName = "EmergencyContactName";
            string emergencyContactPhoneNumber = "";
            string robotTaskStatus = "Requested";
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act & Assert
            var result = Assert.Throws<InvalidSurveillanceTask>(() =>
                new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber, robotTaskStatus,
                    surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate)));
            Assert.Equal("The phone number cannot be empty!", result.Message);
        }

        [Theory]
        [InlineData("911111111")]
        [InlineData("911 111 111")]
        [InlineData("911222333")]
        public void Constructor_WithValidContact_Success(string validContact)
        {
            // Arrange
            string buildingCode = "BuildingCode";
            string emergencyContactName = "EmergencyContactName";
            string emergencyContactPhoneNumber = validContact;
            string robotTaskStatus = "Requested";
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act
            var surveillanceTask = new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber,
                robotTaskStatus, surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate));

            // Assert
            Assert.Equal(validContact, surveillanceTask.EmergencyContactPhoneNumber.phoneNumber);
        }

        [Theory]
        [InlineData("91 1111 111")]
        [InlineData("911 1111 11")]
        [InlineData("911 22 23 33")]
        public void Constructor_WithInvalidContact_ThrowsInvalidSurveillanceTaskException(string invalidContact)
        {
            // Arrange
            string buildingCode = "BuildingCode";
            string emergencyContactName = "EmergencyContactName";
            string emergencyContactPhoneNumber = invalidContact;
            string robotTaskStatus = "Requested";
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act & Assert
            var result = Assert.Throws<InvalidSurveillanceTask>(() => 
                new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber,
                robotTaskStatus, surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate)));

            Assert.Equal("The phone number is invalid. It must follow the correct pattern. (eg., 911222333 or 911 222 333)", result.Message);
            
        }

        [Theory]
        [InlineData("InvalidStatus")]
        [InlineData("This doesn't exists")]
        public void Constructor_WithInvalidRobotTaskStatus_ThrowsInvalidSurveillanceTaskException(string invalidStatus)
        {
            // Arrange
            string buildingCode = "BuildingCode";
            string emergencyContactName = "EmergencyContactName";
            string emergencyContactPhoneNumber = "911111111";
            string robotTaskStatus = invalidStatus;
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act & Assert
            Assert.Throws<InvalidSurveillanceTask>(() =>
                new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber, robotTaskStatus,
                    surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate)));
        }

        [Theory]
        [InlineData("Requested")]
        [InlineData("Approved")]
        [InlineData("Rejected")]
        public void Constructor_WithValidRobotTaskStatus_Success(string validStatus)
        {
            // Arrange
            string buildingCode = "BuildingCode";
            string emergencyContactName = "EmergencyContactName";
            string emergencyContactPhoneNumber = "911111111";
            string robotTaskStatus = validStatus;
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act
            var surveillanceTask = new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber,
                robotTaskStatus, surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate));

            // Assert
            Assert.Equal(validStatus, surveillanceTask.RobotTaskStatus.ToString());
        }

        [Fact]
        public void Constructor_WithValidParameters_Success()
        {
            // Arrange
            string buildingCode = "BuildingCode";
            string emergencyContactName = "EmergencyContactName";
            string emergencyContactPhoneNumber = "911111111";
            string robotTaskStatus = "Requested";
            List<int> surveillanceTaskFloors = [1];
            string createdByUser = "User";
            string createdDate = "01/01/2023 12:34:56";

            // Act
            var surveillanceTask = new SurveillanceTask(buildingCode, emergencyContactName, emergencyContactPhoneNumber,
                robotTaskStatus, surveillanceTaskFloors, createdByUser, DateTime.Parse(createdDate));

            // Assert
            Assert.Equal(buildingCode, surveillanceTask.BuildingCode);
            Assert.Equal(emergencyContactName, surveillanceTask.EmergencyContactName);
            Assert.Equal(emergencyContactPhoneNumber, surveillanceTask.EmergencyContactPhoneNumber.phoneNumber);
            Assert.Equal(robotTaskStatus, surveillanceTask.RobotTaskStatus.ToString());
            Assert.Equal(surveillanceTaskFloors, surveillanceTask.SurveillanceTaskFloors);
            Assert.Equal(createdByUser, surveillanceTask.CreatedByUser);
            Assert.Equal(DateTime.Parse(createdDate), surveillanceTask.CreatedDate.GetValue());
        }
    }
}
