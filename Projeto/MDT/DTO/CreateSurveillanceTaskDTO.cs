namespace MDT.DTO
{
    public class CreateSurveillanceTaskDTO
    {
        public string BuildingCode { get; set; }
        public string EmergencyContactName { get; set; }
        public string EmergencyContactPhoneNumber { get; set; }
        public List<int> SurveillanceTaskFloors { get; set; }
    }
}
