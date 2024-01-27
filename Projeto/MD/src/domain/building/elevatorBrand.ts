import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ElevatorBrandProps {
    brand: string;
}

export class ElevatorBrand extends ValueObject<ElevatorBrandProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get brand(): string {
        return this.props.brand;
    }

    private constructor(props: ElevatorBrandProps) {
        super(props);
    }

    public static create(brand: string): Result<ElevatorBrand> {
        const guardResult = Guard.stringLengthLessEqualsThan(brand || '', this.MAX_CHARACTERS, 'The elevator brand');

        if (!guardResult.succeeded) {
            return Result.fail<ElevatorBrand>(guardResult.message);
        } else {
            return Result.ok<ElevatorBrand>(new ElevatorBrand({ brand: brand }))
        }
    }

    public toString(): string {
        return this.brand;
    }
}