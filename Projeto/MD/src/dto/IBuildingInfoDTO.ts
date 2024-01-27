export default interface IBuildingInfoDTO {
    code: string;
    name: string;
    description: string;
    numXCells: number;
    numYCells: number;
    hasElevator: boolean;
    numFloors: number;
}