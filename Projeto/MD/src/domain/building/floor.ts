import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Description } from "./description";
import { Room } from "./room";
import { CellInfo } from "./cellInfo";

import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { CellOrientation } from "./cellOrientation";

interface FloorProps {
    number: number;
    description: Description;
    rooms: Room[];
    map: CellInfo[][];
    elevatorCellOrientation: CellOrientation;
}

export class Floor extends AggregateRoot<FloorProps> {

    get number(): number {
        return this.props.number;
    }

    get description(): Description {
        return this.props.description;
    }

    get rooms(): Room[] {
        return this.props.rooms;
    }

    get map(): CellInfo[][] {
        return this.props.map;
    }

    get elevatorCellOrientation(): CellOrientation {
        return this.props.elevatorCellOrientation;
    }

    set number(newNumber: number) {
        this.props.number = newNumber;
    }

    set description(newDescription: Description) {
        this.props.description = newDescription;
    }

    set map(map : CellInfo[][]) {
        this.props.map = map;
    }

    set elevatorCellOrientation(newElevatorCellOrientation : CellOrientation) {
        this.props.elevatorCellOrientation = newElevatorCellOrientation;
    }

    private constructor(props: FloorProps) {
        super(props);
    }

    public static create(props: FloorProps): Result<Floor> {
        const guardResult = Guard.againstNullOrUndefined(props.number, 'Number');

        if (!guardResult.succeeded) {
            return Result.fail<Floor>(guardResult.message);
        } else {
            return Result.ok<Floor>(new Floor({
                ...props
            }));
        }
    }
}
