using MDT.Domain.Shared;
using MDT.Domain.SharedValueObjects;
using MDT.Exceptions;

namespace MDT.Domain.PickupAndDeliveryTasks
{
    public class PickupAndDeliveryTask : IAggregateRoot
    {
        public string Id { get; set; }
        public string PickupContactName { get; set; }
        public Contact PickupContactPhoneNumber { get; set; }
        public string DeliveryContactName { get; set; }
        public Contact DeliveryContactPhoneNumber { get; set; }
        public TaskDescription TaskDescription { get; set; }
        public ConfirmationCode ConfirmationCode { get; set; }
        public RobotTaskStatus RobotTaskStatus { get; set; }
        public string PickupBuildingCode { get; set; }
        public string PickupRoomName { get; set; }
        public string DeliveryBuildingCode { get; set; }
        public string DeliveryRoomName { get; set; }
        public string CreatedByUser { get; private set; }
        public DateTimeCreation CreatedDate { get; private set; }

        public PickupAndDeliveryTask(
            string PickupContactName, string PickupContactPhoneNumber, string DeliveryContactName, string DeliveryContactPhoneNumber,
            string TaskDescription, string ConfirmationCode, string RobotTaskStatus, string PickupBuildingCode,
            string PickupRoomName, string DeliveryBuildingCode, string DeliveryRoomName, string CreatedByUser, DateTime CreatedDate,
            string? Id = null)
        {
            this.Id = Id;

            (string, string)[] values = [
                (PickupRoomName, "Pickup Room"),
                (PickupBuildingCode, "Pickup Building Code"),
                (DeliveryRoomName, "Delivery Room"),
                (DeliveryBuildingCode, "Delivery Building Code"),
                (PickupContactName, "Pickup Contact Name"),
                (PickupContactPhoneNumber, "Pickup Contact Phone Number"),
                (DeliveryContactName, "Delivery Contact Name"),
                (DeliveryContactPhoneNumber, "Delivery Contact Phone Number"),
                (ConfirmationCode, "Confirmation Code")
            ];

            try
            {
                Guard.BulkValidateArguments(values);
                this.PickupContactPhoneNumber = new Contact(PickupContactPhoneNumber);
                this.DeliveryContactPhoneNumber = new Contact(DeliveryContactPhoneNumber);
                this.TaskDescription = new TaskDescription(TaskDescription);
                this.ConfirmationCode = new ConfirmationCode(ConfirmationCode);
            }
            catch (Exception ex)
            {
                throw new InvalidPickupAndDeliveryTask(ex.Message);
            }

            this.PickupContactName = PickupContactName;
            this.DeliveryContactName = DeliveryContactName;
            this.PickupBuildingCode = PickupBuildingCode;
            this.PickupRoomName = PickupRoomName;
            this.DeliveryBuildingCode = DeliveryBuildingCode;
            this.DeliveryRoomName = DeliveryRoomName;

            if (Enum.IsDefined(typeof(RobotTaskStatus), RobotTaskStatus))
            {
                this.RobotTaskStatus = (RobotTaskStatus)Enum.Parse(typeof(RobotTaskStatus), RobotTaskStatus);
            }
            else
            {
                throw new InvalidPickupAndDeliveryTask("The inserted Robot Task Status doesn't exists!");
            }

            this.CreatedByUser = CreatedByUser;
            this.CreatedDate = new DateTimeCreation(CreatedDate);
        }
    }
}
