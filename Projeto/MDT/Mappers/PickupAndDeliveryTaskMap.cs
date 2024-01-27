using MDT.Domain.PickupAndDeliveryTasks;
using MDT.DTO;
using MDT.Persistence.Schema;

namespace MDT.Mappers
{
    public class PickupAndDeliveryTaskMap
    {

        public static PickupAndDeliveryTaskDTO ToDTO(PickupAndDeliveryTask pickupAndDeliveryTask)
        {
            return new PickupAndDeliveryTaskDTO
            {
                Id = pickupAndDeliveryTask.Id,
                PickupContactName = pickupAndDeliveryTask.PickupContactName,
                PickupContactPhoneNumber = pickupAndDeliveryTask.PickupContactPhoneNumber.phoneNumber,
                DeliveryContactName = pickupAndDeliveryTask.DeliveryContactName,
                DeliveryContactPhoneNumber = pickupAndDeliveryTask.DeliveryContactPhoneNumber.phoneNumber,
                TaskDescription = pickupAndDeliveryTask.TaskDescription.Description,
                ConfirmationCode = pickupAndDeliveryTask.ConfirmationCode.Code,
                RobotTaskStatus = pickupAndDeliveryTask.RobotTaskStatus.ToString(),
                PickupBuildingCode = pickupAndDeliveryTask.PickupBuildingCode,
                PickupRoomName = pickupAndDeliveryTask.PickupRoomName,
                DeliveryBuildingCode = pickupAndDeliveryTask.DeliveryBuildingCode,
                DeliveryRoomName = pickupAndDeliveryTask.DeliveryRoomName,
                CreatedByUser = pickupAndDeliveryTask.CreatedByUser,
                CreatedDate = pickupAndDeliveryTask.CreatedDate.ToString()
            };
        }

        public static PickupAndDeliveryTask ToDomain(PickupAndDeliveryTaskSchema pickupAndDeliveryTaskSchema)
        {
            return new PickupAndDeliveryTask(
                pickupAndDeliveryTaskSchema.PickupContactName, pickupAndDeliveryTaskSchema.PickupContactPhoneNumber, pickupAndDeliveryTaskSchema.DeliveryContactName,
                pickupAndDeliveryTaskSchema.DeliveryContactPhoneNumber, pickupAndDeliveryTaskSchema.TaskDescription, pickupAndDeliveryTaskSchema.ConfirmationCode,
                pickupAndDeliveryTaskSchema.RobotTaskStatus, pickupAndDeliveryTaskSchema.PickupBuildingCode, pickupAndDeliveryTaskSchema.PickupRoomName,
                pickupAndDeliveryTaskSchema.DeliveryBuildingCode, pickupAndDeliveryTaskSchema.DeliveryRoomName, pickupAndDeliveryTaskSchema.CreatedByUser,
                pickupAndDeliveryTaskSchema.CreatedDate, pickupAndDeliveryTaskSchema.Id
            );
        }

        public static PickupAndDeliveryTaskSchema ToPersistence(PickupAndDeliveryTask pickupAndDeliveryTask)
        {
            return new PickupAndDeliveryTaskSchema
            {
                PickupContactName = pickupAndDeliveryTask.PickupContactName,
                PickupContactPhoneNumber = pickupAndDeliveryTask.PickupContactPhoneNumber.phoneNumber,
                DeliveryContactName = pickupAndDeliveryTask.DeliveryContactName,
                DeliveryContactPhoneNumber = pickupAndDeliveryTask.DeliveryContactPhoneNumber.phoneNumber,
                TaskDescription = pickupAndDeliveryTask.TaskDescription.Description,
                ConfirmationCode = pickupAndDeliveryTask.ConfirmationCode.Code,
                RobotTaskStatus = pickupAndDeliveryTask.RobotTaskStatus.ToString(),
                PickupBuildingCode = pickupAndDeliveryTask.PickupBuildingCode,
                PickupRoomName = pickupAndDeliveryTask.PickupRoomName,
                DeliveryBuildingCode = pickupAndDeliveryTask.DeliveryBuildingCode,
                DeliveryRoomName = pickupAndDeliveryTask.DeliveryRoomName,
                CreatedByUser = pickupAndDeliveryTask.CreatedByUser,
                CreatedDate = pickupAndDeliveryTask.CreatedDate.GetValue()
            };
        }

    }
}