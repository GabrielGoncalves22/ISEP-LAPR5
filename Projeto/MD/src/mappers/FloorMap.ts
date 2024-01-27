import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';

import IFloorDTO from "../dto/IFloorDTO";
import IFloorInfoDTO from "../dto/IFloorInfoDTO";
import IFloorMapDTO from "../dto/IFloorMapDTO";
import { Floor } from "../domain/building/floor";
import { Passageway } from "../domain/building/passageway";
import { Elevator } from "../domain/building/elevator";
import { Building } from "../domain/building/building";
import { RoomMap } from "./RoomMap";

export class FloorMap extends Mapper<Floor> {

    public static toDTO(floor: Floor): IFloorDTO {
        return floor ? {
            number: floor.number,
            description: floor.description ? floor.description.toString() : ''
        } as IFloorDTO : null;
    }

    public static toInfoDTO(floors: Floor[]): IFloorInfoDTO[] {
        if (Array.isArray(floors) && floors.length > 0) {
            return floors.map(floor => ({
                number: floor.number,
                description: floor.description ? floor.description.toString() : ''
            }));
        } else {
            return [];
        }
    }

    public static toDomain(floor: any | Model<IBuildingPersistence & Document>): Floor {
        const floorOrError = Floor.create(
            floor
        );

        floorOrError.isFailure ? console.log(floorOrError.error) : '';

        return floorOrError.isSuccess ? floorOrError.getValue() : null;
    }

    public static toPersistence(floor: Floor): any {
        return floor ? {
            number: floor.number,
            description: floor.description.toString(),
            rooms: floor.rooms.map(room => (
                RoomMap.toPersistence(room)
            )),
            map: floor.map ? floor.map.map((mapX) => {
                return mapX.map((element) => {
                    return element && element.type !== undefined ? element.type : element === null ? -1 : element;
                });
            }) : []
        } : null;
    }

    public static toMapDTO(building: Building, floor: Floor, passageways: Passageway[], elevatorData: Elevator): IFloorMapDTO {
        if (!floor || !floor.map) {
            return null;
        }

        const floorMapResult: IFloorMapDTO = {
            floor: {
                size: {
                    numXCells: Number(building.numXCells),
                    numYCells: Number(building.numYCells)
                },
                map: floor.map.map((mapX) => {
                    return mapX.map((element: any) => {
                        return element;
                    });
                }),
                passageways: passageways !== undefined ? passageways.map(passageway => ({
                    code: passageway.code.toString(),
                    destinationBuilding: passageway.building2.toString(),
                    destinationFloor: Number(passageway.floor2),
                    xStartCell: Number(passageway.xStartCell),
                    yStartCell: Number(passageway.yStartCell),
                    cellOrientation: passageway.cellOrientation
                })) : [],
                elevator: elevatorData !== undefined ? {
                    xStartCell: Number(elevatorData.xStartCell),
                    yStartCell: Number(elevatorData.yStartCell),
                    cellOrientation: elevatorData.floors.find((elevatorFloor) => elevatorFloor.number === floor.number).elevatorCellOrientation
                } : undefined,
                rooms: floor.rooms !== undefined ? floor.rooms.map(room => ({
                    name: room.name.toString(),
                    xStartCell: Number(room.xStartCell),
                    yStartCell: Number(room.yStartCell),
                    xEndCell: Number(room.xEndCell),
                    yEndCell: Number(room.yEndCell),
                    doors: room.doors !== undefined ? room.doors.map(door => ({
                        xPositionCell: Number(door.xPositionCell),
                        yPositionCell: Number(door.yPositionCell),
                        cellOrientation: door.cellOrientation
                    })) : []
                })) : []
            }
        };

        if (floorMapResult.floor.map.length === 0) {
            return null;
        } else {
            return floorMapResult;
        }
    }

}
