import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { BuildingCode } from "./buildingCode";
import { BuildingDimension } from "./buildingDimension";
import { BuildingName } from "./buildingName";
import { Description } from "./description";
import { Floor } from "./floor";
import { Elevator } from "./elevator";

import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface BuildingProps {
    code: BuildingCode;
    name: BuildingName;
    description: Description;
    numXCells: BuildingDimension;
    numYCells: BuildingDimension;
    floors: Floor[];
    elevator: Elevator;
}

export class Building extends AggregateRoot<BuildingProps> {
    buildingResult: Promise<Floor>;

    get code(): BuildingCode {
        return this.props.code;
    }

    get name(): BuildingName {
        return this.props.name;
    }

    get description(): Description {
        return this.props.description;
    }

    get numXCells(): BuildingDimension {
        return this.props.numXCells;
    }

    get numYCells(): BuildingDimension {
        return this.props.numYCells;
    }

    get floors(): Floor[] {
        return this.props.floors;
    }

    get elevator(): Elevator {
        return this.props.elevator;
    }

    set name(newName: BuildingName) {
        this.props.name = newName;
    }

    set description(newDescription: Description) {
        this.props.description = newDescription;
    }

    set numXCells(newXCells: BuildingDimension) {
        this.props.numXCells = newXCells;
    }

    set numYCells(newYCells: BuildingDimension) {
        this.props.numYCells = newYCells;
    }

    set elevator(newElevator: Elevator) {
        this.props.elevator = newElevator;
    }

    public addFloor(newFloor: Floor): void {
        if (!this.props.floors) {
            this.props.floors = [];
        }

        this.props.floors.push(newFloor);
    }

    public updateFloor(number: number, updatedFloor: Floor): Result<void> {
        const existingFloorIndex = this.props.floors.findIndex(floor => floor.number === number);
    
        if (existingFloorIndex === -1) {
            return Result.fail<void>(`Floor with number ${number} not found.`);
        }
    
        this.props.floors[existingFloorIndex] = updatedFloor;
    
        return Result.ok<void>();
    }

    private constructor(props: BuildingProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: BuildingProps, id?: UniqueEntityID): Result<Building> {
        const guardedProps = [
            { argument: props.numXCells, argumentName: 'X Cells' },
            { argument: props.numYCells, argumentName: 'Y Cells' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Building>(guardResult.message);
        } else {
            return Result.ok<Building>(new Building({
                ...props
            }, id));
        }
    }

}