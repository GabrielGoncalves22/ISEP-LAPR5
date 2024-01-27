using MDT.Domain.SharedValueObjects;
using Xunit;

namespace MDT.tests.Domain
{
    public class RobotTaskStatusTest
    {
        [Fact]
        public void Enum_ShouldContainRequested()
        {
            // Assert
            Assert.Contains(RobotTaskStatus.Requested, Enum.GetValues(typeof(RobotTaskStatus)).Cast<RobotTaskStatus>());
        }

        [Fact]
        public void Enum_ShouldContainApproved()
        {
            // Assert
            Assert.Contains(RobotTaskStatus.Approved, Enum.GetValues(typeof(RobotTaskStatus)).Cast<RobotTaskStatus>());
        }

        [Fact]
        public void Enum_ShouldContainRejected()
        {
            // Assert
            Assert.Contains(RobotTaskStatus.Rejected, Enum.GetValues(typeof(RobotTaskStatus)).Cast<RobotTaskStatus>());
        }
    }
}
