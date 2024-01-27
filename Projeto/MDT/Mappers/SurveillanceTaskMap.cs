using MDT.Domain.SurveillanceTasks;
using MDT.DTO;
using MDT.Persistence.Schema;

namespace MDT.Mappers
{
    public class SurveillanceTaskMap
    {

        public static SurveillanceTaskDTO ToDTO(SurveillanceTask surveillanceTask)
        {
            return new SurveillanceTaskDTO
            {
                Id = surveillanceTask.Id,
                BuildingCode = surveillanceTask.BuildingCode,
                EmergencyContactName = surveillanceTask.EmergencyContactName,
                EmergencyContactPhoneNumber = surveillanceTask.EmergencyContactPhoneNumber.phoneNumber,
                RobotTaskStatus = surveillanceTask.RobotTaskStatus.ToString(),
                SurveillanceTaskFloors = new List<int>(surveillanceTask.SurveillanceTaskFloors),
                CreatedByUser = surveillanceTask.CreatedByUser,
                CreatedDate = surveillanceTask.CreatedDate.ToString()
            };
        }

        public static SurveillanceTask ToDomain(SurveillanceTaskSchema surveillanceTaskSchema)
        {
            return new SurveillanceTask(surveillanceTaskSchema.BuildingCode, surveillanceTaskSchema.EmergencyContactName, surveillanceTaskSchema.EmergencyContactPhoneNumber,
                surveillanceTaskSchema.RobotTaskStatus, surveillanceTaskSchema.SurveillanceTaskFloors, surveillanceTaskSchema.CreatedByUser, surveillanceTaskSchema.CreatedDate,
                surveillanceTaskSchema.Id);
        }

        public static SurveillanceTaskSchema ToPersistence(SurveillanceTask surveillanceTask)
        {
            return new SurveillanceTaskSchema
            {
                BuildingCode = surveillanceTask.BuildingCode,
                EmergencyContactName = surveillanceTask.EmergencyContactName,
                EmergencyContactPhoneNumber = surveillanceTask.EmergencyContactPhoneNumber.phoneNumber,
                RobotTaskStatus = surveillanceTask.RobotTaskStatus.ToString(),
                SurveillanceTaskFloors = new List<int>(surveillanceTask.SurveillanceTaskFloors),
                CreatedByUser = surveillanceTask.CreatedByUser,
                CreatedDate = surveillanceTask.CreatedDate.GetValue()
            };
        }

    }
}
