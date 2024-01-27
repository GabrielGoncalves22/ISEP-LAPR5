import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface CellInfoProps {
    type: number;
}

export class CellInfo extends ValueObject<CellInfoProps> {
    private static readonly MIN_TYPE_VALUE: number = 0;
    private static readonly MAX_TYPE_VALUE: number = 3;
   
    get type(): number {
        return this.props.type;
    }

    private constructor(props: CellInfoProps) {
        super(props);
    }

    public static create(type: number): Result<CellInfo> {
        const guardResult = Guard.inRange(type, this.MIN_TYPE_VALUE, this.MAX_TYPE_VALUE, 'The cell type');

        if (!guardResult.succeeded) {
            return Result.fail<CellInfo>(guardResult.message);
        } else {
            return Result.ok<CellInfo>(new CellInfo({ type: type }));
        }
    }

}
