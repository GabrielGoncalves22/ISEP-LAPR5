import { expect } from 'chai';

import * as sinon from 'sinon';
import { Container } from 'typedi';
import UserService from "../../../src/services/userService";
import IUserRepo from '../../../src/services/IRepos/IUserRepo';
import IUserDTO from '../../../src/dto/IUserDTO';
import { User } from '../../../src/domain/user/user';
import { UserName } from '../../../src/domain/user/userName';
import { UserEmail } from '../../../src/domain/user/userEmail';
import { UserTelephone } from '../../../src/domain/user/userTelephone';
import { UserTaxPayerNumber } from '../../../src/domain/user/userTaxPayerNumber';
import { Role } from '../../../src/domain/user/role';
import { UserPassword } from '../../../src/domain/user/userPassword';
import { UniqueEntityID } from '../../../src/core/domain/UniqueEntityID';
import IUserService from '../../../src/services/IServices/IUserService';

describe('user service', function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function (done) {
        this.timeout(5000);

        Container.reset();
        let userSchemaInstance = require("../../../src/persistence/schemas/userSchema").default;
        Container.set("userSchema", userSchemaInstance);

        let userRepoClass = require("../../../src/repos/userRepo").default;
        let userRepoInstance = Container.get(userRepoClass);
        Container.set("UserRepo", userRepoInstance);

        let userServiceClass = require("../../../src/services/userService").default;
        let userServiceInstance = Container.get(userServiceClass);
        Container.set("UserService", userServiceInstance);

        done();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should toggle user activation successfully', async function () {
        // Arrange
        const userEmail = 'user@isep.ipp.pt';
        const userDTOStub: IUserDTO = {
            name: "André Silva",
            email: "user@isep.ipp.pt",
            telephone: "922435231",
            taxPayerNumber: "152286411",
            role: "User",
            active: true,
            id: '123'
        };

        const existingUser = User.create({
            name: UserName.create("André Silva").getValue(),
            email: UserEmail.create("user@isep.ipp.pt").getValue(),
            telephone: UserTelephone.create("922435231").getValue(),
            taxPayerNumber: UserTaxPayerNumber.create("152286411").getValue(),
            role: Role.User,
            active: false,
            password: UserPassword.create({ password: "1234567@Aa", hashed: false }).getValue()
        }, new UniqueEntityID("123")).getValue();

        const userRepoInstance = Container.get("UserRepo");
        sandbox.stub(userRepoInstance, "findByEmail").returns(existingUser);

        sandbox.stub(userRepoInstance, "update").returns(User.create({
            name: UserName.create("André Silva").getValue(),
            email: UserEmail.create("user@isep.ipp.pt").getValue(),
            telephone: UserTelephone.create("922435231").getValue(),
            taxPayerNumber: UserTaxPayerNumber.create("152286411").getValue(),
            role: Role.User,
            active: true,
            password: UserPassword.create({ password: "1234567@Aa", hashed: false }).getValue()
        }, new UniqueEntityID("123")).getValue());

        const userService = Container.get("UserService") as IUserService;

        // Act
        const result = await userService.toggleActivation(userEmail);

        // Assert
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.deep.equal(userDTOStub);
    });

    it('should fail when user does not exist', async function () {
        // Arrange
        const userEmail = 'nonexistent@example.com';

        const userRepoInstance = Container.get("UserRepo");
        sandbox.stub(userRepoInstance, "findByEmail").returns(null);

        const userService = Container.get("UserService") as IUserService;

        // Act
        const result = await userService.toggleActivation(userEmail);

        // Assert
        expect(result.isFailure).to.be.true;
        expect(result.error).to.equal("The user doesn't exist!");
    });

    it('should register a new user successfully', async function () {
        const user = User.create({
            name: UserName.create("José Silva").getValue(),
            email: UserEmail.create("josesilva@isep.ipp.pt").getValue(),
            telephone: UserTelephone.create("912345678").getValue(),
            taxPayerNumber: UserTaxPayerNumber.create("156768445").getValue(),
            password: UserPassword.create({ password: "Senha@12345", hashed: true }).getValue()
        }, new UniqueEntityID()).getValue();

        const userDTO = {
            id: 'fb406936-88a4-4577-81d1-fab7b7622d39',
            name: "José Silva",
            email: "josesilva@isep.ipp.pt",
            telephone: "912345678",
            password: "Senha@12345",
            role: "User",
            taxPayerNumber: "156768445"
        };

        const userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(null);
        sinon.stub(userRepoInstance, "findByTelephone").returns(null);
        sinon.stub(userRepoInstance, "findByTaxPayerNumber").returns(null);
        sinon.stub(userRepoInstance, "save").returns(user);

        const userService = new UserService(userRepoInstance as IUserRepo);

        const result = await userService.register(userDTO);

        result.getValue().user.id = '';

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().user).to.deep.equal({
            id: '',
            name: "José Silva",
            email: "josesilva@isep.ipp.pt",
            telephone: "912345678",
            role: "User",
            taxPayerNumber: "156768445"
        })
        expect(result.getValue().token).to.exist;
    });

    it('should register a new system manager successfully', async function () {
        const systemManager = User.create({
            name: UserName.create("Ana Santos").getValue(),
            email: UserEmail.create("anasantos@isep.ipp.pt").getValue(),
            telephone: UserTelephone.create("917654321").getValue(),
            taxPayerNumber: undefined as any,
            role: Role.SystemManager,
            password: UserPassword.create({ password: "StrongPass@987", hashed: true }).getValue()
        }, new UniqueEntityID()).getValue();

        const systemManagerDTO = {
            id: '1a2b3c4d-5e6f-7g8h-9i0j',
            name: "Ana Santos",
            email: "anasantos@isep.ipp.pt",
            telephone: "917654321",
            password: "StrongPass@987",
            taxPayerNumber: undefined as any,
            role: "System Manager",
        };

        const userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(null);
        sinon.stub(userRepoInstance, "findByTelephone").returns(null);
        sinon.stub(userRepoInstance, "findByTaxPayerNumber").returns(null);
        sinon.stub(userRepoInstance, "save").returns(systemManager);

        const userService = new UserService(userRepoInstance as IUserRepo);

        const result = await userService.register(systemManagerDTO);

        result.getValue().user.id = '';

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().user).to.deep.equal({
            id: '',
            name: "Ana Santos",
            email: "anasantos@isep.ipp.pt",
            telephone: "917654321",
            taxPayerNumber: undefined as any,
            role: "System Manager"
        })
        expect(result.getValue().token).to.exist;
    });

    it('should register a new campus manager successfully', async function () {
        const campusManager = User.create({
            name: UserName.create("Carlos Oliveira").getValue(),
            email: UserEmail.create("carlosoliveira@isep.ipp.pt").getValue(),
            telephone: UserTelephone.create("912345678").getValue(),
            taxPayerNumber: undefined as any,
            role: Role.CampusManager,
            password: UserPassword.create({ password: "SecurePass@543", hashed: true }).getValue()
        }, new UniqueEntityID()).getValue();

        const campusManagerDTO = {
            id: '9i8h7g6f-5e4d3c2b-1a0j',
            name: "Carlos Oliveira",
            email: "carlosoliveira@isep.ipp.pt",
            telephone: "912345678",
            password: "SecurePass@543",
            taxPayerNumber: undefined as any,
            role: "Campus Manager",
        };

        const userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(null);
        sinon.stub(userRepoInstance, "findByTelephone").returns(null);
        sinon.stub(userRepoInstance, "findByTaxPayerNumber").returns(null);
        sinon.stub(userRepoInstance, "save").returns(campusManager);

        const userService = new UserService(userRepoInstance as IUserRepo);

        const result = await userService.register(campusManagerDTO);

        result.getValue().user.id = '';

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().user).to.deep.equal({
            id: '',
            name: "Carlos Oliveira",
            email: "carlosoliveira@isep.ipp.pt",
            telephone: "912345678",
            taxPayerNumber: undefined as any,
            role: "Campus Manager"
        });
        expect(result.getValue().token).to.exist;
    });

    it('should register a new fleet manager successfully', async function () {
        const fleetManager = User.create({
            name: UserName.create("Diana Pereira").getValue(),
            email: UserEmail.create("dianapereira@isep.ipp.pt").getValue(),
            telephone: UserTelephone.create("937654321").getValue(),
            taxPayerNumber: undefined as any,
            role: Role.FleetManager,
            password: UserPassword.create({ password: "FleetPass@789", hashed: true }).getValue()
        }, new UniqueEntityID()).getValue();

        const fleetManagerDTO = {
            id: '3b2a1c0d-9e8f-7g6h-5i4j',
            name: "Diana Pereira",
            email: "dianapereira@isep.ipp.pt",
            telephone: "937654321",
            password: "FleetPass@789",
            taxPayerNumber: undefined as any,
            role: "Fleet Manager",
        };

        const userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(null);
        sinon.stub(userRepoInstance, "findByTelephone").returns(null);
        sinon.stub(userRepoInstance, "findByTaxPayerNumber").returns(null);
        sinon.stub(userRepoInstance, "save").returns(fleetManager);

        const userService = new UserService(userRepoInstance as IUserRepo);

        const result = await userService.register(fleetManagerDTO);

        result.getValue().user.id = '';

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().user).to.deep.equal({
            id: '',
            name: "Diana Pereira",
            email: "dianapereira@isep.ipp.pt",
            telephone: "937654321",
            taxPayerNumber: undefined as any,
            role: "Fleet Manager"
        });
        expect(result.getValue().token).to.exist;
    });

    it('should register a new task manager successfully', async function () {
        const taskManager = User.create({
            name: UserName.create("Marta Ferreira").getValue(),
            email: UserEmail.create("martaferreira@isep.ipp.pt").getValue(),
            telephone: UserTelephone.create("936543210").getValue(),
            taxPayerNumber: undefined as any,
            role: Role.TaskManager,
            password: UserPassword.create({ password: "TaskPass@456", hashed: true }).getValue()
        }, new UniqueEntityID()).getValue();

        const taskManagerDTO = {
            id: '5i4j3h2g-1a0b9c8d-7e6f5h4i',
            name: "Marta Ferreira",
            email: "martaferreira@isep.ipp.pt",
            telephone: "936543210",
            password: "TaskPass@456",
            taxPayerNumber: undefined as any,
            role: "Task Manager",
        };

        const userRepoInstance = Container.get("UserRepo");

        sinon.stub(userRepoInstance, "findByEmail").returns(null);
        sinon.stub(userRepoInstance, "findByTelephone").returns(null);
        sinon.stub(userRepoInstance, "findByTaxPayerNumber").returns(null);
        sinon.stub(userRepoInstance, "save").returns(taskManager);

        const userService = new UserService(userRepoInstance as IUserRepo);

        const result = await userService.register(taskManagerDTO);

        result.getValue().user.id = '';

        expect(result.isSuccess).to.be.true;
        expect(result.getValue().user).to.deep.equal({
            id: '',
            name: "Marta Ferreira",
            email: "martaferreira@isep.ipp.pt",
            telephone: "936543210",
            taxPayerNumber: undefined as any,
            role: "Task Manager"
        });
        expect(result.getValue().token).to.exist;
    });

});