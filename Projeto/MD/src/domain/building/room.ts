import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Description } from "./description";
import { RoomCategory } from "./roomCategory";

import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { RoomName } from "./roomName";
import { CellPosition } from "./cellPosition";
import { Door } from "./door";

interface RoomProps {
    name: RoomName;
    description: Description;
    category: RoomCategory;
    xStartCell: CellPosition;
    yStartCell: CellPosition;
    xEndCell: CellPosition;
    yEndCell: CellPosition;
    doors: Door[];
}

export class Room extends AggregateRoot<RoomProps> {

    get name(): RoomName {
        return this.props.name;
    }

    get description(): Description {
        return this.props.description;
    }

    get category(): RoomCategory {
        return this.props.category;
    }

    get xStartCell(): CellPosition {
        return this.props.xStartCell;
    }

    get yStartCell(): CellPosition {
        return this.props.yStartCell;
    }

    get xEndCell(): CellPosition {
        return this.props.xEndCell;
    }

    get yEndCell(): CellPosition {
        return this.props.yEndCell;
    }

    get doors(): Door[] {
        return this.props.doors;
    }

    set xStartCell(xStartCell : CellPosition) {
        this.props.xStartCell = xStartCell;
    }

    set yStartCell(yStartCell : CellPosition) {
        this.props.yStartCell = yStartCell;
    }

    set xEndCell(xEndCell : CellPosition) {
        this.props.xEndCell = xEndCell;
    }

    set yEndCell(yEndCell : CellPosition) {
        this.props.yEndCell = yEndCell;
    }

    set doors(doors : Door[]) {
        this.props.doors = doors;
    }

    private constructor(props: RoomProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: RoomProps, id?: UniqueEntityID): Result<Room> {
        const guardedProps = [
            { argument: props.name, argumentName: 'Name' },
            { argument: props.description, argumentName: 'Description' },
            { argument: props.category, argumentName: 'Category' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Room>(guardResult.message);
        } else {
            return Result.ok<Room>(new Room({
                ...props
            }, id));
        }
    }

}