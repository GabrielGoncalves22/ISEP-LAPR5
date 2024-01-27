import { expect } from 'chai';

import * as sinon from 'sinon';
import { Container } from 'typedi';
import IPassagewayRepo from "../../../src/services/IRepos/IPassagewayRepo";
import IBuildingRepo from '../../../src/services/IRepos/IBuildingRepo';
import PassagewayService from "../../../src/services/passagewayService";
import IPassagewayDTO from '../../../src/dto/IPassagewayDTO';
import { Passageway } from '../../../src/domain/building/passageway';
import { PassagewayCode } from '../../../src/domain/building/passagewayCode';
import { Building } from '../../../src/domain/building/building';
import { BuildingCode } from '../../../src/domain/building/buildingCode';
import { BuildingName } from '../../../src/domain/building/buildingName';
import { Description } from '../../../src/domain/building/description';
import { BuildingDimension } from '../../../src/domain/building/buildingDimension';
import { Floor } from '../../../src/domain/building/floor';
import { CellOrientation } from '../../../src/domain/building/cellOrientation';

describe('passageway service', function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function (done) {
        this.timeout(5000);

        Container.reset();
        let passagewaySchemaInstance = require("../../../src/persistence/schemas/passagewaySchema").default;
        Container.set("passagewaySchema", passagewaySchemaInstance);

        let buildingSchemaInstance = require("../../../src/persistence/schemas/buildingSchema").default;
        Container.set("buildingSchema", buildingSchemaInstance);

        let passagewayRepoClass = require("../../../src/repos/passagewayRepo").default;
        let passagewayRepoInstance = Container.get(passagewayRepoClass);
        Container.set("PassagewayRepo", passagewayRepoInstance);

        let buildingRepoClass = require("../../../src/repos/buildingRepo").default;
        let buildingRepoInstance = Container.get(buildingRepoClass);
        Container.set("BuildingRepo", buildingRepoInstance);

        let passagewayServiceClass = require("../../../src/services/passagewayService").default;
        let passagewayServiceInstance = Container.get(passagewayServiceClass);
        Container.set("PassagewayService", passagewayServiceInstance);

        done();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('passagewayService unit test using passagewayRepo stub for createPassageway', async function () {
        // Arrange
        const passagewayDTO: IPassagewayDTO = {
            code: 'Q1-E2',
            building1: 'Q',
            floor1: 1,
            building2: 'E',
            floor2: 2
        };

        let passagewayRepoInstance = Container.get("PassagewayRepo");
        let buildingRepoInstance = Container.get("BuildingRepo");

        sinon.stub(buildingRepoInstance, "findByCode").onFirstCall().returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para comércio').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any
        }).getValue())
            .onSecondCall().returns(
                Building.create({
                    code: BuildingCode.create('E').getValue(),
                    name: BuildingName.create('Edifício E').getValue(),
                    description: Description.create('Edifício para transporte').getValue(),
                    numXCells: BuildingDimension.create(15).getValue(),
                    numYCells: BuildingDimension.create(15).getValue(),
                    floors: [],
                    elevator: null as any
                }).getValue());

        sinon.stub(buildingRepoInstance, "findFloor").onFirstCall().returns(
            Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue())
            .onSecondCall().returns(
                Floor.create({
                    number: 2,
                    description: Description.create('Piso de materiais').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue());

        sinon.stub(passagewayRepoInstance, "findPassageway").returns(null);

        sinon.stub(passagewayRepoInstance, "save").returns(Passageway.create({
            code: PassagewayCode.create('Q', 1, 'E', 2).getValue(),
            building1: Building.create({
                code: BuildingCode.create('Q').getValue(),
                name: BuildingName.create('Edifício Q').getValue(),
                description: Description.create('Edifício para comércio').getValue(),
                numXCells: BuildingDimension.create(10).getValue(),
                numYCells: BuildingDimension.create(10).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor1: Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            building2: Building.create({
                code: BuildingCode.create('E').getValue(),
                name: BuildingName.create('Edifício E').getValue(),
                description: Description.create('Edifício para transporte').getValue(),
                numXCells: BuildingDimension.create(15).getValue(),
                numYCells: BuildingDimension.create(15).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor2: Floor.create({
                number: 2,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        }).getValue());

        const passagewayervice = new PassagewayService(passagewayRepoInstance as IPassagewayRepo, buildingRepoInstance as IBuildingRepo);

        // Act
        const result = await passagewayervice.createPassageway(passagewayDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({
            code: 'Q1-E2',
            building1: 'Q',
            floor1: 1,
            building2: 'E',
            floor2: 2
        });
    });

    it('passagewayService unit test using passagewayRepo stub for updatePassageway', async function () {
        // Arrange
        const passagewayDTO: IPassagewayDTO = {
            code: 'Q1-E2',
            building1: 'Q',
            floor1: 1,
            building2: 'E',
            floor2: 3
        };

        let passagewayRepoInstance = Container.get("PassagewayRepo");
        let buildingRepoInstance = Container.get("BuildingRepo");

        sinon.stub(buildingRepoInstance, "findByCode").onFirstCall().returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para comércio').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any
        }).getValue())
            .onSecondCall().returns(
                Building.create({
                    code: BuildingCode.create('E').getValue(),
                    name: BuildingName.create('Edifício E').getValue(),
                    description: Description.create('Edifício para transporte').getValue(),
                    numXCells: BuildingDimension.create(15).getValue(),
                    numYCells: BuildingDimension.create(15).getValue(),
                    floors: [],
                    elevator: null as any
                }).getValue());

        sinon.stub(buildingRepoInstance, "findFloor").onFirstCall().returns(
            Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue())
            .onSecondCall().returns(
                Floor.create({
                    number: 3,
                    description: Description.create('Piso de testes').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue());

        sinon.stub(passagewayRepoInstance, "findByCode").returns(Passageway.create({
            code: PassagewayCode.create('Q', 1, 'E', 2).getValue(),
            building1: Building.create({
                code: BuildingCode.create('Q').getValue(),
                name: BuildingName.create('Edifício Q').getValue(),
                description: Description.create('Edifício para comércio').getValue(),
                numXCells: BuildingDimension.create(10).getValue(),
                numYCells: BuildingDimension.create(10).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor1: Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            building2: Building.create({
                code: BuildingCode.create('E').getValue(),
                name: BuildingName.create('Edifício E').getValue(),
                description: Description.create('Edifício para transporte').getValue(),
                numXCells: BuildingDimension.create(15).getValue(),
                numYCells: BuildingDimension.create(15).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor2: Floor.create({
                number: 2,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        }).getValue());

        sinon.stub(passagewayRepoInstance, "update").returns(Passageway.create({
            code: PassagewayCode.create('Q', 1, 'E', 2).getValue(),
            building1: Building.create({
                code: BuildingCode.create('Q').getValue(),
                name: BuildingName.create('Edifício Q').getValue(),
                description: Description.create('Edifício para comércio').getValue(),
                numXCells: BuildingDimension.create(10).getValue(),
                numYCells: BuildingDimension.create(10).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor1: Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            building2: Building.create({
                code: BuildingCode.create('E').getValue(),
                name: BuildingName.create('Edifício E').getValue(),
                description: Description.create('Edifício para transporte').getValue(),
                numXCells: BuildingDimension.create(15).getValue(),
                numYCells: BuildingDimension.create(15).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor2: Floor.create({
                number: 3,
                description: Description.create('Piso de testes').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        }).getValue());

        const passagewayervice = new PassagewayService(passagewayRepoInstance as IPassagewayRepo, buildingRepoInstance as IBuildingRepo);

        // Act
        const result = await passagewayervice.updatePassageway("Q1-E2", passagewayDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({
            code: 'Q1-E2',
            building1: 'Q',
            floor1: 1,
            building2: 'E',
            floor2: 3
        });
    });

    it('passagewayService unit test using passagewayRepo stub for getPassagewaysBetweenBuildings', async function () {
        let passagewayRepoInstance = Container.get("PassagewayRepo");
        let buildingRepoInstance = Container.get("BuildingRepo");

        sinon.stub(passagewayRepoInstance, "findAllPassageways").returns([Passageway.create({
            code: PassagewayCode.create('Q', 1, 'E', 2).getValue(),
            building1: Building.create({
                code: BuildingCode.create('Q').getValue(),
                name: BuildingName.create('Edifício Q').getValue(),
                description: Description.create('Edifício para comércio').getValue(),
                numXCells: BuildingDimension.create(10).getValue(),
                numYCells: BuildingDimension.create(10).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor1: Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            building2: Building.create({
                code: BuildingCode.create('E').getValue(),
                name: BuildingName.create('Edifício E').getValue(),
                description: Description.create('Edifício para transporte').getValue(),
                numXCells: BuildingDimension.create(15).getValue(),
                numYCells: BuildingDimension.create(15).getValue(),
                floors: [],
                elevator: null as any
            }).getValue(),
            floor2: Floor.create({
                number: 2,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue(),
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        }).getValue()]);

        const passagewayervice = new PassagewayService(passagewayRepoInstance as IPassagewayRepo, buildingRepoInstance as IBuildingRepo);

        // Act
        const result = await passagewayervice.getPassagewaysBetweenBuildings();

        // Assert
        expect(result.getValue()).to.deep.equal([{
            code: 'Q1-E2',
            building1: 'Q',
            floor1: 1,
            building2: 'E',
            floor2: 2
        }]);
    });
});