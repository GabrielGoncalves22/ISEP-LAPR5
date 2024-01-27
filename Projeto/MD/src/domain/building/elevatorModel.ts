import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ElevatorModelProps {
    model: string;
}

export class ElevatorModel extends ValueObject<ElevatorModelProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get model(): string {
        return this.props.model;
    }

    private constructor(props: ElevatorModelProps) {
        super(props);
    }

    public static create(model: string): Result<ElevatorModel> {
        const guardResult = Guard.stringLengthLessEqualsThan(model || '', this.MAX_CHARACTERS, 'The elevator model');

        if (!guardResult.succeeded) {
            return Result.fail<ElevatorModel>(guardResult.message);
        } else {
            return Result.ok<ElevatorModel>(new ElevatorModel({ model: model }))
        }
    }

    public toString(): string {
        return this.model;
    }
}