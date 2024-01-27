import { expect } from 'chai';

import * as sinon from 'sinon';
import IDeviceRepo from "../../../src/services/IRepos/IDeviceRepo";
import DeviceService from "../../../src/services/deviceService";
import { Container } from 'typedi';
import { Device } from '../../../src/domain/device/device';
import { DeviceCode } from '../../../src/domain/device/deviceCode';
import { Description } from '../../../src/domain/device/description';
import { DeviceType } from '../../../src/domain/device/deviceType';
import { Type } from '../../../src/domain/device/type';
import { DeviceTypeModel } from '../../../src/domain/device/deviceTypeModel';
import { DeviceTypeBrand } from '../../../src/domain/device/deviceTypeBrand';
import { DeviceSerialNumber } from '../../../src/domain/device/deviceSerialNumber';
import { DeviceNickname } from '../../../src/domain/device/deviceNickname';
import { DeviceStatus } from '../../../src/domain/device/deviceStatus';
import IDeviceDTO from '../../../src/dto/IDeviceDTO';
import IDeviceTypeRepo from '../../../src/services/IRepos/IDeviceTypeRepo';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';

describe('device service', function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function (done) {
        this.timeout(5000);

        Container.reset();
        let deviceSchemaInstance = require("../../../src/persistence/schemas/deviceSchema").default;
        Container.set("deviceSchema", deviceSchemaInstance);

        let deviceTypeSchemaInstance = require("../../../src/persistence/schemas/deviceTypeSchema").default;
        Container.set("deviceTypeSchema", deviceTypeSchemaInstance);

        let deviceRepoClass = require("../../../src/repos/deviceRepo").default;
        let deviceRepoInstance = Container.get(deviceRepoClass);
        Container.set("DeviceRepo", deviceRepoInstance);

        let deviceTypeRepoClass = require("../../../src/repos/deviceTypeRepo").default;
        let deviceTypeRepoInstance = Container.get(deviceTypeRepoClass);
        Container.set("DeviceTypeRepo", deviceTypeRepoInstance);

        let deviceServiceClass = require("../../../src/services/deviceService").default;
        let deviceServiceInstance = Container.get(deviceServiceClass);
        Container.set("DeviceService", deviceServiceInstance);

        done();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('deviceService unit test using deviceRepo stud for createDevice', async function () {
        //Arrange

        const type = DeviceType.create({
            type: Type.create("1").getValue(),
            brand: DeviceTypeBrand.create("brand1").getValue(),
            model: DeviceTypeModel.create("model1").getValue(),
            taskTypes: [],
        }, new UniqueEntityID("123")).getValue();

        const device = Device.create({
            "code": DeviceCode.create("1").getValue(),
            "description": Description.create("device desc 1").getValue(),
            "type": type,
            "serialNumber": DeviceSerialNumber.create("12345").getValue(),
            "nickname": DeviceNickname.create("deviceNick1").getValue(),
            "status": DeviceStatus.Active
        }).getValue();

        const deviceDTO: IDeviceDTO = {
            code: "1",
            description: "device desc 1",
            type: type.id.toString(),
            serialNumber: "12345",
            nickname: "deviceNick1",
            status: "Active"
        };

        let deviceRepoInstance = Container.get("DeviceRepo");
        let deviceTypeRepoInstance = Container.get("DeviceTypeRepo");

        sinon.stub(deviceTypeRepoInstance, "findByType").returns(type);

        sinon.stub(deviceRepoInstance, "save").returns(device);

        const deviceService = new DeviceService(deviceRepoInstance as IDeviceRepo, deviceTypeRepoInstance as IDeviceTypeRepo);

        const result = await deviceService.createDevice(deviceDTO);

        expect(result.getValue()).to.deep.equal({
            code: "1",
            description: "device desc 1",
            type: "123",
            serialNumber: "12345",
            nickname: "deviceNick1",
            status: "Active"
        });
    });

    it('deviceService unit test using deviceRepo stud for updateStateDevice', async function () {
        // Arrange
        const type = DeviceType.create({
            type: Type.create("1").getValue(),
            brand: DeviceTypeBrand.create("brand1").getValue(),
            model: DeviceTypeModel.create("model1").getValue(),
            taskTypes: [],
        }, new UniqueEntityID("123")).getValue();

        const device = Device.create({
            "code": DeviceCode.create("1").getValue(),
            "description": Description.create("device desc 1").getValue(),
            "type": type,
            "serialNumber": DeviceSerialNumber.create("12345").getValue(),
            "nickname": DeviceNickname.create("deviceNick1").getValue(),
            "status": DeviceStatus.Inactive
        }).getValue();

        let deviceRepoInstance = Container.get("DeviceRepo");
        let deviceTypeRepoInstance = Container.get("DeviceTypeRepo");

        sinon.stub(deviceRepoInstance, "findByCode").returns(device);
        sinon.stub(deviceRepoInstance, "update").returns(device);

        const deviceService = new DeviceService(deviceRepoInstance as IDeviceRepo, deviceTypeRepoInstance as IDeviceTypeRepo);

        const result = await deviceService.updateStateDevice("1");

        expect(result.getValue()).to.deep.equal({
            code: "1",
            description: "device desc 1",
            type: "123",
            serialNumber: "12345",
            nickname: "deviceNick1",
            status: "Active"
        });

    });

    it('deviceService unit test using deviceRepo stud for getAllDevices', async function () {
        // Arrange
        const type = DeviceType.create({
            type: Type.create("1").getValue(),
            brand: DeviceTypeBrand.create("brand1").getValue(),
            model: DeviceTypeModel.create("model1").getValue(),
            taskTypes: [],
        }, new UniqueEntityID("123")).getValue();

        const device = Device.create({
            "code": DeviceCode.create("1").getValue(),
            "description": Description.create("device desc 1").getValue(),
            "type": type,
            "serialNumber": DeviceSerialNumber.create("12345").getValue(),
            "nickname": DeviceNickname.create("deviceNick1").getValue(),
            "status": DeviceStatus.Active
        }).getValue();

        let deviceRepoInstance = Container.get("DeviceRepo");
        let deviceTypeRepoInstance = Container.get("DeviceTypeRepo");

        sinon.stub(deviceRepoInstance, "findAll").returns([device]);

        const deviceService = new DeviceService(deviceRepoInstance as IDeviceRepo, deviceTypeRepoInstance as IDeviceTypeRepo);

        const result = await deviceService.getAllDevices();

        expect(result.getValue()).to.deep.equal([{
            code: "1",
            description: "device desc 1",
            type: "123",
            serialNumber: "12345",
            nickname: "deviceNick1",
            status: DeviceStatus.Active.toString()
        }]);
    });

});