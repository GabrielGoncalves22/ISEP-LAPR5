import { expect } from 'chai';

import { UniqueEntityID } from '../../../../src/core/domain/UniqueEntityID';
import { Device } from '../../../../src/domain/device/device';
import { DeviceCode } from '../../../../src/domain/device/deviceCode';
import { DeviceSerialNumber } from '../../../../src/domain/device/deviceSerialNumber';
import { DeviceNickname } from '../../../../src/domain/device/deviceNickname';
import { DeviceStatus } from '../../../../src/domain/device/deviceStatus';
import { Description } from '../../../../src/domain/device/description';
import { DeviceType } from '../../../../src/domain/device/deviceType';
import { Type } from '../../../../src/domain/device/type';
import { DeviceTypeBrand } from '../../../../src/domain/device/deviceTypeBrand';
import { DeviceTypeModel } from '../../../../src/domain/device/deviceTypeModel';
import { TaskType } from '../../../../src/domain/task/taskType';

describe('device entity', () => {
    it('can create a valid device object', () => {
        const deviceProps = {
            code: DeviceCode.create('Picker-0001').getValue(),
            description: Description.create('Device description').getValue(),
            type: DeviceType.create({
                type: Type.create('Robot').getValue(),
                brand: DeviceTypeBrand.create('Xiamoi').getValue(),
                model: DeviceTypeModel.create('Vaccuum').getValue(),
                taskTypes: [TaskType.Surveillance, TaskType.Transport],
            }).getValue(),
            serialNumber: DeviceSerialNumber.create('456789').getValue(),
            nickname: DeviceNickname.create('Jason').getValue(),
            status: DeviceStatus.Active
        };

        const deviceResult = Device.create(deviceProps, new UniqueEntityID());

        expect(deviceResult.isSuccess).to.be.true;

        const device = deviceResult.getValue();
        expect(device.code).to.deep.equal(DeviceCode.create('Picker-0001').getValue());
        expect(device.description).to.deep.equal(Description.create('Device description').getValue());
        expect(device.type.props).to.deep.equal({
            type: Type.create('Robot').getValue(),
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: [TaskType.Surveillance, TaskType.Transport]
        });
        expect(device.serialNumber).to.deep.equal(DeviceSerialNumber.create('456789').getValue());
        expect(device.nickname).to.deep.equal(DeviceNickname.create('Jason').getValue());
        expect(device.status).to.equal(DeviceStatus.Active);
    });

    it('should fail to create a device object without a null code', () => {
        const deviceProps = {
            code: null as any,
            description: Description.create('Device description').getValue(),
            type: DeviceType.create({
                type: Type.create('Robot').getValue(),
                brand: DeviceTypeBrand.create('Xiamoi').getValue(),
                model: DeviceTypeModel.create('Vaccuum').getValue(),
                taskTypes: [TaskType.Surveillance, TaskType.Transport],
            }).getValue(),
            serialNumber: DeviceSerialNumber.create('456789').getValue(),
            nickname: DeviceNickname.create('Jason').getValue(),
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('Code is null or undefined.');
    });

    it('should fail to create a device object without a undefined code', () => {
        const deviceProps = {
            code: undefined as any,
            description: Description.create('Device description').getValue(),
            type: DeviceType.create({
                type: Type.create('Robot').getValue(),
                brand: DeviceTypeBrand.create('Xiamoi').getValue(),
                model: DeviceTypeModel.create('Vaccuum').getValue(),
                taskTypes: [TaskType.Surveillance, TaskType.Transport],
            }).getValue(),
            serialNumber: DeviceSerialNumber.create('456789').getValue(),
            nickname: DeviceNickname.create('Jason').getValue(),
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('Code is null or undefined.');
    });

    it('should fail to create a Device object without a null type', () => {
        const deviceProps = {
            code: DeviceCode.create('ABC123').getValue(),
            description: Description.create('Device description').getValue(),
            type: null as any,
            serialNumber: DeviceSerialNumber.create('456789').getValue(),
            nickname: DeviceNickname.create('Jason').getValue(),
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('Type is null or undefined.');
    });

    it('should fail to create a Device object without a undefined type', () => {
        const deviceProps = {
            code: DeviceCode.create('ABC123').getValue(),
            description: Description.create('Device description').getValue(),
            type: undefined as any,
            serialNumber: DeviceSerialNumber.create('456789').getValue(),
            nickname: DeviceNickname.create('Jason').getValue(),
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('Type is null or undefined.');
    });

    it('should fail to create a Device object without a null serialNumber', () => {
        const deviceProps = {
            code: DeviceCode.create('ABC123').getValue(),
            description: Description.create('Device description').getValue(),
            type: DeviceType.create({
                type: Type.create('Robot').getValue(),
                brand: DeviceTypeBrand.create('Xiamoi').getValue(),
                model: DeviceTypeModel.create('Vaccuum').getValue(),
                taskTypes: [TaskType.Surveillance, TaskType.Transport],
            }).getValue(),
            serialNumber: null as any,
            nickname: DeviceNickname.create('Jason').getValue(),
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('SerialNumber is null or undefined.');
    });

    it('should fail to create a Device object without a undefined serialNumber', () => {
        const deviceProps = {
            code: DeviceCode.create('ABC123').getValue(),
            description: Description.create('Device description').getValue(),
            type: DeviceType.create({
                type: Type.create('Robot').getValue(),
                brand: DeviceTypeBrand.create('Xiamoi').getValue(),
                model: DeviceTypeModel.create('Vaccuum').getValue(),
                taskTypes: [TaskType.Surveillance, TaskType.Transport],
            }).getValue(),
            serialNumber: undefined as any,
            nickname: DeviceNickname.create('Jason').getValue(),
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('SerialNumber is null or undefined.');
    });

    it('should fail to create a Device object without a null nickname', () => {
        const deviceProps = {
            code: DeviceCode.create('ABC123').getValue(),
            description: Description.create('Device description').getValue(),
            type: DeviceType.create({
                type: Type.create('Robot').getValue(),
                brand: DeviceTypeBrand.create('Xiamoi').getValue(),
                model: DeviceTypeModel.create('Vaccuum').getValue(),
                taskTypes: [TaskType.Surveillance, TaskType.Transport],
            }).getValue(),
            serialNumber: DeviceSerialNumber.create('456789').getValue(),
            nickname: null as any,
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('Nickname is null or undefined.');
    });

    it('should fail to create a Device object without a null nickname', () => {
        const deviceProps = {
            code: DeviceCode.create('ABC123').getValue(),
            description: Description.create('Device description').getValue(),
            type: DeviceType.create({
                type: Type.create('Robot').getValue(),
                brand: DeviceTypeBrand.create('Xiamoi').getValue(),
                model: DeviceTypeModel.create('Vaccuum').getValue(),
                taskTypes: [TaskType.Surveillance, TaskType.Transport],
            }).getValue(),
            serialNumber: DeviceSerialNumber.create('456789').getValue(),
            nickname: undefined as any,
            status: DeviceStatus.Active,
        };

        const device = Device.create(deviceProps, new UniqueEntityID());

        expect(device.isFailure).to.be.true;
        expect(device.error).to.equal('Nickname is null or undefined.');
    });
});
