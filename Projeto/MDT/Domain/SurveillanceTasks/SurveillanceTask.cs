using MDT.Domain.Shared;
using MDT.Domain.SharedValueObjects;
using MDT.Exceptions;

namespace MDT.Domain.SurveillanceTasks
{
    public class SurveillanceTask : IAggregateRoot
    {
        public string Id;

        public string BuildingCode { get; private set; }

        public string EmergencyContactName { get; private set; }

        public Contact EmergencyContactPhoneNumber { get; private set; }

        public RobotTaskStatus RobotTaskStatus { get; private set; }

        public List<int> SurveillanceTaskFloors { get; private set; }

        public string CreatedByUser { get; private set; }

        public DateTimeCreation CreatedDate { get; private set; }

        public SurveillanceTask(string BuildingCode, string EmergencyContactName, string EmergencyContactPhoneNumber, string RobotTaskStatus, List<int> SurveillanceTaskFloors, string CreatedByUser, DateTime CreatedDate, string? Id = null)
        {
            this.Id = Id;

            if (string.IsNullOrEmpty(BuildingCode))
            {
                throw new InvalidSurveillanceTask("Building code cannot be empty!");
            }

            this.BuildingCode = BuildingCode;

            if (string.IsNullOrEmpty(EmergencyContactName))
            {
                throw new InvalidSurveillanceTask("Emergency Contact Name cannot be empty!");
            }
            this.EmergencyContactName = EmergencyContactName;

            try
            {
                this.EmergencyContactPhoneNumber = new Contact(EmergencyContactPhoneNumber);
            }
            catch (Exception ex)
            {
                throw new InvalidSurveillanceTask(ex.Message);
            }

            if (Enum.IsDefined(typeof(RobotTaskStatus), RobotTaskStatus))
            {
                this.RobotTaskStatus = (RobotTaskStatus)Enum.Parse(typeof(RobotTaskStatus), RobotTaskStatus);
            }
            else
            {
                throw new InvalidSurveillanceTask("The inserted Robot Task Status doesn't exists!");
            }

            this.SurveillanceTaskFloors = new List<int>(SurveillanceTaskFloors);
            this.CreatedByUser = CreatedByUser;
            this.CreatedDate = new DateTimeCreation(CreatedDate);
        }
    }
}