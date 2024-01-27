namespace MDT.DTO
{
    public class SurveillanceTaskDTO
    {
        public string? Id { get; set; }
        public string BuildingCode { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public string? RobotTaskStatus { get; set; }
        public List<int> SurveillanceTaskFloors { get; set; }
        public string CreatedByUser { get; set; }
        public string CreatedDate { get; set; }
    }
}
