using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MDT.Persistence.Schema
{
    public class SurveillanceTaskSchema
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id;
        [BsonElement("buildingCode")]
        public string BuildingCode { get; set; }
        [BsonElement("emergencyContactName")]
        public string EmergencyContactName { get; set; }
        [BsonElement("emergencyContactPhoneNumber")]
        public string EmergencyContactPhoneNumber { get; set; }
        [BsonElement("robotTaskStatus")]
        public string RobotTaskStatus { get; set; }
        [BsonElement("surveillanceTaskFloors")]
        public List<int> SurveillanceTaskFloors { get; set; }
        [BsonElement("createByUser")]
        public string CreatedByUser { get; set; }
        [BsonElement("createdDate")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedDate { get; set; }
    }
}