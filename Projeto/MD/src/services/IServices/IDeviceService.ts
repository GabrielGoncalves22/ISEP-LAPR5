import { Result } from "../../core/logic/Result";
import IDeviceDTO from "../../dto/IDeviceDTO";

export default interface IDeviceService {
    createDevice(deviceDTO: IDeviceDTO): Promise<Result<IDeviceDTO>>;
    updateStateDevice(deviceCode: string): Promise<Result<IDeviceDTO>>;
    getAllDevices(): Promise<Result<IDeviceDTO[]>>;
}