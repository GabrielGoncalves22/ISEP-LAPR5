import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface CellPositionProps {
    position: number;
}

export class CellPosition extends ValueObject<CellPositionProps> {
    private static readonly MIN_POSITION: number = 0;
   
    get position(): number {
        return this.props.position;
    }

    set changePosition(position: number) {
        this.props.position = position;
    }

    private constructor(props: CellPositionProps) {
        super(props);
    }

    public static create(position: number): Result<CellPosition> {
        const guardResult = Guard.isGreaterEqualsThan(position, this.MIN_POSITION, 'The cell position');

        if (!guardResult.succeeded) {
            return Result.fail<CellPosition>(guardResult.message);
        } else {
            return Result.ok<CellPosition>(new CellPosition({ position: position }));
        }
    }

}
