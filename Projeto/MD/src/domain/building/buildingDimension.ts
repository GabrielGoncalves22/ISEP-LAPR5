import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface BuildingDimensionProps {
    numCells: number;
}

export class BuildingDimension extends ValueObject<BuildingDimensionProps> {
    get numCells(): number {
        return this.props.numCells;
    }

    private constructor(props: BuildingDimensionProps) {
        super(props);
    }

    public static create(numCells: number): Result<BuildingDimension> {
        const guardResult = Guard.isGreaterThan(numCells, 0, 'The dimension of the building');

        if (!guardResult.succeeded) {
            return Result.fail<BuildingDimension>(guardResult.message);
        } else {
            return Result.ok<BuildingDimension>(new BuildingDimension({ numCells: numCells }));
        }
    }

    public toNumber(): number {
        return this.numCells;
    }
}
