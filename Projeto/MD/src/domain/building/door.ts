import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { CellPosition } from "./cellPosition";
import { CellOrientation } from "./cellOrientation";

interface DoorProps {
    yPositionCell: CellPosition;
    xPositionCell: CellPosition;
    cellOrientation: CellOrientation;
}

export class Door extends AggregateRoot<DoorProps> {

    get yPositionCell(): CellPosition {
        return this.props.yPositionCell;
    }

    get xPositionCell(): CellPosition {
        return this.props.xPositionCell;
    }

    get cellOrientation(): CellOrientation {
        return this.props.cellOrientation;
    }

    set yPositionCell(yPositionCell : CellPosition) {
        this.props.yPositionCell = yPositionCell;
    }

    set xPositionCell(xPositionCell : CellPosition) {
        this.props.xPositionCell = xPositionCell;
    }

    set cellOrientation(cellOrientation : CellOrientation) {
        this.props.cellOrientation = cellOrientation;
    }

    private constructor(props: DoorProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: DoorProps, id?: UniqueEntityID): Result<Door> {
        const guardedProps = [
            { argument: props.yPositionCell, argumentName: 'Position Y cell' },
            { argument: props.xPositionCell, argumentName: 'Position X cell' },
            { argument: props.cellOrientation, argumentName: 'Cell orientation' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Door>(guardResult.message);
        } else {
            return Result.ok<Door>(new Door({
                ...props
            }, id));
        }
    }

}
