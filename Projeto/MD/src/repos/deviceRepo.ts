import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { IDevicePersistence } from '../dataschema/IDevicePersistence';

import IDeviceRepo from "../services/IRepos/IDeviceRepo";
import { DeviceMap } from "../mappers/DeviceMap";
import { Device } from '../domain/device/device';
import { DeviceCode } from '../domain/device/deviceCode';

@Service()
export default class DeviceRepo implements IDeviceRepo {
    private models: any;

    constructor(
        @Inject('deviceSchema') private deviceSchema: Model<IDevicePersistence & Document>,
    ) { }

    public async exists(device: Device): Promise<boolean> {
        const idX = device.code instanceof DeviceCode ? (<DeviceCode>device.code) : device.code;

        const query = { code: idX };
        const deviceDocument = await this.deviceSchema.findOne(query as FilterQuery<IDevicePersistence & Document>);

        return !!deviceDocument === true;
    }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async save(device: Device): Promise<Device> {
        const query = { code: device.code.toString() };
        const deviceDocument = await this.deviceSchema.findOne(query);

        try {
            if (deviceDocument === null) {
                const rawDevice: any = DeviceMap.toPersistence(device);

                const deviceCreated = await this.deviceSchema.create(rawDevice);
                return DeviceMap.toDomain(deviceCreated);

            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    public async update(device: Device): Promise<Device> {
        const query = { code: device.code.toString() };
        const deviceDocument = await this.deviceSchema.findOne(query);

        try {
            if (deviceDocument === null) {
                return null;
            } else {
                deviceDocument.status = device.status.toString();

                await deviceDocument.save();

                return device;
            }
        } catch (err) {
            throw err;
        }
    }
    
    public async findByCode(deviceCode: DeviceCode | string): Promise<Device> {
        const query = { code: deviceCode.toString() };
        const deviceRecord = await this.deviceSchema.findOne(query).lean();

        if (deviceRecord != null) {
            return DeviceMap.toDomain(deviceRecord);
        } else {
            return null;
        }
    }

    public async findAll(): Promise<Device[]> {
        const deviceRecords = await this.deviceSchema.find({}).lean();

        if (deviceRecords != null) {
            const devides = deviceRecords.map((buildingRecord) => DeviceMap.toDomain(buildingRecord));

            return devides;
        }
        return null;
    }
}