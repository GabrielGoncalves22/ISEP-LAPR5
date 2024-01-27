import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface DeviceIdProps {
    value: string;
}

export class DeviceCode extends ValueObject<DeviceIdProps> {

    private static readonly MAX_CHARACTERS: number = 30;

    get value(): string {
        return this.props.value;
    }

    private constructor(props: DeviceIdProps) {
        super(props);
    }

    public static create(value: string): Result<DeviceCode> {
        const guardResult = Guard.stringLengthLessEqualsThan(value, this.MAX_CHARACTERS, 'The device code');
        if (!guardResult.succeeded) {
            return Result.fail<DeviceCode>(guardResult.message);
        } else {
            return Result.ok<DeviceCode>(new DeviceCode({ value: value }));
        }
    }

    public toString(): string {
        return this.value;
    }
}