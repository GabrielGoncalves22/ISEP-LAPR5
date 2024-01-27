export interface SurveillanceTask {
    id?: string;
    buildingCode: string;
    emergencyContactName: string;
    emergencyContactPhoneNumber: string;
    surveillanceTaskFloors: number[];
    robotTaskStatus?: string;
    createdByUser?: string;
    createdDate?: Date;
}