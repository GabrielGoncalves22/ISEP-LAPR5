import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface UserNameProps {
    name: string;
}

export class UserName extends ValueObject<UserNameProps> {

    get name(): string {
        return this.props.name;
    }

    private constructor(props: UserNameProps) {
        super(props);
    }

    public static create(userName: string): Result<UserName> {
        const guardResult = Guard.againstNullOrUndefined(userName, 'Name');

        if (!guardResult.succeeded) {
            return Result.fail<UserName>(guardResult.message);
        } else {
            return Result.ok<UserName>(new UserName({ name: userName }))
        }
    }

    public toString(): string {
        return this.name;
    }
}