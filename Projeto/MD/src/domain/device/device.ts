import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { Description } from "./description";
import { DeviceCode } from "./deviceCode";
import { DeviceType } from "./deviceType";
import { DeviceNickname } from "./deviceNickname";
import { DeviceSerialNumber } from "./deviceSerialNumber";
import { DeviceStatus } from "./deviceStatus";

interface DeviceProps {
    code: DeviceCode;
    description: Description;
    type: DeviceType;
    serialNumber: DeviceSerialNumber;
    nickname: DeviceNickname;
    status: DeviceStatus;
}

export class Device extends AggregateRoot<DeviceProps> {

    get code(): DeviceCode {
        return this.props.code;
    }

    get description(): Description {
        return this.props.description;
    }

    get type(): DeviceType {
        return this.props.type;
    }

    get serialNumber(): DeviceSerialNumber {
        return this.props.serialNumber;
    }

    get nickname(): DeviceNickname {
        return this.props.nickname;
    }

    get status(): DeviceStatus {
        return this.props.status;
    }

    set status(newStatus: DeviceStatus) {
        this.props.status = newStatus;
    }

    nextStatus(): DeviceStatus {
        if (this.props.status === Object.values(DeviceStatus)[DeviceStatus.Active]) {
            return Object.values(DeviceStatus)[DeviceStatus.Inactive] as DeviceStatus
        } else {
            return Object.values(DeviceStatus)[DeviceStatus.Active] as DeviceStatus
        }
    }

    private constructor(props: DeviceProps, id: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: DeviceProps, id?: UniqueEntityID): Result<Device> {

        const guardedProps = [
            { argument: props.code, argumentName: 'Code' },
            { argument: props.type, argumentName: 'Type' },
            { argument: props.serialNumber, argumentName: 'SerialNumber' },
            { argument: props.nickname, argumentName: 'Nickname' }
        ];

        const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

        if (!guardResult.succeeded) {
            return Result.fail<Device>(guardResult.message)
        }
        else {
            const device = new Device({
                ...props
            }, id);

            return Result.ok<Device>(device);
        }
    }
}