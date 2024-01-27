import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface UserTaxPayerNumberProps {
    taxPayerNumber: string;
}

export class UserTaxPayerNumber extends ValueObject<UserTaxPayerNumberProps> {

    get taxPayerNumber(): string {
        return this.props.taxPayerNumber;
    }

    private constructor(props: UserTaxPayerNumberProps) {
        super(props);
    }

    private static validateTaxPayerNumber(userTaxPayerNumber: string): boolean {
        const max = 9;

        // Verifica se é numérico e tem 9 números
        if (!userTaxPayerNumber.match(/^[0-9]+$/) || userTaxPayerNumber.length !== max) {
            return false;
        }

        // Calcula checkSum
        let checkSum = 0;
        for (let i = 0; i < max - 1; i++) {
            checkSum += parseInt(userTaxPayerNumber[i]) * (max - i);
        }

        // Se checkDigit for maior que 9, define-o como zero
        let checkDigit = 11 - (checkSum % 11);
        if (checkDigit > 9) {
            checkDigit = 0;
        }

        // Comparar checkDigit com o último número do tax payer number
        return checkDigit === parseInt(userTaxPayerNumber[max - 1]);
    }

    public static create(userTaxPayerNumber: string): Result<UserTaxPayerNumber> {
        const guardResult = Guard.againstNullOrUndefined(userTaxPayerNumber, 'TaxPayerNumber');

        if (!guardResult.succeeded) {
            return Result.fail<UserTaxPayerNumber>(guardResult.message);
        } else {

            if (!this.validateTaxPayerNumber(userTaxPayerNumber)) {
                return Result.fail<UserTaxPayerNumber>(`TaxPayerNumber is not valid`);
            } else {
                return Result.ok<UserTaxPayerNumber>(new UserTaxPayerNumber({ taxPayerNumber: userTaxPayerNumber }))
            }
        }
    }

    public toString(): string {
        return this.taxPayerNumber;
    }
}