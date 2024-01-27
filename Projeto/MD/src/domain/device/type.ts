import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface TypeProps {
    type: string;
}

export class Type extends ValueObject<TypeProps> {

    private static readonly MAX_CHARACTERS: number = 25;

    get type(): string {
        return this.props.type;
    }

    private constructor(props: TypeProps) {
        super(props);
    }

    public static create(type: string): Result<Type> {
        const guardResult = Guard.stringLengthLessEqualsThan(type, this.MAX_CHARACTERS, 'The type');

        if (!guardResult.succeeded) {
            return Result.fail<Type>(guardResult.message);
        } else {
            return Result.ok<Type>(new Type({ type: type }))
        }
    }

    public toString(): string {
        return this.type;
    }
}