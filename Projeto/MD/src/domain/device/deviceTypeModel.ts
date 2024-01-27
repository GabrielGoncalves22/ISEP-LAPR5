import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface DeviceTypeModelProps {
    model: string;
}

export class DeviceTypeModel extends ValueObject<DeviceTypeModelProps> {

    private static readonly MAX_CHARACTERS: number = 50;

    get model(): string {
        return this.props.model;
    }

    private constructor(props: DeviceTypeModelProps) {
        super(props);
    }

    public static create(model: string): Result<DeviceTypeModel> {
        const guardResult = Guard.stringLengthLessEqualsThan(model, this.MAX_CHARACTERS, 'The model');

        if (!guardResult.succeeded) {
            return Result.fail<DeviceTypeModel>(guardResult.message);
        } else {
            return Result.ok<DeviceTypeModel>(new DeviceTypeModel({ model: model }))
        }
    }

    public toString(): string {
        return this.model;
    }
}