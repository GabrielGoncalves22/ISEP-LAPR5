import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

import { UserId } from "./userId";
import { UserName } from "./userName";
import { UserEmail } from "./userEmail";
import { UserPassword } from "./userPassword";
import { UserTelephone } from "./userTelephone";
import { UserTaxPayerNumber } from "./userTaxPayerNumber";
import { Role } from "./role";

interface UserProps {
    name: UserName;
    email: UserEmail;
    password: UserPassword;
    telephone: UserTelephone;
    taxPayerNumber: UserTaxPayerNumber
    role?: Role;
    active?: boolean;
}

export class User extends AggregateRoot<UserProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get userId(): UserId {
        return new UserId(this.userId.toValue());
    }

    get name(): UserName {
        return this.props.name
    }

    get email(): UserEmail {
        return this.props.email;
    }

    get password(): UserPassword {
        return this.props.password;
    }

    get telephone(): UserTelephone {
        return this.props.telephone;
    }

    get taxPayerNumber(): UserTaxPayerNumber {
        return this.props.taxPayerNumber;
    }

    get role(): Role {
        return this.props.role;
    }

    get active(): boolean {
        return this.props.active;
    }

    set name(newName: UserName) {
        this.props.name = newName;
    }

    set telephone(newTelephone: UserTelephone) {
        this.props.telephone = newTelephone;
    }

    set taxPayerNumber(newTaxPayerNumber: UserTaxPayerNumber) {
        this.props.taxPayerNumber = newTaxPayerNumber;
    }

    private constructor(props: UserProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
        if(props.active != undefined) {
            props.active = props.active;
        } else if (props.taxPayerNumber) {
            props.role = Role.User;
            props.active = false;
        } else {
            props.active = true;
        }

        const guardedProps = [
            { argument: props.name, argumentName: 'Name' },
            { argument: props.email, argumentName: 'Email' },
            { argument: props.password, argumentName: 'Password' },
            { argument: props.telephone, argumentName: 'Telephone' },
            { argument: props.role, argumentName: 'Role' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<User>(guardResult.message)
        }
        else {
            const user = new User({
                ...props,
            }, id);

            return Result.ok<User>(user);
        }
    }

    public toogleActivation() {
        this.props.active = !this.props.active;
    }
}