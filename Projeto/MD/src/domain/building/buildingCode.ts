import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

interface CodeProps {
    code: string;
}

export class BuildingCode extends UniqueEntityID {

    private static readonly MAX_CHARACTERS: number = 5;

    private constructor(props: CodeProps) {
        super(props.code);
    }

    get code(): string {
        return this.code;
    }

    public static create(code: string): Result<BuildingCode> {
        const guardResult = Guard.stringLengthLessEqualsThan(code, this.MAX_CHARACTERS, 'The building code');
        if (!guardResult.succeeded) {
            return Result.fail<BuildingCode>(guardResult.message);
        } else {
            return Result.ok<BuildingCode>(new BuildingCode({ code: code }));
        }
    }
}