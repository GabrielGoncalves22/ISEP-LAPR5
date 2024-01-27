import { Result } from "../../core/logic/Result";
import IBuildingDTO from "../../dto/IBuildingDTO";
import IBuildingInfoDTO from "../../dto/IBuildingInfoDTO";
import IFloorDTO from "../../dto/IFloorDTO";
import IElevatorDTO from "../../dto/IElevatorDTO";
import IRoomDTO from "../../dto/IRoomDTO";
import IFloorInfoDTO from "../../dto/IFloorInfoDTO";
import IFloorMapDTO from "../../dto/IFloorMapDTO";
import IRoomLocalizationDTO from "../../dto/IRoomLocalizationDTO";

export default interface IBuildingService {
    createBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>>;
    updateBuilding(buildingCode: string, buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>>;
    createFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>>;
    createElevator(elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>>;
    updateElevator(buildingCode: string, elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>>;
    updateFloor(buildingCode: string, number: number, floorDTO: IFloorDTO): Promise<Result<IFloorDTO>>;
    loadMap(buildingCode: string, floorNumber: number, floorMap: IFloorMapDTO): Promise<Result<IFloorMapDTO>>;
    createRoom(elevatorDTO: IRoomDTO): Promise<Result<IRoomDTO>>;
    getElevatorByBuilding(buildingCode: string): Promise<Result<IElevatorDTO>>;
    getBuildingsBetweenMinAndMaxFloors(numMinFloors: number, numMaxFloors: number): Promise<Result<IBuildingInfoDTO[]>>;
    getBuildings(): Promise<Result<IBuildingInfoDTO[]>>;
    getBuildingByCode(buildingCode: string): Promise<Result<IBuildingInfoDTO>>;
    getFloorsByBuilding(buildingCode: string): Promise<Result<IFloorInfoDTO[]>>;
    getFloorsWithPassagewaysToBuildingByBuilding(buildingCode: string): Promise<Result<IFloorDTO[][]>>;
    validateMapFileData(file: Buffer): Result<IFloorMapDTO>;
    getMap(buildingCode: string, floorNumber: number): Promise<Result<IFloorMapDTO>>;
    getRoomByName(buildingCode: string, roomName: string): Promise<Result<IRoomLocalizationDTO>>;
    getAllRooms(): Promise<Result<IRoomDTO[]>>;
    checkBuildingFloors(buildingCode: string, floors: number[]): Promise<Result<string>>;
}
