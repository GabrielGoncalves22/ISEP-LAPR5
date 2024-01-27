import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../src/core/logic/Result';
import IBuildingService from "../src/services/IServices/IBuildingService";
import BuildingController from "../src/controllers/buildingController";
import IBuildingDTO from '../src/dto/IBuildingDTO';
import IFloorDTO from '../src/dto/IFloorDTO';
import IElevatorDTO from '../src/dto/IElevatorDTO';
import IRoomDTO from '../src/dto/IRoomDTO';
import { Building } from '../src/domain/building/building';

describe('building controller', function () {
	const sandbox = sinon.createSandbox();

	beforeEach(function (done) {
		this.timeout(10000);

		Container.reset();
		let buildingSchemaInstance = require("../src/persistence/schemas/buildingSchema").default;
		Container.set("buildingSchema", buildingSchemaInstance);

		let passagewaySchemaInstance = require("../src/persistence/schemas/passagewaySchema").default;
		Container.set("passagewaySchema", passagewaySchemaInstance);

		let buildingRepoClass = require("../src/repos/buildingRepo").default;
		let buildingRepoInstance = Container.get(buildingRepoClass);
		Container.set("BuildingRepo", buildingRepoInstance);

		let passagewayRepoClass = require("../src/repos/passagewayRepo").default;
		let passagewayRepoInstance = Container.get(passagewayRepoClass);
		Container.set("PassagewayRepo", passagewayRepoInstance);

		let buildingServiceClass = require("../src/services/buildingService").default;
		let buildingServiceInstance = Container.get(buildingServiceClass);
		Container.set("BuildingService", buildingServiceInstance);

		done();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('buildingController + buildingService integration test using spy on buildingService for createBuilding', async function () {
		// Arrange	
		let body = { "code": "B", "name": "info", "description": "edificio fize", "numXCells": 20, "numYCells": 15, "floors": [], "elevator": null };
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let buildingRepoInstance = Container.get("BuildingRepo");
		sinon.stub(buildingRepoInstance, "save").returns(new Promise<Building>((resolve, reject) => {
			resolve(Building.create({ "code": req.body.code, "name": req.body.name, "description": req.body.description, "numXCells": req.body.numXCells, "numYCells": req.body.numYCells, "floors": req.body.floors, "elevator": req.body.elevator }).getValue())
		}));

		let buildingServiceInstance = Container.get("BuildingService");

		const buildingServiceSpy = sinon.spy(buildingServiceInstance, "createBuilding");

		const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);

		// Act
		await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);

		/// Assert
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "name": req.body.name, "description": req.body.description, "numXCells": req.body.numXCells, "numYCells": req.body.numYCells, "floors": req.body.floors, "elevator": req.body.elevator }));
		sinon.assert.calledOnce(buildingServiceSpy);
		sinon.assert.calledWith(buildingServiceSpy, sinon.match({ "code": req.body.code, "name": req.body.name, "description": req.body.description, "numXCells": req.body.numXCells, "numYCells": req.body.numYCells, "floors": req.body.floors, "elevator": req.body.elevator }));
	});

	it('buildingController unit test using buildingService mock for createBuilding', async function () {
		// Arrange
		let body = { "code": "B", "name": "info", "description": "edificio fize", "numXCells": 20, "numYCells": 15, "floors": [], "elevator": null };
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let buildingServiceInstance = Container.get("BuildingService");
		const buildingServiceMock = sinon.mock(buildingServiceInstance, "createBuilding")
		buildingServiceMock.expects("createBuilding")
			.once()
			.withArgs(sinon.match({ code: req.body.code, name: req.body.name, description: req.body.description, numXCells: req.body.numXCells, numYCells: req.body.numYCells, floors: req.body.floors, elevator: req.body.elevator }))
			.returns(Result.ok<IBuildingDTO>({ "code": req.body.code, "name": req.body.name, "description": req.body.description, "numXCells": req.body.numXCells, "numYCells": req.body.numYCells, "floors": req.body.floors, "elevator": req.body.elevator }));

		const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);

		// Act
		await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		buildingServiceMock.verify();
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "name": req.body.name, "description": req.body.description, "numXCells": req.body.numXCells, "numYCells": req.body.numYCells, "floors": req.body.floors, "elevator": req.body.elevator }));
	});

	it('buildingController unit test using buildingService mock for createFloor', async function () {
		// Arrange
		let body = { "number": 1, "description": "edificio fixe", "building": "B" };
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let buildingServiceInstance = Container.get("BuildingService");
		const buildingServiceMock = sinon.mock(buildingServiceInstance, "createFloor")
		buildingServiceMock.expects("createBuilding")
			.once()
			.withArgs(sinon.match({ number: req.body.number, description: req.body.description, building: req.body.building }))
			.returns(Result.ok<IFloorDTO>({ "number": req.body.number, "description": req.body.description, "building": req.body.building }));

		const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);

		// Act
		await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		buildingServiceMock.verify();
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "number": req.body.number, "description": req.body.description, "building": req.body.building }));
	});

	it('buildingController unit test using buildingService mock for createElevator', async function () {
		// Arrange
		let body = { "brand": "uma cena fixe", "model": "uma cena mais ou menos fixe", "serialNumber": "123", "description": "epa sei lá", "building": "B", "floors": [] };
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let buildingServiceInstance = Container.get("BuildingService");
		const buildingServiceMock = sinon.mock(buildingServiceInstance, "createElevator")
		buildingServiceMock.expects("createBuilding")
			.once()
			.withArgs(sinon.match({ brand: req.body.brand, model: req.body.model, serialNumber: req.body.serialNumber, description: req.body.description, building: req.body.building, floors: req.body.floors }))
			.returns(Result.ok<IElevatorDTO>({ "brand": req.body.brand, "model": req.body.model, "serialNumber": req.body.serialNumber, "description": req.body.description, "building": req.body.building, "floors": req.body.floors }));

		const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);

		// Act
		await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		buildingServiceMock.verify();
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "brand": req.body.brand, "model": req.body.model, "serialNumber": req.body.serialNumber, "description": req.body.description, "building": req.body.building, "floors": req.body.floors }));
	});

	it('buildingController unit test using buildingService mock for createRoom', async function () {
		// Arrange
		let body = { "name": "zoologico", "description": "tem animais", "category": "Outro", "floor": "1", "building": "Test" };
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let buildingServiceInstance = Container.get("BuildingService");
		const buildingServiceMock = sinon.mock(buildingServiceInstance, "createRoom")
		buildingServiceMock.expects("createBuilding")
			.once()
			.withArgs(sinon.match({ name: req.body.name, description: req.body.description, category: req.body.category, floor: req.body.floor, building: req.body.building }))
			.returns(Result.ok<IRoomDTO>({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));

		const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);

		// Act
		await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		buildingServiceMock.verify();
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));
	});
	/*
		it('buildingController unit test using buildingService mock for updateBuilding', async function () {
			// Arrange
			let body = { "name": "zoologico", "description": "tem animais", "category": "Outro", "floor": "1", "building": "Test" };
			let req: Partial<Request> = {};
			req.body = body;
	
			let res: Partial<Response> = {
				json: sinon.spy()
			};
			let next: Partial<NextFunction> = () => { };
	
			let buildingServiceInstance = Container.get("BuildingService");
			const buildingServiceMock = sinon.mock(buildingServiceInstance, "createRoom")
			buildingServiceMock.expects("createBuilding")
				.once()
				.withArgs(sinon.match({ name: req.body.name, description: req.body.description, category: req.body.category, floor: req.body.floor , building: req.body.building }))
				.returns(Result.ok<IRoomDTO>({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));
	
			const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);
	
			// Act
			await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);
	
			// Assert
			buildingServiceMock.verify();
			sinon.assert.calledOnce(res.json);
			sinon.assert.calledWith(res.json, sinon.match({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));
		});
	
		it('buildingController unit test using buildingService mock for updateElevator', async function () {
			// Arrange
			let body = { "name": "zoologico", "description": "tem animais", "category": "Outro", "floor": "1", "building": "Test" };
			let req: Partial<Request> = {};
			req.body = body;
	
			let res: Partial<Response> = {
				json: sinon.spy()
			};
			let next: Partial<NextFunction> = () => { };
	
			let buildingServiceInstance = Container.get("BuildingService");
			const buildingServiceMock = sinon.mock(buildingServiceInstance, "createRoom")
			buildingServiceMock.expects("createBuilding")
				.once()
				.withArgs(sinon.match({ name: req.body.name, description: req.body.description, category: req.body.category, floor: req.body.floor , building: req.body.building }))
				.returns(Result.ok<IRoomDTO>({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));
	
			const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);
	
			// Act
			await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);
	
			// Assert
			buildingServiceMock.verify();
			sinon.assert.calledOnce(res.json);
			sinon.assert.calledWith(res.json, sinon.match({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));
		});
	
		it('buildingController unit test using buildingService mock for updateFloor', async function () {
			// Arrange
			let body = { "name": "zoologico", "description": "tem animais", "category": "Outro", "floor": "1", "building": "Test" };
			let req: Partial<Request> = {};
			req.body = body;
	
			let res: Partial<Response> = {
				json: sinon.spy()
			};
			let next: Partial<NextFunction> = () => { };
	
			let buildingServiceInstance = Container.get("BuildingService");
			const buildingServiceMock = sinon.mock(buildingServiceInstance, "createRoom")
			buildingServiceMock.expects("createBuilding")
				.once()
				.withArgs(sinon.match({ name: req.body.name, description: req.body.description, category: req.body.category, floor: req.body.floor , building: req.body.building }))
				.returns(Result.ok<IRoomDTO>({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));
	
			const ctrl = new BuildingController(buildingServiceInstance as IBuildingService);
	
			// Act
			await ctrl.createBuilding(<Request>req, <Response>res, <NextFunction>next);
	
			// Assert
			buildingServiceMock.verify();
			sinon.assert.calledOnce(res.json);
			sinon.assert.calledWith(res.json, sinon.match({ "name": req.body.name, "description": req.body.description, "category": req.body.category, "floor": req.body.floor, "building": req.body.building }));
		});
	*/
});