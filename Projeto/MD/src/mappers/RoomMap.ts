import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';

import IRoomDTO from "../dto/IRoomDTO";
import { Room } from "../domain/building/room";
import { Building } from "../domain/building/building";
import IRoomLocalizationDTO from "../dto/IRoomLocalizationDTO";
import { Floor } from "../domain/building/floor";

export class RoomMap extends Mapper<Room> {

    public static toDTO(room: Room): IRoomDTO {
        return room ? {
            name: room.name.toString(),
            description: room.description.toString(),
            category: room.category.toString()
        } as IRoomDTO : null;
    }

    public static toDTOWithBuilding(room: Room, building: Building): IRoomDTO {
        return room ? {
            name: room.name.toString(),
            description: room.description.toString(),
            category: room.category.toString(),
            building: building.code.toString()
        } as IRoomDTO : null;
    }

    public static toLocalizationDTO(room: Room, building: Building | string, floor: Floor): IRoomLocalizationDTO {
        return room ? {
            name: room.name.toString(),
            description: room.description.toString(),
            category: room.category.toString(),
            xStartCell: room.xStartCell && room.xStartCell.position !== undefined ? room.xStartCell.position : room.xStartCell,
            yStartCell: room.yStartCell && room.yStartCell.position !== undefined ? room.yStartCell.position : room.yStartCell,
            xEndCell: room.xEndCell && room.xEndCell.position !== undefined ? room.xEndCell.position : room.xEndCell,
            yEndCell: room.yEndCell && room.yEndCell.position !== undefined ? room.yEndCell.position : room.yEndCell,
            building: typeof building !== "string" ? building.code.toString() : building,
            floor: floor.number
        } as IRoomLocalizationDTO : null;
    }

    public static toDomain(room: any | Model<IBuildingPersistence & Document>): Room {
        const roomOrError = Room.create(
            room
        );

        roomOrError.isFailure ? console.log(roomOrError.error) : '';

        return roomOrError.isSuccess ? roomOrError.getValue() : null;
    }

    public static toPersistence(room: Room): any {
        return room ? {
            name: room.name,
            description: room.description.toString(),
            category: room.category,
            xStartCell: room.xStartCell && room.xStartCell.position !== undefined ? room.xStartCell.position : room.xStartCell,
            yStartCell: room.yStartCell && room.yStartCell.position !== undefined ? room.yStartCell.position : room.yStartCell,
            xEndCell: room.xEndCell && room.xEndCell.position !== undefined ? room.xEndCell.position : room.xEndCell,
            yEndCell: room.yEndCell && room.yEndCell.position !== undefined ? room.yEndCell.position : room.yEndCell,
            doors: room.doors ? room.doors.map((door) => ({
                yPositionCell: door.yPositionCell && door.yPositionCell.position !== undefined ? door.yPositionCell.position : door.yPositionCell,
                xPositionCell: door.xPositionCell && door.xPositionCell.position !== undefined ? door.xPositionCell.position : door.xPositionCell,
                cellOrientation: door.cellOrientation
            })) : []
        } : null
    }
}