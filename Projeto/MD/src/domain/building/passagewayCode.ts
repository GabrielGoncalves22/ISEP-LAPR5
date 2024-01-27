import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface CodeProps {
    code: string;
}

export class PassagewayCode extends UniqueEntityID {

    private static readonly MAX_CHARACTERS: number = 5;

    private constructor(props: CodeProps) {
        super(props.code);
    }

    get code(): string {
        return this.code;
    }

    public static create(buildingCode1: string, floorNumber1: number, buildingCode2: string, floorNumber2: number): Result<PassagewayCode> {
        const guardedProps = [
            { argument: buildingCode1, argumentName: 'Building1' },
            { argument: floorNumber1, argumentName: 'Floor1' },
            { argument: buildingCode2, argumentName: 'Building2' },
            { argument: floorNumber2, argumentName: 'Floor2' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<PassagewayCode>(guardResult.message);
        } else {
            return Result.ok<PassagewayCode>(new PassagewayCode({ code: buildingCode1 + floorNumber1 + '-' + buildingCode2 + floorNumber2 }));
        }
    }
}