import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface BuildingNameProps {
    name: string;
}

export class BuildingName extends ValueObject<BuildingNameProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get name(): string {
        return this.props.name;
    }

    private constructor(props: BuildingNameProps) {
        super(props);
    }

    public static create(buildingName: string): Result<BuildingName> {
        const guardResult = Guard.stringLengthLessEqualsThan(buildingName || '', this.MAX_CHARACTERS, 'The name of the building');
        if (!guardResult.succeeded) {
            return Result.fail<BuildingName>(guardResult.message);
        } else {
            return Result.ok<BuildingName>(new BuildingName({ name: buildingName }));
        }
    }

    public toString(): string {
        return this.name;
    }
}