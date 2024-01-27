import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';

import IElevatorDTO from "../dto/IElevatorDTO";
import { Elevator } from "../domain/building/elevator";

export class ElevatorMap extends Mapper<Elevator> {

    public static toDTO(elevator: Elevator): IElevatorDTO {
        return elevator ? {
            brand: elevator.brand.toString(),
            model: elevator.model.toString(),
            serialNumber: elevator.serialNumber.toString(),
            description: elevator.description ? elevator.description.toString() : '',
            floors: elevator.floors.map(floor => ({
                number: floor.number
            }))
        } as IElevatorDTO : null;
    }

    public static toDomain(elevator: any | Model<IBuildingPersistence & Document>): Elevator {
        const elevatorOrError = Elevator.create(
            elevator
        );

        elevatorOrError.isFailure ? console.log(elevatorOrError.error) : '';

        return elevatorOrError.isSuccess ? elevatorOrError.getValue() : null;
    }

    public static toPersistence(elevator: Elevator): any {
        return elevator ? {
            brand: elevator.brand.toString(),
            model: elevator.model.toString(),
            serialNumber: elevator.serialNumber.toString(),
            description: elevator.description.toString(),
            floors: elevator.floors.map(floor => ({
                number: floor.number,
                elevatorCellOrientation: floor.elevatorCellOrientation ? floor.elevatorCellOrientation : null
            })),
            xStartCell: elevator.xStartCell && elevator.xStartCell.position !== undefined ? elevator.xStartCell.position : elevator.xStartCell,
            yStartCell: elevator.yStartCell && elevator.yStartCell.position !== undefined ? elevator.yStartCell.position : elevator.yStartCell
        } : null
    }
}