import { Repo } from "../../core/infra/Repo";
import { Device } from "../../domain/device/device";
import { DeviceCode } from "../../domain/device/deviceCode";

export default interface IDeviceRepo extends Repo<Device> {
    save(device: Device): Promise<Device>;
    update(device: Device): Promise<Device>;
    findByCode(deviceCode: DeviceCode | string): Promise<Device>;
    findAll(): Promise<Device[]>;
}