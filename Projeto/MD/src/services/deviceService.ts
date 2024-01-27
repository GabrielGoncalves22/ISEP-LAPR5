import { Inject, Service } from "typedi";
import IDeviceService from "./IServices/IDeviceService";
import IDeviceRepo from "./IRepos/IDeviceRepo";
import config from "../../config";
import { Result } from "../core/logic/Result";
import IDeviceDTO from "../dto/IDeviceDTO";
import { DeviceCode } from "../domain/device/deviceCode";
import { Description } from "../domain/device/description";
import { DeviceNickname } from "../domain/device/deviceNickname"
import { DeviceType } from "../domain/device/deviceType";
import { DeviceSerialNumber } from "../domain/device/deviceSerialNumber";
import { Device } from "../domain/device/device";
import { DeviceStatus } from "../domain/device/deviceStatus";
import { DeviceMap } from "../mappers/DeviceMap";
import IDeviceTypeRepo from "./IRepos/IDeviceTypeRepo";

@Service()
export default class DeviceService implements IDeviceService {

    constructor(
        @Inject(config.repos.device.name) private deviceRepo: IDeviceRepo,
        @Inject(config.repos.deviceType.name) private deviceTypeRepo: IDeviceTypeRepo
    ) { }

    public async createDevice(deviceDTO: IDeviceDTO): Promise<Result<IDeviceDTO>> {
        try {
            const codeOrError = await DeviceCode.create(deviceDTO.code);
            if (codeOrError.isFailure) {
                return Result.fail<IDeviceDTO>(codeOrError.errorValue());
            }

            const descriptionOrError = await Description.create(deviceDTO.description);
            if (descriptionOrError.isFailure) {
                return Result.fail<IDeviceDTO>(descriptionOrError.errorValue());
            }

            const serialNumberOrError = await DeviceSerialNumber.create(deviceDTO.serialNumber);
            if (serialNumberOrError.isFailure) {
                return Result.fail<IDeviceDTO>(serialNumberOrError.errorValue());
            }

            const nicknameOrError = await DeviceNickname.create(deviceDTO.nickname);
            if (nicknameOrError.isFailure) {
                return Result.fail<IDeviceDTO>(nicknameOrError.errorValue());
            }

            const typeOrError = await this.getType(deviceDTO.type);
            if (typeOrError.isFailure) {
                return Result.fail<IDeviceDTO>(typeOrError.errorValue());
            }

            const deviceOrError = Device.create({
                code: codeOrError.getValue(),
                description: descriptionOrError.getValue(),
                type: typeOrError.getValue(),
                serialNumber: serialNumberOrError.getValue(),
                nickname: nicknameOrError.getValue(),
                status: Object.values(DeviceStatus)[DeviceStatus.Active] as DeviceStatus
            });

            if (deviceOrError.isFailure) {
                throw Result.fail<IDeviceDTO>(deviceOrError.errorValue());
            }

            const deviceResult = deviceOrError.getValue();

            if ((await this.deviceRepo.save(deviceResult)) === null) {
                return Result.fail<IDeviceDTO>("The device already exists!");
            }
            

            const devicDTOResult = DeviceMap.toDTO(deviceResult) as IDeviceDTO;
            return Result.ok<IDeviceDTO>(devicDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async updateStateDevice(deviceCode: string): Promise<Result<IDeviceDTO>> {
        try {
            const deviceExists = await this.getDevice(deviceCode);

            if (deviceExists.isFailure) {
                return Result.fail<IDeviceDTO>(deviceExists.errorValue());
            }

            const deviceResult = deviceExists.getValue();
            deviceResult.status = deviceResult.nextStatus();

            if ((await this.deviceRepo.update(deviceResult)) === null) {
                return Result.fail<IDeviceDTO>("Something went wrong!");
            }

            const buildingDTOResult = DeviceMap.toDTO(deviceResult) as IDeviceDTO;
            return Result.ok<IDeviceDTO>(buildingDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async getAllDevices(): Promise<Result<IDeviceDTO[]>> {
        const devices = await this.deviceRepo.findAll();
        if (devices) {
            const deviceDTOs = devices.map((device) => DeviceMap.toDTO(device));
            return Result.ok<IDeviceDTO[]>(deviceDTOs);
        }

        return Result.fail<IDeviceDTO[]>("Could not find any devices");
    }

    private async getType(typeId: string): Promise<Result<DeviceType>> {
        const type = await this.deviceTypeRepo.findByType(typeId);
        const found = !!type

        if (found)
            return Result.ok<DeviceType>(type);
        return Result.fail<DeviceType>("Couldn't find device type by id " + typeId + ".");
    }

    private async getDevice(deviceCode: string): Promise<Result<Device>> {
        const device = await this.deviceRepo.findByCode(deviceCode);

        if (device) {
            return Result.ok<Device>(device);
        } else {
            return Result.fail<Device>("Couldn't find device by code " + deviceCode + ".");
        }
    }
}