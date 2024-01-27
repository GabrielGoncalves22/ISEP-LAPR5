import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Floor } from "./floor";
import { Description } from "./description";
import { ElevatorBrand } from "./elevatorBrand";
import { ElevatorModel } from "./elevatorModel";
import { ElevatorSerialNumber } from "./elevatorSerialNumber";

import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { CellPosition } from "./cellPosition";

interface ElevatorProps {
    brand: ElevatorBrand;
    model: ElevatorModel;
    serialNumber: ElevatorSerialNumber;
    description: Description;
    floors: Floor[];
    xStartCell: CellPosition;
    yStartCell: CellPosition;
}

export class Elevator extends AggregateRoot<ElevatorProps> {

    get brand(): ElevatorBrand {
        return this.props.brand;
    }

    get model(): ElevatorModel {
        return this.props.model;
    }

    get serialNumber(): ElevatorSerialNumber {
        return this.props.serialNumber;
    }

    get description(): Description {
        return this.props.description;
    }

    get floors(): Floor[] {
        return this.props.floors;
    }

    get xStartCell(): CellPosition {
        return this.props.xStartCell;
    }

    get yStartCell(): CellPosition {
        return this.props.yStartCell;
    }

    set brand(brand: ElevatorBrand) {
        this.props.brand = brand;
    }

    set model(model: ElevatorModel) {
        this.props.model = model;
    }

    set serialNumber(serialNumber: ElevatorSerialNumber) {
        this.props.serialNumber = serialNumber;
    }

    set description(description: Description) {
        this.props.description = description;
    }

    set floors(floors: Floor[]) {
        this.props.floors = floors;
    }

    set xStartCell(xStartCell: CellPosition) {
        this.props.xStartCell = xStartCell;
    }

    set yStartCell(yStartCell: CellPosition) {
        this.props.yStartCell = yStartCell;
    }

    private constructor(props: ElevatorProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: ElevatorProps, id?: UniqueEntityID): Result<Elevator> {
        const guardedProps = [
            { argument: props.floors, argumentName: 'Floors' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Elevator>(guardResult.message);
        } else {
            return Result.ok<Elevator>(new Elevator({
                ...props
            }, id));
        }
    }

}