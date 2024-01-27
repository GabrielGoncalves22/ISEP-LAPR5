import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface UserTelephoneProps {
    number: string;
}

export class UserTelephone extends ValueObject<UserTelephoneProps> {

    get number(): string {
        return this.props.number;
    }

    private constructor(props: UserTelephoneProps) {
        super(props);
    }

    public static validateTelephone(userTelephone: string): boolean {
        const numberRegex = new RegExp(/9[1236][0-9]{7}|2[1-9][0-9]{7}/);

        return numberRegex.test(userTelephone);
    }

    public static create(userTelephone: string): Result<UserTelephone> {
        const guardResult = Guard.againstNullOrUndefined(userTelephone, 'Telephone');

        if (!guardResult.succeeded) {
            return Result.fail<UserTelephone>(guardResult.message);
        } else {

            if (!this.validateTelephone(userTelephone)) {
                return Result.fail<UserTelephone>(`Telephone is not valid`);
            } else {
                return Result.ok<UserTelephone>(new UserTelephone({ number: userTelephone }))
            }
        }
    }

    public toString(): string {
        return this.number;
    }
}