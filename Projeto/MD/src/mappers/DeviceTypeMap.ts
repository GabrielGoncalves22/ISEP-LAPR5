import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IDeviceTypePersistence } from '../dataschema/IDeviceTypePersistence';

import IDeviceTypeDTO from "../dto/IDeviceTypeDTO";
import { DeviceType } from "../domain/device/deviceType";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class DeviceTypeMap extends Mapper<DeviceType> {

    public static toDTO(deviceType: DeviceType): IDeviceTypeDTO {
        return {
            id: deviceType.id.toString(),
            type: deviceType.type.toString(),
            brand: deviceType.brand.toString(),
            model: deviceType.model.toString(),
            taskTypes: deviceType.taskTypes.map(taskType => taskType.toString())
        } as IDeviceTypeDTO;
    }

    public static toDomain(deviceType: any | Model<IDeviceTypePersistence & Document>): DeviceType {
        const deviceTypeOrError = DeviceType.create(
            deviceType,
            new UniqueEntityID(deviceType.domainId)
        );

        deviceTypeOrError.isFailure ? console.log(deviceTypeOrError.error) : '';

        return deviceTypeOrError.isSuccess ? deviceTypeOrError.getValue() : null;
    }

    public static toPersistence(deviceType: DeviceType): any {
        return {
            domainId: deviceType.id.toString(),
            type: deviceType.type.toString(),
            brand: deviceType.brand.toString(),
            model: deviceType.model.toString(),
            taskTypes: deviceType.taskTypes.map(taskType => taskType.toString())
        }
    }
}