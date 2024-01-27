import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

import { Result } from "../../core/logic/Result";
import { DeviceTypeId } from "./deviceTypeId";

import { Type } from "./type";
import { DeviceTypeBrand } from "./deviceTypeBrand";
import { DeviceTypeModel } from "./deviceTypeModel";
import { TaskType } from "../task/taskType";
import { Guard } from "../../core/logic/Guard";

interface DeviceTypeProps {
    type: Type;
    brand: DeviceTypeBrand;
    model: DeviceTypeModel;
    taskTypes: TaskType[];
}

export class DeviceType extends AggregateRoot<DeviceTypeProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get devicetypeId(): DeviceTypeId {
        return new DeviceTypeId(this.devicetypeId.toValue());
    }

    get type(): Type {
        return this.props.type;
    }

    get brand(): DeviceTypeBrand {
        return this.props.brand;
    }

    get model(): DeviceTypeModel {
        return this.props.model;
    }

    get taskTypes(): TaskType[] {
        return this.props.taskTypes;
    }

    private constructor(props: DeviceTypeProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: DeviceTypeProps, id?: UniqueEntityID): Result<DeviceType> {

        const guardedProps = [
            { argument: props.type, argumentName: 'Type' },
            { argument: props.brand, argumentName: 'Brand' },
            { argument: props.model, argumentName: 'Model' },
            { argument: props.taskTypes, argumentName: 'TaskTypes' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<DeviceType>(guardResult.message)
        }
        else {
            const deviceType = new DeviceType({
                ...props
            }, id);

            return Result.ok<DeviceType>(deviceType);
        }
    }
}
