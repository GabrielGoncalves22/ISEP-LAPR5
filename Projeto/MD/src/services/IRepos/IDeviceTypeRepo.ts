import { Repo } from "../../core/infra/Repo";
import { DeviceType } from "../../domain/device/deviceType";
import { DeviceTypeId } from "../../domain/device/deviceTypeId";
import { Type } from "../../domain/device/type";

export default interface IDeviceTypeRepo extends Repo<DeviceType> {
	save(deviceType: DeviceType): Promise<DeviceType>;
	update(deviceType: DeviceType): Promise<DeviceType>;
	findByDomainId(deviceTypeId: DeviceTypeId | string): Promise<DeviceType>;
	findByType(type: Type | string): Promise<DeviceType>
}