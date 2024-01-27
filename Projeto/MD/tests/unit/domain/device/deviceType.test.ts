import { expect } from 'chai';

import { UniqueEntityID } from '../../../../src/core/domain/UniqueEntityID';
import { DeviceType } from '../../../../src/domain/device/deviceType';
import { Type } from '../../../../src/domain/device/type';
import { DeviceTypeBrand } from '../../../../src/domain/device/deviceTypeBrand';
import { DeviceTypeModel } from '../../../../src/domain/device/deviceTypeModel';
import { TaskType } from '../../../../src/domain/task/taskType';

describe('deviceType entity', () => {
    it('can create a valid device type object', () => {
        const deviceTypeProps = {
            type: Type.create('Robot').getValue(),
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: [TaskType.Surveillance, TaskType.Transport],
        };

        const deviceTypeResult = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceTypeResult.isSuccess).to.be.true;

        const deviceType = deviceTypeResult.getValue();
        expect(deviceType.type).to.deep.equal(Type.create('Robot').getValue());
        expect(deviceType.brand).to.deep.equal(DeviceTypeBrand.create('Xiamoi').getValue());
        expect(deviceType.model).to.deep.equal(DeviceTypeModel.create('Vaccuum').getValue());
        expect(deviceType.taskTypes).to.deep.equal([TaskType.Surveillance, TaskType.Transport]);
    });

    it('should fail to create a device type object without a null type', () => {
        const deviceTypeProps = {
            type: null as any,
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: [TaskType.Surveillance, TaskType.Transport],
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('Type is null or undefined.');
    });

    it('should fail to create a device type object without a undefined type', () => {
        const deviceTypeProps = {
            type: undefined as any,
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: [TaskType.Surveillance, TaskType.Transport],
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('Type is null or undefined.');
    });

    it('should fail to create a DeviceType object without a null brand', () => {
        const deviceTypeProps = {
            type: Type.create('Robot').getValue(),
            brand: null as any,
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: [TaskType.Surveillance, TaskType.Transport],
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('Brand is null or undefined.');
    });

    it('should fail to create a DeviceType object without a undefined brand', () => {
        const deviceTypeProps = {
            type: Type.create('Robot').getValue(),
            brand: undefined as any,
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: [TaskType.Surveillance, TaskType.Transport],
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('Brand is null or undefined.');
    });

    it('should fail to create a DeviceType object without a null model', () => {
        const deviceTypeProps = {
            type: Type.create('Robot').getValue(),
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: null as any,
            taskTypes: [TaskType.Surveillance, TaskType.Transport],
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('Model is null or undefined.');
    });

    it('should fail to create a DeviceType object without a undefined model', () => {
        const deviceTypeProps = {
            type: Type.create('Robot').getValue(),
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: undefined as any,
            taskTypes: [TaskType.Surveillance, TaskType.Transport],
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('Model is null or undefined.');
    });

    it('should fail to create a DeviceType object without a null taskTypes', () => {
        const deviceTypeProps = {
            type: Type.create('Robot').getValue(),
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: null as any,
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('TaskTypes is null or undefined.');
    });

    it('should fail to create a DeviceType object without a undefined taskTypes', () => {
        const deviceTypeProps = {
            type: Type.create('Robot').getValue(),
            brand: DeviceTypeBrand.create('Xiamoi').getValue(),
            model: DeviceTypeModel.create('Vaccuum').getValue(),
            taskTypes: undefined as any,
        };

        const deviceType = DeviceType.create(deviceTypeProps, new UniqueEntityID());

        expect(deviceType.isFailure).to.be.true;
        expect(deviceType.error).to.equal('TaskTypes is null or undefined.');
    });
});
