import { Repo } from "../../core/infra/Repo";
import { Building } from "../../domain/building/building";
import { Floor } from "../../domain/building/floor";
import { Elevator } from "../../domain/building/elevator";
import { Room } from "../../domain/building/room";
import { BuildingCode } from "../../domain/building/buildingCode";

export default interface IBuildingRepo extends Repo<Building> {
    save(building: Building): Promise<Building>;
    update(building: Building): Promise<Building>;
    findByCode(buildingCode: BuildingCode | string): Promise<Building>;
    findFloor(buildingCode: BuildingCode | string, floorNumber: number): Promise<Floor>;
    findElevator(buildingCode: BuildingCode | string): Promise<Elevator>;
    findBuildingsBetweenMinAndMaxFloors(numMinFloors: number, numMaxFloors: number);
    findAll(): Promise<Building[]>;
    findAllBuildings(): Promise<Building[]>
    findRoom(buildingCode: string, roomName: string): Promise<Room>;
}