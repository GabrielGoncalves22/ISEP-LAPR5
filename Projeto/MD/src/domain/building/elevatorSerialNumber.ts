import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ElevatorSerialNumberProps {
    serialNumber: string;
}

export class ElevatorSerialNumber extends ValueObject<ElevatorSerialNumberProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get serialNumber(): string {
        return this.props.serialNumber;
    }

    private constructor(props: ElevatorSerialNumberProps) {
        super(props);
    }

    public static create(serialNumber: string): Result<ElevatorSerialNumber> {
        const guardResult = Guard.stringLengthLessEqualsThan(serialNumber || '', this.MAX_CHARACTERS, 'The elevator serial number');

        if (!guardResult.succeeded) {
            return Result.fail<ElevatorSerialNumber>(guardResult.message);
        } else {
            return Result.ok<ElevatorSerialNumber>(new ElevatorSerialNumber({ serialNumber: serialNumber }))
        }
    }

    public toString(): string {
        return this.serialNumber;
    }
}