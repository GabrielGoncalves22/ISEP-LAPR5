export interface PickupAndDeliveryTask {
    id?: string;
    pickupContactName: string;
    pickupContactPhoneNumber: string;
    deliveryContactName: string;
    deliveryContactPhoneNumber: string;
    taskDescription: string;
    confirmationCode: string;
    pickupBuildingCode: string;
    pickupRoomName: string;
    deliveryBuildingCode: string;
    deliveryRoomName: string;
    robotTaskStatus?: string;
    createdByUser?: string;
    createdDate?: Date;
}
