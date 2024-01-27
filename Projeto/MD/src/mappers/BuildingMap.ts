import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';
import { FloorMap } from '../mappers/FloorMap';
import { ElevatorMap } from '../mappers/ElevatorMap';

import IBuildingDTO from "../dto/IBuildingDTO";
import IBuildingInfoDTO from "../dto/IBuildingInfoDTO";
import { Building } from "../domain/building/building";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class BuildingMap extends Mapper<Building> {

    public static toDTO(building: Building): IBuildingDTO {
        return {
            code: building.code.toString(),
            name: building.name.toString(),
            description: building.description ? building.description.toString() : '',
            numXCells: building.numXCells.numCells,
            numYCells: building.numYCells.numCells,
            floors: building.floors.map(floor => (
                FloorMap.toDTO(floor)
            )),
            elevator: ElevatorMap.toDTO(building.elevator)
        } as IBuildingDTO;
    }

    public static toDomain(building: any | Model<IBuildingPersistence & Document>): Building {
        const buildingOrError = Building.create(
            building,
            new UniqueEntityID(building.code)
        );

        buildingOrError.isFailure ? console.log(buildingOrError.error) : '';

        return buildingOrError.isSuccess ? buildingOrError.getValue() : null;
    }

    public static toPersistence(building: Building): any {
        return {
            code: building.code,
            name: building.name.toString(),
            description: building.description.toString(),
            numXCells: building.numXCells.numCells,
            numYCells: building.numYCells.numCells,
            floors: building.floors.map(floor => (
                FloorMap.toPersistence(floor)
            )),
            elevator: ElevatorMap.toPersistence(building.elevator)
        }
    }

    public static toInfoDTO(building: any | Model<IBuildingPersistence & Document>): IBuildingInfoDTO {
        return {
            code: building.code.toString(),
            name: building.name.toString(),
            description: building.description ? building.description.toString() : '',
            numXCells: building.numXCells,
            numYCells: building.numYCells,
            hasElevator: building.hasElevator,
            numFloors: building.numFloors
        } as IBuildingInfoDTO;
    }
}