import { expect } from 'chai';

import * as sinon from 'sinon';
import { Container } from 'typedi';
import DeviceTypeService from "../../../src/services/deviceTypeService";
import { DeviceType } from '../../../src/domain/device/deviceType';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import { DeviceTypeBrand } from '../../../src/domain/device/deviceTypeBrand';
import { DeviceTypeModel } from '../../../src/domain/device/deviceTypeModel';
import { Type } from '../../../src/domain/device/type';
import IDeviceTypeRepo from '../../../src/services/IRepos/IDeviceTypeRepo';
import deviceService from '../../../src/services/deviceService';
import IDeviceTypeDTO from '../../../src/dto/IDeviceTypeDTO';

describe('deviceType service', function () {
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

    it ('deviceTypeService unit test using deviceRepo stud for createDeviceType', async function () {
        const type = DeviceType.create({
            type: Type.create("1").getValue(),
            brand: DeviceTypeBrand.create("brand1").getValue(),
            model: DeviceTypeModel.create("model1").getValue(),
            taskTypes: [],
        }, new UniqueEntityID("123")).getValue();

        const deviceTypeDTO: IDeviceTypeDTO = {
            id: '123',
            type: '1',
            brand: 'brand1',
            model: 'model1',
            taskTypes: []
        };

        let deviceTypeRepoInstance = Container.get("DeviceTypeRepo");

        sinon.stub(deviceTypeRepoInstance, "findByType").returns(null);
        sinon.stub(deviceTypeRepoInstance, "save").returns(type);

        const deviceTypeService = new DeviceTypeService(deviceTypeRepoInstance as IDeviceTypeRepo);

        const result = await deviceTypeService.createDeviceType(deviceTypeDTO);

        result.getValue().id = '';//id is generated

        expect(result.getValue()).to.deep.equal({
            id: '',
            type: '1',
            brand: 'brand1',
            model: 'model1',
            taskTypes: []
        })
    });
});