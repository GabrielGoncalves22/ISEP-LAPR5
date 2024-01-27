import 'reflect-metadata';

import * as sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../src/core/logic/Result';
import PassagewayController from '../src/controllers/passagewayController';
import IPassagewayDTO from '../src/dto/IPassagewayDTO';
import IBuildingDTO from '../src/dto/IBuildingDTO';
import IFloorDTO from '../src/dto/IFloorDTO';
import IPassagewayService from '../src/services/IServices/IPassagewayService';
import { Passageway } from '../src/domain/building/passageway';

describe('passageway controller', function () {
	const sandbox = sinon.createSandbox();

	beforeEach(function (done) {
		this.timeout(5000);

		Container.reset();
		let passagewaySchemaInstance = require("../src/persistence/schemas/passagewaySchema").default;
		Container.set("passagewaySchema", passagewaySchemaInstance);

		let passagewayInstanceRepoClass = require("../src/repos/passagewayRepo").default;
		let passagewayInstanceRepoInstance = Container.get(passagewayInstanceRepoClass);
		Container.set("PassagewayRepo", passagewayInstanceRepoInstance);

		let passagewayServiceClass = require("../src/services/passagewayService").default;
		let passagewayServiceInstance = Container.get(passagewayServiceClass);
		Container.set("PassagewayService", passagewayServiceInstance);

		done();
	});

	afterEach(function () {
		sandbox.restore();
	});
	/*
		it('passagewayController + passagewayService integration test using spy on passagewayService for createPassageway', async function () {
			// Arrange
			const floorDTO1: IFloorDTO = {
				number: 1,
				description: 'Piso de materiais',
				building: 'Q'
			};
	
			const floorDTO2: IFloorDTO = {
				number: 1,
				description: 'Piso de testes de laboratório',
				building: 'E'
			};
	
			const buildingDTO1: IBuildingDTO = {
				code: 'Q',
				name: 'Edifício Q',
				description: 'Edifício para materiais',
				numXCells: 10,
				numYCells: 15,
				floors: [floorDTO1],
				elevator: null,
			};
	
			const buildingDTO2: IBuildingDTO = {
				code: 'E',
				name: 'Edifício E',
				description: 'Edifício para transporte',
				numXCells: 10,
				numYCells: 10,
				floors: [floorDTO2],
				elevator: null,
			};
	
			let body = {
				code: "123",
				building1: buildingDTO1,
				floor1: floorDTO1,
				building2: buildingDTO2,
				floor2: floorDTO2,
				cellOrientation: "north",
				xStartCell: 1,
				yStartCell: 1
			};
			let req: Partial<Request> = {};
			req.body = body;
	
			let res: Partial<Response> = {
				json: sinon.spy()
			};
			let next: Partial<NextFunction> = () => { };
	
			let passagewayRepoInstance = Container.get("PassagewayRepo");
			sinon.stub(passagewayRepoInstance, "save").returns(new Promise<Passageway>((resolve, reject) => {
				resolve(Passageway.create({ "code": req.body.code, "building1": req.body.building1, "floor1": req.body.floor1, "building2": req.body.building2, "floor2": req.body.floor2, "cellOrientation": req.body.cellOrientation, "xStartCell": req.body.xStartCell, "yStartCell": req.body.yStartCell }).getValue())
			}));
	
			let passagewayServiceInstance = Container.get("PassagewayService");
			const deviceServiceSpy = sinon.spy(passagewayServiceInstance, "createPassageway");
	
			const ctrl = new PassagewayController(passagewayServiceInstance as IPassagewayService);
	
			// Act
			await ctrl.createPassageway(<Request>req, <Response>res, <NextFunction>next);
	
			// Assert
			sinon.assert.calledOnce(res.json);
			sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status}));
			sinon.assert.calledOnce(deviceServiceSpy);
			sinon.assert.calledWith(deviceServiceSpy, sinon.match({ "code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status }));
		});
	*/
	it('passagewayController unit test using passagewayService mock for createPassageway', async function () {
		// Arrange
		const floorDTO1: IFloorDTO = {
			number: 1,
			description: 'Piso de materiais',
			building: 'Q'
		};

		const floorDTO2: IFloorDTO = {
			number: 1,
			description: 'Piso de testes de laboratório',
			building: 'E'
		};

		const buildingDTO1: IBuildingDTO = {
			code: 'Q',
			name: 'Edifício Q',
			description: 'Edifício para materiais',
			numXCells: 10,
			numYCells: 15,
			floors: [floorDTO1],
			elevator: null,
		};

		const buildingDTO2: IBuildingDTO = {
			code: 'E',
			name: 'Edifício E',
			description: 'Edifício para transporte',
			numXCells: 10,
			numYCells: 10,
			floors: [floorDTO2],
			elevator: null,
		};

		let body = {
			code: "123",
			building1: buildingDTO1,
			floor1: floorDTO1,
			building2: buildingDTO2,
			floor2: floorDTO2,
			cellOrientation: "north",
			xStartCell: 1,
			yStartCell: 1
		};
		let req: Partial<Request> = {};
		req.body = body;

		let res: Partial<Response> = {
			json: sinon.spy()
		};
		let next: Partial<NextFunction> = () => { };

		let passagewayServiceInstance = Container.get("PassagewayService");
		const passagewayServiceMock = sinon.mock(passagewayServiceInstance, "createPassageway")
		passagewayServiceMock.expects("createPassageway")
			.once()
			.withArgs(sinon.match({ code: req.body.code, building1: req.body.building1, floor1: req.body.floor1, building2: req.body.building2, floor2: req.body.floor2, cellOrientation: req.body.cellOrientation, xStartCell: req.body.xStartCell, yStartCell: req.body.yStartCell }))
			.returns(Result.ok<IPassagewayDTO>({ "code": req.body.code, "building1": req.body.building1, "floor1": req.body.floor1, "building2": req.body.building2, "floor2": req.body.floor2 }));

		const ctrl = new PassagewayController(passagewayServiceInstance as IPassagewayService);

		// Act
		await ctrl.createPassageway(<Request>req, <Response>res, <NextFunction>next);

		// Assert
		passagewayServiceMock.verify();
		sinon.assert.calledOnce(res.json);
		sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "building1": req.body.building1, "floor1": req.body.floor1, "building2": req.body.building2, "floor2": req.body.floor2 }));
	});
	/*
		it('passagewayController unit test using passagewayService mock for getPassagewaysBetweenBuildings', async function () {
			// Arrange
			const floorDTO1: IFloorDTO = {
				number: 1,
				description: 'Piso de materiais',
				building: 'Q'
			};
	
			const floorDTO2: IFloorDTO = {
				number: 1,
				description: 'Piso de testes de laboratório',
				building: 'E'
			};
	
			const buildingDTO1: IBuildingDTO = {
				code: 'Q',
				name: 'Edifício Q',
				description: 'Edifício para materiais',
				numXCells: 10,
				numYCells: 15,
				floors: [floorDTO1],
				elevator: null,
			};
	
			const buildingDTO2: IBuildingDTO = {
				code: 'E',
				name: 'Edifício E',
				description: 'Edifício para transporte',
				numXCells: 10,
				numYCells: 10,
				floors: [floorDTO2],
				elevator: null,
			};
	
			let body = {
				code: "123",
				building1: buildingDTO1,
				floor1: floorDTO1,
				building2: buildingDTO2,
				floor2: floorDTO2,
				cellOrientation: "north",
				xStartCell: 1,
				yStartCell: 1
			};
			let req: Partial<Request> = {};
			req.body = body;
	
			let res: Partial<Response> = {
				json: sinon.spy()
			};
			let next: Partial<NextFunction> = () => { };
	
			let passagewayServiceInstance = Container.get("PassagewayService");
			const passagewayServiceMock = sinon.mock(passagewayServiceInstance, "createPassageway")
			passagewayServiceMock.expects("createPassageway")
				.once()
				.withArgs(sinon.match({ code: req.body.code, building1: req.body.building1, floor1: req.body.floor1, building2: req.body.building2, floor2: req.body.floor2, cellOrientation: req.body.cellOrientation, xStartCell: req.body.xStartCell, yStartCell:req.body.yStartCell }))
				.returns(Result.ok<IPassagewayDTO>({ "code": req.body.code, "building1": req.body.building1, "floor1": req.body.floor1, "building2": req.body.building2, "floor2": req.body.floor2 }));
	
			const ctrl = new PassagewayController(passagewayServiceInstance as IPassagewayService);
	
			// Act
			await ctrl.createPassageway(<Request>req, <Response>res, <NextFunction>next);
	
			// Assert
			passagewayServiceMock.verify();
			sinon.assert.calledOnce(res.json);
			sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "building1": req.body.building1, "floor1": req.body.floor1, "building2": req.body.building2, "floor2": req.body.floor2 }));
		});
	
		it('passagewayController unit test using passagewayService mock for updatePassageway', async function () {
			// Arrange
			const floorDTO1: IFloorDTO = {
				number: 1,
				description: 'Piso de materiais',
				building: 'Q'
			};
	
			const floorDTO2: IFloorDTO = {
				number: 1,
				description: 'Piso de testes de laboratório',
				building: 'E'
			};
	
			const buildingDTO1: IBuildingDTO = {
				code: 'Q',
				name: 'Edifício Q',
				description: 'Edifício para materiais',
				numXCells: 10,
				numYCells: 15,
				floors: [floorDTO1],
				elevator: null,
			};
	
			const buildingDTO2: IBuildingDTO = {
				code: 'E',
				name: 'Edifício E',
				description: 'Edifício para transporte',
				numXCells: 10,
				numYCells: 10,
				floors: [floorDTO2],
				elevator: null,
			};
	
			let body = {
				code: "123",
				building1: buildingDTO1,
				floor1: floorDTO1,
				building2: buildingDTO2,
				floor2: floorDTO2,
				cellOrientation: "north",
				xStartCell: 1,
				yStartCell: 1
			};
			let req: Partial<Request> = {};
			req.body = body;
	
			let res: Partial<Response> = {
				json: sinon.spy()
			};
			let next: Partial<NextFunction> = () => { };
	
			let passagewayServiceInstance = Container.get("PassagewayService");
			const passagewayServiceMock = sinon.mock(passagewayServiceInstance, "createPassageway")
			passagewayServiceMock.expects("createPassageway")
				.once()
				.withArgs(sinon.match({ code: req.body.code, building1: req.body.building1, floor1: req.body.floor1, building2: req.body.building2, floor2: req.body.floor2, cellOrientation: req.body.cellOrientation, xStartCell: req.body.xStartCell, yStartCell:req.body.yStartCell }))
				.returns(Result.ok<IPassagewayDTO>({ "code": req.body.code, "building1": req.body.building1, "floor1": req.body.floor1, "building2": req.body.building2, "floor2": req.body.floor2 }));
	
			const ctrl = new PassagewayController(passagewayServiceInstance as IPassagewayService);
	
			// Act
			await ctrl.createPassageway(<Request>req, <Response>res, <NextFunction>next);
	
			// Assert
			passagewayServiceMock.verify();
			sinon.assert.calledOnce(res.json);
			sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "building1": req.body.building1, "floor1": req.body.floor1, "building2": req.body.building2, "floor2": req.body.floor2 }));
		});
	*/
});