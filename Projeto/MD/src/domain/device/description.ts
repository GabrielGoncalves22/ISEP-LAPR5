import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface DescriptionProps {
    description: string;
}

export class Description extends ValueObject<DescriptionProps> {

    private static readonly MAX_CHARACTERS: number = 255;

    get description(): string {
        return this.props.description;
    }

    private constructor(props: DescriptionProps) {
        super(props);
    }

    public static create(description: string): Result<Description> {
        const guardResult = Guard.stringLengthLessEqualsThan(description || '', this.MAX_CHARACTERS, 'The description');
        
        if (!guardResult.succeeded) {
            return Result.fail<Description>(guardResult.message);
        } else {
            return Result.ok<Description>(new Description({ description: description }));
        }
    }

    public toString(): string {
        return this.description;
    }
}