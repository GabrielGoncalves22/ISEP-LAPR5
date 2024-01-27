import 'reflect-metadata';

import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../src/core/logic/Result';
import UserController from '../src/controllers/userController';
import IUserDTO from '../src/dto/IUserDTO';
import IUserService from '../src/services/IServices/IUserService';
import { User } from '../src/domain/user/user';

describe('user controller', function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function (done) {
        this.timeout(5000);

        Container.reset();
        let userSchemaInstance = require("../src/persistence/schemas/userSchema").default;
        Container.set("userSchema", userSchemaInstance);

        let userRepoClass = require("../src/repos/userRepo").default;
        let userRepoInstance = Container.get(userRepoClass);
        Container.set("UserRepo", userRepoInstance);

        let userServiceClass = require("../src/services/userService").default;
        let userServiceInstance = Container.get(userServiceClass);
        Container.set("UserService", userServiceInstance);

        done();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('userServiceController + userService integration test using spy on userService', async function () {
        // Arrange
        let body = {
            name: "John Doe",
            email: "johndoe@isep.ipp.pt",
            telephone: "933456789",
            password: "StrongPass@123",
            role: "Fleet Manager",
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => { };

        let userRepoInstance = Container.get("UserRepo");
        sinon.stub(userRepoInstance, "findByEmail").returns(null);
        sinon.stub(userRepoInstance, "findByTelephone").returns(null);
        sinon.stub(userRepoInstance, "findByTaxPayerNumber").returns(null);
        sinon.stub(userRepoInstance, "save").returns(new Promise<User>((resolve, reject) => {
            resolve(User.create({ "name": req.body.name, "email": req.body.email, "telephone": req.body.telephone, "password": req.body.password, "role": req.body.role, "taxPayerNumber": req.body.taxPayerNumber }).getValue())
        }));

        let userServiceInstance = Container.get("UserService");
        const userServiceSpy = sinon.spy(userServiceInstance, "register");

        const ctrl = new UserController(userServiceInstance as IUserService);

        // Act
        await ctrl.register(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match.object);
        sinon.assert.calledOnce(userServiceSpy);
        sinon.assert.calledWith(userServiceSpy, sinon.match({ "name": req.body.name, "email": req.body.email, "telephone": req.body.telephone, "password": req.body.password, "role": req.body.role, "taxPayerNumber": req.body.taxPayerNumber }));
    });

    it('userServiceController unit test using userService mock for register', async function () {
        // Arrange
        let body = {
            name: "John Doe",
            email: "johndoe@isep.ipp.pt",
            telephone: "913456789",
            password: "StrongPass@123",
            role: "Fleet Manager",
        };
        let req: Partial<Request> = {};
        req.body = body;

        let res: Partial<Response> = {
            json: sinon.spy()
        };
        let next: Partial<NextFunction> = () => { };

        let userServiceInstance = Container.get("UserService");
        const userServiceMock = sinon.mock(userServiceInstance, "register")
        userServiceMock.expects("register")
            .once()
            .withArgs(sinon.match({ "name": req.body.name, "email": req.body.email, "telephone": req.body.telephone, "password": req.body.password, "role": req.body.role, "taxPayerNumber": req.body.taxPayerNumber }))
            .returns(Result.ok<IUserDTO>({ "id": "123", "name": req.body.name, "email": req.body.email, "telephone": req.body.telephone, "role": req.body.role, "taxPayerNumber": req.body.taxPayerNumber }));

        const ctrl = new UserController(userServiceInstance as IUserService);

        // Act
        await ctrl.register(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        userServiceMock.verify();
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            "user": undefined as any,
            "token": undefined as any
        }));
    });
});
