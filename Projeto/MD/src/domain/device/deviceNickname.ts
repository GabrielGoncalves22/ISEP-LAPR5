import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface NicknameProps {
    value: string;
}

export class DeviceNickname extends ValueObject<NicknameProps> {

    private static readonly MAX_CHARACTERS: number = 30;

    get value(): string {
        return this.props.value;
    }

    private constructor(props: NicknameProps) {
        super(props);
    }

    public static create(value: string): Result<DeviceNickname> {

        const guardResult = Guard.stringLengthLessEqualsThan(value, this.MAX_CHARACTERS, 'The nickname');

        if (!guardResult.succeeded) {
            return Result.fail<DeviceNickname>(guardResult.message);
        } else {
            return Result.ok<DeviceNickname>(new DeviceNickname({ value: value }));
        }
    }

    public toString(): string {
        return this.value;
    }
}