import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface SerialNumberProps {
    value: string
}

export class DeviceSerialNumber extends ValueObject<SerialNumberProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get value(): string {
        return this.props.value;
    }

    private constructor(props: SerialNumberProps) {
        super(props);
    }

    public static create(value: string): Result<DeviceSerialNumber> {

        const guardedProps = [
            { argument: value, argumentName: 'value' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps)
            && Guard.stringLengthLessEqualsThan(value, this.MAX_CHARACTERS, 'The serial number');

        if (!guardResult.succeeded) {
            return Result.fail<DeviceSerialNumber>(guardResult.message)
        }
        else {
            return Result.ok<DeviceSerialNumber>(new DeviceSerialNumber({ value: value }));
        }
    }

    public toString(): string {
        return this.value;
    }
}