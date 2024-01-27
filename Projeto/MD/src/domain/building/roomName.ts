import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RoomNameProps {
    name: string;
}

export class RoomName extends ValueObject<RoomNameProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get name(): string {
        return this.props.name;
    }

    private constructor(props: RoomNameProps) {
        super(props);
    }

    public static create(roomName: string): Result<RoomName> {
        const guardResult = Guard.stringLengthLessEqualsThan(roomName || '', this.MAX_CHARACTERS, 'The name of the room');
        if (!guardResult.succeeded) {
            return Result.fail<RoomName>(guardResult.message);
        } else {
            return Result.ok<RoomName>(new RoomName({ name: roomName }));
        }
    }

    public toString(): string {
        return this.name;
    }
}
