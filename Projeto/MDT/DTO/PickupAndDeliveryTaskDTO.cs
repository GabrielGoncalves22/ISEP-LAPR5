namespace MDT.DTO
{
    public class PickupAndDeliveryTaskDTO
    {
        public string? Id { get; set; }
        public string PickupContactName { get; set; }
        public string PickupContactPhoneNumber { get; set; }
        public string DeliveryContactName { get; set; }
        public string DeliveryContactPhoneNumber { get; set; }
        public string TaskDescription { get; set; }
        public string ConfirmationCode { get; set; }
        public string? RobotTaskStatus { get; set; }
        public string PickupBuildingCode { get; set; }
        public string PickupRoomName { get; set; }
        public string DeliveryBuildingCode { get; set; }
        public string DeliveryRoomName { get; set; }
        public string CreatedByUser { get; set; }
        public string CreatedDate { get; set; }
    }
}
