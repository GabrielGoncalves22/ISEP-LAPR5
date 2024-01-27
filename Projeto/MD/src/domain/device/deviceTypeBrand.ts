import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface DeviceTypeBrandProps {
    brand: string;
}

export class DeviceTypeBrand extends ValueObject<DeviceTypeBrandProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get brand(): string {
        return this.props.brand;
    }

    private constructor(props: DeviceTypeBrandProps) {
        super(props);
    }

    public static create(brand: string): Result<DeviceTypeBrand> {
        const guardResult = Guard.stringLengthLessEqualsThan(brand, this.MAX_CHARACTERS, 'The brand');

        if (!guardResult.succeeded) {
            return Result.fail<DeviceTypeBrand>(guardResult.message);
        } else {
            return Result.ok<DeviceTypeBrand>(new DeviceTypeBrand({ brand: brand }))
        }
    }

    public toString(): string {
        return this.brand;
    }
}