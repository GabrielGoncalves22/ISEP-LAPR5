import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

import { PassagewayCode } from "./passagewayCode";
import { Building } from "./building";
import { Floor } from "./floor";

import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { CellOrientation } from "./cellOrientation";
import { CellPosition } from "./cellPosition";

interface PassagewayProps {
    code: PassagewayCode;
    building1: Building;
    floor1: Floor;
    building2: Building;
    floor2: Floor;
    cellOrientation: CellOrientation;
    xStartCell: CellPosition;
    yStartCell: CellPosition;
}

export class Passageway extends AggregateRoot<PassagewayProps> {

    get code(): PassagewayCode {
        return this.props.code;
    }

    get building1(): Building {
        return this.props.building1;
    }

    get floor1(): Floor {
        return this.props.floor1;
    }

    get building2(): Building {
        return this.props.building2;
    }

    get floor2(): Floor {
        return this.props.floor2;
    }

    get cellOrientation(): CellOrientation {
        return this.props.cellOrientation;
    }

    get xStartCell(): CellPosition {
        return this.props.xStartCell;
    }

    get yStartCell(): CellPosition {
        return this.props.yStartCell;
    }

    set changeBuildingOne(building1: Building) {
        this.props.building1 = building1;
    }

    set changeBuildingTwo(building2: Building) {
        this.props.building2 = building2;
    }

    set changeFloorOne(floor1: Floor) {
        this.props.floor1 = floor1;
    }

    set changeFloorTwo(floor2: Floor) {
        this.props.floor2 = floor2;
    }

    set cellOrientation(cellOrientation: CellOrientation) {
        this.props.cellOrientation = cellOrientation;
    }

    set changeXStartCell(xStartCell: CellPosition) {
        this.props.xStartCell = xStartCell;
    }

    set changeYStartCell(yStartCell: CellPosition) {
        this.props.yStartCell = yStartCell;
    }

    private constructor(props: PassagewayProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: PassagewayProps, id?: UniqueEntityID): Result<Passageway> {

        const guardedProps = [
            { argument: props.code, argumentName: 'Code' },
            { argument: props.building1, argumentName: 'Building1' },
            { argument: props.floor1, argumentName: 'Floor1' },
            { argument: props.building2, argumentName: 'Building2' },
            { argument: props.floor2, argumentName: 'Floor2' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Passageway>(guardResult.message)
        }
        else {
            const passageway = new Passageway({
                ...props
            }, id);

            return Result.ok<Passageway>(passageway);
        }
    }
}
