import { Result } from "../../core/logic/Result";
import IDeviceTypeDTO from "../../dto/IDeviceTypeDTO";

export default interface IDeviceTypeService  {
    createDeviceType(deviceTypeDTO: IDeviceTypeDTO): Promise<Result<IDeviceTypeDTO>>;
}
