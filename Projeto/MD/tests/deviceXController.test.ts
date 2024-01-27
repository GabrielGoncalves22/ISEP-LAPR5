import { Request, Response, NextFunction } from 'express';
import 'reflect-metadata';

import * as sinon from 'sinon';
import { Container } from 'typedi';
import DeviceController from '../src/controllers/deviceController';
import IDeviceDTO from '../src/dto/IDeviceDTO';
import IDeviceTypeDTO from '../src/dto/IDeviceTypeDTO';
import IDeviceService from '../src/services/IServices/IDeviceService';
import { Result } from '../src/core/logic/Result';
import { Device } from '../src/domain/device/device';

describe('device controller', function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function (done) {
        this.timeout(5000);

        Container.reset();
        let deviceSchemaInstance = require("../src/persistence/schemas/deviceSchema").default;
        Container.set("deviceSchema", deviceSchemaInstance);

        let deviceTypeSchemaInstance = require("../src/persistence/schemas/deviceTypeSchema").default;
        Container.set("deviceTypeSchema", deviceTypeSchemaInstance);

        let deviceRepoClass = require("../src/repos/deviceRepo").default;
        let deviceRepoInstance = Container.get(deviceRepoClass);
        Container.set("DeviceRepo", deviceRepoInstance);

        let deviceTypeRepoClass = require("../src/repos/deviceTypeRepo").default;
        let deviceTypeRepoInstance = Container.get(deviceTypeRepoClass);
        Container.set("DeviceTypeRepo", deviceTypeRepoInstance);

        let deviceServiceClass = require("../src/services/deviceService").default;
        let deviceServiceInstance = Container.get(deviceServiceClass);
        Container.set("DeviceService", deviceServiceInstance);

        done();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('deviceController + deviceService integration test using spy on deviceService for createDevice', async function () {
        // Arrange
        const deviceTypeDTO: IDeviceTypeDTO = {
            id: "123",
            type: "tipo fixe",
            brand: "da boa",
            model: "vai dando",
            taskTypes: ["Vigilância", "Transporte"]
        };

        let body = {
            "code": "E",
            "description": "device fize",
            "type": deviceTypeDTO,
            "serialNumber": "hdfhidfhdsfh",
            "nickname": "robo",
            "status": "Ativo"
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => { };

        let deviceRepoInstance = Container.get("DeviceRepo");
        sinon.stub(deviceRepoInstance, "save").returns(new Promise<Device>((resolve, reject) => {
            resolve(Device.create({
                "code": req.body.code,
                "description": req.body.description,
                "type": req.body.type,
                "serialNumber": req.body.serialNumber,
                "nickname": req.body.nickname,
                "status": req.body.status
            }).getValue())
        }));

        let deviceServiceInstance = Container.get("DeviceService");
        const deviceServiceSpy = sinon.spy(deviceServiceInstance, "createDevice");

        const ctrl = new DeviceController(deviceServiceInstance as IDeviceService);

        // Act
        await ctrl.createDevice(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(deviceServiceSpy);
        sinon.assert.calledWith(deviceServiceSpy, sinon.match({
            "code": req.body.code,
            "description": req.body.description,
            "type": req.body.type,
            "serialNumber": req.body.serialNumber,
            "nickname": req.body.nickname,
            "status": req.body.status
        }));
    });

    it('deviceController unit test using deviceService mock for createDevice', async function () {
        //arrange
        let body = { "code": "1", "description": "device desc 1", "type": "type1", "serialNumber": "12345", "nickname": "robonick", "status": "Ativo" };
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => { };

        let deviceServiceInstance = Container.get("DeviceService");
        const deviceServiceMock = sinon.mock(deviceServiceInstance, "createDevice");
        deviceServiceMock.expects("createDevice")
            .once()
            .withArgs(sinon.match({ code: req.body.code, description: req.body.description, type: req.body.type, serialNumber: req.body.serialNumber, nickname: req.body.nickname }))
            .returns(Result.ok<IDeviceDTO>({ "code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status }));

        const ctrl = new DeviceController(deviceServiceInstance as IDeviceService);

        await ctrl.createDevice(<Request>req, <Response>res, <NextFunction>next);

        deviceServiceMock.verify();
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({ "code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status }));
    });
    /*
        it('deviceController unit test using deviceService mock for updateStateDevice', async function () {
            //arrange
            let body = {"code": "1", "description": "device desc 1", "type": "type1", "serialNumber": "12345", "nickname": "robonick", "status": "Ativo"};
            let req: Partial<Request> = {};
            req.body = body;
            let res: Partial<Response> = {
                json: sinon.spy()
            };
            let next: Partial<NextFunction> = () => { };
    
            let deviceServiceInstance = Container.get("DeviceService");
            const deviceServiceMock = sinon.mock(deviceServiceInstance, "updateStateDevice");
            deviceServiceMock.expects("updateStateDevice")
                .once()
                .withArgs(sinon.match({ code: req.body.code, description: req.body.description, type: req.body.type, serialNumber: req.body.serialNumber, nickname: req.body.nickname }))
                .returns(Result.ok<IDeviceDTO>({"code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status}));    
        
            const ctrl = new DeviceController(deviceServiceInstance as IDeviceService);
    
            await ctrl.createDevice(<Request>req, <Response>res, <NextFunction>next);
    
            deviceServiceMock.verify();
            sinon.assert.calledOnce(res.json);
            sinon.assert.calledWith(res.json, sinon.match({"code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status}));
        });
    
        it('deviceController unit test using deviceService mock for getAllDevices', async function () {
            //arrange
            let body = {"code": "1", "description": "device desc 1", "type": "type1", "serialNumber": "12345", "nickname": "robonick", "status": "Ativo"};
            let req: Partial<Request> = {};
            req.body = body;
            let res: Partial<Response> = {
                json: sinon.spy()
            };
            let next: Partial<NextFunction> = () => { };
    
            let deviceServiceInstance = Container.get("DeviceService");
            const deviceServiceMock = sinon.mock(deviceServiceInstance, "getAllDevices");
            deviceServiceMock.expects("getAllDevices")
                .once()
                .withArgs(sinon.match({ code: req.body.code, description: req.body.description, type: req.body.type, serialNumber: req.body.serialNumber, nickname: req.body.nickname }))
                .returns(Result.ok<IDeviceDTO>({"code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status}));    
        
            const ctrl = new DeviceController(deviceServiceInstance as IDeviceService);
    
            await ctrl.createDevice(<Request>req, <Response>res, <NextFunction>next);
    
            deviceServiceMock.verify();
            sinon.assert.calledOnce(res.json);
            sinon.assert.calledWith(res.json, sinon.match({"code": req.body.code, "description": req.body.description, "type": req.body.type, "serialNumber": req.body.serialNumber, "nickname": req.body.nickname, "status": req.body.status}));
        });
    */
});