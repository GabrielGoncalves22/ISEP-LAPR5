import { Model, Document } from "mongoose";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Mapper } from "../core/infra/Mapper";
import { Device } from "../domain/device/device";
import IDeviceDTO from "../dto/IDeviceDTO";
import { IDevicePersistence } from "../dataschema/IDevicePersistence";

export class DeviceMap extends Mapper<Device> {

    public static toDTO(device: Device): IDeviceDTO {
        return {
            code: device.code.toString(),
            description: device.description ? device.description.toString() : '',
            type: device.type.id ? device.type.id.toString() : device.type.toString(),
            serialNumber: device.serialNumber.toString(),
            nickname: device.nickname.toString(),
            status: device.status.toString()
        } as IDeviceDTO;
    }

    public static toDomain(device: any | Model<IDevicePersistence & Document>): Device {
        const deviceOrError = Device.create(
            device,
            new UniqueEntityID(device.id)
        );

        deviceOrError.isFailure ? console.log(deviceOrError.error) : '';

        return deviceOrError.isSuccess ? deviceOrError.getValue() : null;
    }

    public static toPersistence(device: Device): any {
        return {
            code: device.code.toString(),
            description: device.description.toString(),
            type: device.type.id.toString(),
            serialNumber: device.serialNumber.toString(),
            nickname: device.nickname.toString(),
            status: device.status.toString()
        }
    }

}