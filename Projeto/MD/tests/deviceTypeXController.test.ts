import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../src/core/logic/Result';
import DeviceTypeController from '../src/controllers/deviceTypeController';
import IDeviceTypeDTO from '../src/dto/IDeviceTypeDTO';
import IDeviceTypeService from '../src/services/IServices/IDeviceTypeService';
import { DeviceType } from '../src/domain/device/deviceType';

describe('deviceType controller', function () {
	const sandbox = sinon.createSandbox();

	beforeEach(function (done) {
		this.timeout(5000);

		Container.reset();
		let deviceTypeSchemaInstance = require("../src/persistence/schemas/deviceTypeSchema").default;
		Container.set("deviceTypeSchema", deviceTypeSchemaInstance);

		let deviceTypeRepoClass = require("../src/repos/deviceTypeRepo").default;
		let deviceTypeRepoInstance = Container.get(deviceTypeRepoClass);
		Container.set("DeviceTypeRepo", deviceTypeRepoInstance);

		let deviceTypeServiceClass = require("../src/services/deviceTypeService").default;
		let deviceTypeServiceInstance = Container.get(deviceTypeServiceClass);
		Container.set("DeviceTypeService", deviceTypeServiceInstance);

		done();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('deviceTypeController + deviceTypeService integration test using spy on deviceTypeService', async function () {
		// Arrange
		let body = {
			type: "tipo fixe",
			brand: "da boa",
			model: "vai dando",
			taskTypes: [0, 1]
		};
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let deviceTypeRepoInstance = Container.get("DeviceTypeRepo");
		sinon.stub(deviceTypeRepoInstance, "findByType").returns(null);
		sinon.stub(deviceTypeRepoInstance, "save").returns(new Promise<DeviceType>((resolve, reject) => {
			resolve(DeviceType.create({ "type": req.body.type, "brand": req.body.brand, "model": req.body.model, "taskTypes": req.body.taskTypes }).getValue())
		}));

		let deviceTypeServiceInstance = Container.get("DeviceTypeService");
		const deviceServiceSpy = sinon.spy(deviceTypeServiceInstance, "createDeviceType");

		const ctrl = new DeviceTypeController(deviceTypeServiceInstance as IDeviceTypeService);

		// Act
		await ctrl.createDeviceType(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match.object);
		sinon.assert.calledOnce(deviceServiceSpy);
		sinon.assert.calledWith(deviceServiceSpy, sinon.match({ "type": req.body.type, "brand": req.body.brand, "model": req.body.model, "taskTypes": req.body.taskTypes }));
	});

	it('deviceTypeController unit test using deviceTypeService mock for createDeviceType', async function () {
		// Arrange
		let body = {
			type: "tipo fixe",
			brand: "da boa",
			model: "vai dando",
			taskTypes: [0, 1]
		};
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let deviceTypeServiceInstance = Container.get("DeviceTypeService");
		const deviceTypeServiceMock = sinon.mock(deviceTypeServiceInstance, "createDeviceType")
		deviceTypeServiceMock.expects("createDeviceType")
			.once()
			.withArgs(sinon.match({ "type": req.body.type, "brand": req.body.brand, "model": req.body.model, "taskTypes": req.body.taskTypes }))
			.returns(Result.ok<IDeviceTypeDTO>({ "id": "123", "type": req.body.type, "brand": req.body.brand, "model": req.body.model, "taskTypes": req.body.taskTypes }));

		const ctrl = new DeviceTypeController(deviceTypeServiceInstance as IDeviceTypeService);

		// Act
		await ctrl.createDeviceType(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		deviceTypeServiceMock.verify();
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "name": req.body.name, "description": req.body.description, "numXCells": req.body.numXCells, "numYCells": req.body.numYCells, "floors": req.body.floors, "elevator": req.body.elevator }));
	});

});