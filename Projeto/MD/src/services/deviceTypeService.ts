import { Service, Inject } from 'typedi';
import config from "../../config";
import IDeviceTypeDTO from '../dto/IDeviceTypeDTO';
import { DeviceType } from "../domain/device/deviceType";
import { Type } from "../domain/device/type";
import { DeviceTypeBrand } from "../domain/device/deviceTypeBrand";
import { DeviceTypeModel } from "../domain/device/deviceTypeModel";
import { TaskType } from "../domain/task/taskType";
import IDeviceTypeRepo from '../services/IRepos/IDeviceTypeRepo';
import IDeviceTypeService from './IServices/IDeviceTypeService';
import { Result } from "../core/logic/Result";
import { DeviceTypeMap } from "../mappers/DeviceTypeMap";

@Service()
export default class DeviceTypeService implements IDeviceTypeService {
    constructor(
        @Inject(config.repos.deviceType.name) private deviceTypeRepo: IDeviceTypeRepo
    ) { }

    public async createDeviceType(deviceTypeDTO: IDeviceTypeDTO): Promise<Result<IDeviceTypeDTO>> {
        try {
            const typeOrError = await Type.create(deviceTypeDTO.type);
            if (typeOrError.isFailure) {
                return Result.fail<IDeviceTypeDTO>(typeOrError.errorValue());
            } else {

                const deviceTypeExists = await this.deviceTypeExists(typeOrError.getValue());
                if (deviceTypeExists) {
                    return Result.fail<IDeviceTypeDTO>("The device type already exists!");
                }
            }

            const brandOrError = await DeviceTypeBrand.create(deviceTypeDTO.brand);
            if (brandOrError.isFailure) {
                return Result.fail<IDeviceTypeDTO>(brandOrError.errorValue());
            }

            const modelOrError = await DeviceTypeModel.create(deviceTypeDTO.model);
            if (modelOrError.isFailure) {
                return Result.fail<IDeviceTypeDTO>(modelOrError.errorValue());
            }

            const tasksTypeValues = deviceTypeDTO.taskTypes.map(taskTypeNumber => {
                const taskTypeValue = TaskType[taskTypeNumber];
                if (!taskTypeValue) {
                    throw new Error("Invalid task type.");
                }
                return taskTypeValue;
            });

            const deviceTypeOrError = await DeviceType.create({
                type: typeOrError.getValue(),
                brand: brandOrError.getValue(),
                model: modelOrError.getValue(),
                taskTypes: tasksTypeValues
            });

            if (deviceTypeOrError.isFailure) {
                return Result.fail<IDeviceTypeDTO>(deviceTypeOrError.errorValue());
            }

            const deviceTypeResult = deviceTypeOrError.getValue();

            await this.deviceTypeRepo.save(deviceTypeResult);

            const deviceTypeDTOResult = DeviceTypeMap.toDTO(deviceTypeResult) as IDeviceTypeDTO;
            return Result.ok<IDeviceTypeDTO>(deviceTypeDTOResult)
        } catch (e) {
            throw e;
        }
    }

    private async deviceTypeExists(type: Type | string): Promise<boolean> {
        const deviceType = await this.deviceTypeRepo.findByType(type);

        return deviceType ? true : false;
    }
}
