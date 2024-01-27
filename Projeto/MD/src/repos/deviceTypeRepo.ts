import { Service, Inject } from 'typedi';

import IDeviceTypeRepo from "../services/IRepos/IDeviceTypeRepo";
import { DeviceType } from "../domain/device/deviceType";
import { DeviceTypeId } from "../domain/device/deviceTypeId";
import { DeviceTypeMap } from "../mappers/DeviceTypeMap";
import { Type } from '../domain/device/type';

import { Document, FilterQuery, Model } from 'mongoose';
import { IDeviceTypePersistence } from '../dataschema/IDeviceTypePersistence';

@Service()
export default class DeviceTypeRepo implements IDeviceTypeRepo {
    private models: any;

    constructor(
        @Inject('deviceTypeSchema') private deviceTypeSchema: Model<IDeviceTypePersistence & Document>,
    ) { }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async exists(deviceType: DeviceType): Promise<boolean> {

        const idX = deviceType.id instanceof DeviceTypeId ? (<DeviceTypeId>deviceType.id).toValue() : deviceType.id;

        const query = { domainId: idX };
        const deviceTypeDocument = await this.deviceTypeSchema.findOne(query as FilterQuery<IDeviceTypePersistence & Document>);

        return !!deviceTypeDocument === true;
    }

    public async save(deviceType: DeviceType): Promise<DeviceType> {
        const query = { domainId: deviceType.id.toString() };

        const deviceTypeDocument = await this.deviceTypeSchema.findOne(query);

        try {
            if (deviceTypeDocument === null) {
                const rawDeviceType: any = DeviceTypeMap.toPersistence(deviceType);

                const deviceTypeCreated = await this.deviceTypeSchema.create(rawDeviceType);

                return DeviceTypeMap.toDomain(deviceTypeCreated);
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    public async update(deviceType: DeviceType): Promise<DeviceType> {
        const query = { domainId: deviceType.id.toString() };

        const deviceTypeDocument = await this.deviceTypeSchema.findOne(query);

        try {
            if (deviceTypeDocument === null) {
                return null;
            } else {
                deviceTypeDocument.type = deviceType.type.toString();
                deviceTypeDocument.brand = deviceType.brand.toString();
                deviceTypeDocument.model = deviceType.model.toString();
                deviceTypeDocument.taskTypes = deviceType.taskTypes.map(taskType => taskType.toString());

                await deviceTypeDocument.save();

                return deviceType;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findByDomainId(deviceTypeId: DeviceTypeId | string): Promise<DeviceType> {
        const query = { domainId: deviceTypeId };
        const deviceTypeRecord = await this.deviceTypeSchema.findOne(query as FilterQuery<IDeviceTypePersistence & Document>);

        if (deviceTypeRecord != null) {
            return DeviceTypeMap.toDomain(deviceTypeRecord);
        } else {
            return null;
        }
    }

    public async findByType(type: Type | string): Promise<DeviceType> {
        const query = { type: type };
        const deviceTypeRecord = await this.deviceTypeSchema.findOne(query as FilterQuery<IDeviceTypePersistence & Document>);

        if (deviceTypeRecord != null) {
            return DeviceTypeMap.toDomain(deviceTypeRecord);
        } else {
            return null;
        }
    }
}