import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import config from "../../../config";

interface UserEmailProps {
    email: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {

    get email(): string {
        return this.props.email;
    }

    private constructor(props: UserEmailProps) {
        super(props);
    }

    public static validateEmail(userEmail: string): boolean {
        const emailRegex = new RegExp(`^[a-zA-Z0-9._-]+@${config.emailDomain}$`);

        return emailRegex.test(userEmail);
    }

    public static create(userEmail: string): Result<UserEmail> {
        const guardResult = Guard.againstNullOrUndefined(userEmail, 'Email');

        if (!guardResult.succeeded) {
            return Result.fail<UserEmail>(guardResult.message);
        } else {

            if (!this.validateEmail(userEmail)) {
                return Result.fail<UserEmail>(`Email is not valid or does not belong to the domain ${config.emailDomain}`);
            } else {
                return Result.ok<UserEmail>(new UserEmail({ email: userEmail }))
            }
        }
    }

    public toString(): string {
        return this.email;
    }
}