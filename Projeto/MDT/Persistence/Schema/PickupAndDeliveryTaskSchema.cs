using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MDT.Persistence.Schema
{
    public class PickupAndDeliveryTaskSchema
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id;
        [BsonElement("pickupContactName")]
        public string PickupContactName { get; set; }
        [BsonElement("pickupContactPhoneNumber")]
        public string PickupContactPhoneNumber { get; set; }
        [BsonElement("deliveryContactName")]
        public string DeliveryContactName { get; set; }
        [BsonElement("deliveryContactPhoneNumber")]
        public string DeliveryContactPhoneNumber { get; set; }
        [BsonElement("taskDescription")]
        public string TaskDescription { get; set; }
        [BsonElement("confirmationCode")]
        public string ConfirmationCode { get; set; }
        [BsonElement("robotTaskStatus")]
        public string RobotTaskStatus { get; set; }
        [BsonElement("pickupBuildingCode")]
        public string PickupBuildingCode { get; set; }
        [BsonElement("pickupRoomName")]
        public string PickupRoomName { get; set; }
        [BsonElement("deliveryBuildingCode")]
        public string DeliveryBuildingCode { get; set; }
        [BsonElement("deliveryRoomName")]
        public string DeliveryRoomName { get; set; }

        [BsonElement("createByUser")]
        public string CreatedByUser { get; set; }
        [BsonElement("createdDate")]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime CreatedDate { get; set; }
    }
}
