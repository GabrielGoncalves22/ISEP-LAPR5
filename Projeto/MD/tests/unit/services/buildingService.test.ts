import { expect } from 'chai';

import * as sinon from 'sinon';
import { Container } from 'typedi';
import IBuildingRepo from "../../../src/services/IRepos/IBuildingRepo";
import IPassagewayRepo from "../../../src/services/IRepos/IPassagewayRepo";
import BuildingService from "../../../src/services/buildingService";
import IBuildingDTO from '../../../src/dto/IBuildingDTO';
import IFloorDTO from '../../../src/dto/IFloorDTO';
import IElevatorDTO from '../../../src/dto/IElevatorDTO';
import IRoomDTO from '../../../src/dto/IRoomDTO';
import { Building } from '../../../src/domain/building/building';
import { BuildingCode } from '../../../src/domain/building/buildingCode';
import { BuildingName } from '../../../src/domain/building/buildingName';
import { Description } from '../../../src/domain/building/description';
import { BuildingDimension } from '../../../src/domain/building/buildingDimension';
import { Floor } from '../../../src/domain/building/floor';
import { Elevator } from '../../../src/domain/building/elevator';
import { ElevatorBrand } from '../../../src/domain/building/elevatorBrand';
import { ElevatorModel } from '../../../src/domain/building/elevatorModel';
import { ElevatorSerialNumber } from '../../../src/domain/building/elevatorSerialNumber';
import { Room } from '../../../src/domain/building/room';
import { RoomCategory } from '../../../src/domain/building/roomCategory';
import { RoomName } from '../../../src/domain/building/roomName';
import { CellOrientation } from '../../../src/domain/building/cellOrientation';

describe('building service', function () {
    const sandbox = sinon.createSandbox();

    beforeEach(function (done) {
        this.timeout(5000);

        Container.reset();
        let buildingSchemaInstance = require("../../../src/persistence/schemas/buildingSchema").default;
        Container.set("buildingSchema", buildingSchemaInstance);

        let passagewaySchemaInstance = require("../../../src/persistence/schemas/passagewaySchema").default;
        Container.set("passagewaySchema", passagewaySchemaInstance);

        let buildingRepoClass = require("../../../src/repos/buildingRepo").default;
        let buildingRepoInstance = Container.get(buildingRepoClass);
        Container.set("BuildingRepo", buildingRepoInstance);

        let passagewayRepoClass = require("../../../src/repos/passagewayRepo").default;
        let passagewayRepoInstance = Container.get(passagewayRepoClass);
        Container.set("PassagewayRepo", passagewayRepoInstance);

        let buildingServiceClass = require("../../../src/services/buildingService").default;
        let buildingServiceInstance = Container.get(buildingServiceClass);
        Container.set("BuildingService", buildingServiceInstance);

        done();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('buildingService unit test using buildingRepo stub for createBuilding', async function () {
        // Arrange
        const buildingDTO: IBuildingDTO = {
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            floors: [],
            elevator: null,
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "save").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any,
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.createBuilding(buildingDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            floors: [],
            elevator: null,
        });
    });

    it('buildingService unit test using buildingRepo stub for updateBuilding', async function () {
        // Arrange
        const buildingDTO: IBuildingDTO = {
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para materiais',
            numXCells: 10,
            numYCells: 15,
            floors: [],
            elevator: null,
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any,
        }).getValue());

        sinon.stub(buildingRepoInstance, "update").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para materiais').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(15).getValue(),
            floors: [],
            elevator: null as any,
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.updateBuilding("Q", buildingDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para materiais',
            numXCells: 10,
            numYCells: 15,
            floors: [],
            elevator: null,
        });
    });

    it('buildingService unit test using buildingRepo stub for createFloor', async function () {
        // Arrange
        const floorDTO: IFloorDTO = {
            number: 1,
            description: 'Piso de materiais',
            building: 'Q'
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any,
        }).getValue());

        sinon.stub(buildingRepoInstance, "findFloor").returns(null);

        sinon.stub(buildingRepoInstance, "update").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({
                    number: 1,
                    description: Description.create('Piso de materiais').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            ],
            elevator: null as any,
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.createFloor(floorDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({ number: 1, description: 'Piso de materiais' });
    });

    it('buildingService unit test using buildingRepo stub for updateFloor', async function () {
        // Arrange
        const floorDTO: IFloorDTO = {
            number: 5,
            description: 'Piso de testes de laboratório',
            building: 'Q'
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({
                    number: 1,
                    description: Description.create('Piso de materiais').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            ],
            elevator: null as any,
        }).getValue());

        sinon.stub(buildingRepoInstance, "findFloor").onFirstCall().returns(
            Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue())
            .onSecondCall().returns(null);

        sinon.stub(buildingRepoInstance, "update").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({
                    number: 5,
                    description: Description.create('Piso de testes de laboratório').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            ],
            elevator: null as any,
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.updateFloor("Q", 1, floorDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({ number: 5, description: 'Piso de testes de laboratório' });
    });

    it('buildingService unit test using buildingRepo stub for createElevator', async function () {
        // Arrange
        const elevatorDTO: IElevatorDTO = {
            brand: 'Schindler',
            model: 'Thyssenkrupp',
            serialNumber: '6007041A2',
            description: 'Elevador para servir o edifício Q',
            building: 'Q',
            floors: [
                {
                    number: 1,
                },
                {
                    number: 2,
                }
            ],
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any,
        }).getValue());

        sinon.stub(buildingRepoInstance, "findElevator").returns(null);

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
                    description: Description.create('Piso de leitura').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            );

        sinon.stub(buildingRepoInstance, "update").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({
                    number: 1,
                    description: Description.create('Piso de materiais').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue(),
                Floor.create({
                    number: 2,
                    description: Description.create('Piso de leitura').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            ],
            elevator: Elevator.create({
                brand: ElevatorBrand.create('Schindler').getValue(),
                model: ElevatorModel.create('Thyssenkrupp').getValue(),
                serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
                description: Description.create('Elevator para servir o edifício Q').getValue(),
                floors: [
                    Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                    Floor.create({ number: 2, description: Description.create('Piso de leitura').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
                ],
                xStartCell: null as any,
                yStartCell: null as any
            }).getValue()
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.createElevator(elevatorDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({
            brand: 'Schindler',
            model: 'Thyssenkrupp',
            serialNumber: '6007041A2',
            description: 'Elevador para servir o edifício Q',
            floors: [
                {
                    number: 1,
                },
                {
                    number: 2,
                }
            ]
        });
    });

    it('buildingService unit test using buildingRepo stub for updateElevator', async function () {
        // Arrange
        const elevatorDTO: IElevatorDTO = {
            brand: 'Otis',
            model: 'Kone',
            serialNumber: '6007041A2',
            description: 'Elevador para servir o edifício Q',
            building: 'Q',
            floors: [
                {
                    number: 1,
                },
                {
                    number: 2,
                }
            ],
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any,
        }).getValue());

        sinon.stub(buildingRepoInstance, "findElevator").returns(Elevator.create({
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevador para servir o edifício Q').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de leitura').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            xStartCell: null as any,
            yStartCell: null as any
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
                    description: Description.create('Piso de leitura').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            );

        sinon.stub(buildingRepoInstance, "update").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({
                    number: 1,
                    description: Description.create('Piso de materiais').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue(),
                Floor.create({
                    number: 2,
                    description: Description.create('Piso de leitura').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            ],
            elevator: Elevator.create({
                brand: ElevatorBrand.create('Otis').getValue(),
                model: ElevatorModel.create('Kone').getValue(),
                serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
                description: Description.create('Elevador para servir o edifício Q').getValue(),
                floors: [
                    Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                    Floor.create({ number: 2, description: Description.create('Piso de leitura').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
                ],
                xStartCell: null as any,
                yStartCell: null as any
            }).getValue()
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.updateElevator("Q", elevatorDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({
            brand: 'Otis',
            model: 'Kone',
            serialNumber: '6007041A2',
            description: 'Elevador para servir o edifício Q',
            floors: [
                {
                    number: 1,
                },
                {
                    number: 2,
                }
            ]
        });
    });

    it('buildingService unit test using buildingRepo stub for createRoom', async function () {
        // Arrange
        const roomDTO: IRoomDTO = {
            name: 'Q102',
            description: 'Sala para aulas práticas',
            category: "Gabinete",
            floor: 1,
            building: 'Q'
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({
                    number: 1,
                    description: Description.create('Piso de materiais').getValue(),
                    rooms: [],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue(),
            ],
            elevator: null as any,
        }).getValue());

        sinon.stub(buildingRepoInstance, "findFloor").returns(
            Floor.create({
                number: 1,
                description: Description.create('Piso de materiais').getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: CellOrientation.north
            }).getValue());

        sinon.stub(buildingRepoInstance, "update").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({
                    number: 1,
                    description: Description.create('Piso de materiais').getValue(),
                    rooms: [
                        Room.create({
                            name: RoomName.create('I102').getValue(),
                            description: Description.create('Sala para aulas práticas').getValue(),
                            category: RoomCategory.Laboratório,
                            xStartCell: null as any,
                            yStartCell: null as any,
                            xEndCell: null as any,
                            yEndCell: null as any,
                            doors: []
                        }).getValue()],
                    map: [],
                    elevatorCellOrientation: CellOrientation.north
                }).getValue()
            ],
            elevator: null as any,
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.createRoom(roomDTO);

        // Assert
        expect(result.getValue()).to.deep.equal({
            name: 'Q102',
            description: 'Sala para aulas práticas',
            category: "Gabinete",
        });
    });

    it('buildingService unit test using buildingRepo stub for getElevatorByBuilding', async function () {
        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [],
            elevator: null as any,
        }).getValue());

        sinon.stub(buildingRepoInstance, "findElevator").returns(Elevator.create({
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevador para servir o edifício Q').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de leitura').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            xStartCell: null as any,
            yStartCell: null as any
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.getElevatorByBuilding("Q");

        // Assert
        expect(result.getValue()).to.deep.equal({
            brand: 'Schindler',
            model: 'Thyssenkrupp',
            serialNumber: '6007041A2',
            description: 'Elevador para servir o edifício Q',
            floors: [
                {
                    number: 1,
                },
                {
                    number: 2,
                }
            ]
        });
    });

    it('buildingService unit test using buildingRepo stub for getBuildingsBetweenMinAndMaxFloors', async function () {
        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findBuildingsBetweenMinAndMaxFloors").returns([{
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            numFloors: 2,
            hasElevator: false,
        }]);

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.getBuildingsBetweenMinAndMaxFloors(1, 2);

        // Assert
        expect(result.getValue()).to.deep.equal([{
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            numFloors: 2,
            hasElevator: false
        }]);
    });

    it('buildingService unit test using buildingRepo stub for getBuildings', async function () {
        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findAll").returns([{
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            numFloors: 2,
            hasElevator: false,
        }]);

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.getBuildings();

        // Assert
        expect(result.getValue()).to.deep.equal([{
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            numFloors: 2,
            hasElevator: false,
        }]);
    });

    it('buildingService unit test using buildingRepo stub for getFloorsByBuilding', async function () {
        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        sinon.stub(buildingRepoInstance, "findByCode").returns(Building.create({
            code: BuildingCode.create('Q').getValue(),
            name: BuildingName.create('Edifício Q').getValue(),
            description: Description.create('Edifício para transporte').getValue(),
            numXCells: BuildingDimension.create(10).getValue(),
            numYCells: BuildingDimension.create(10).getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de leitura').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            elevator: null as any,
        }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.getFloorsByBuilding("Q");

        // Assert
        expect(result.getValue()).to.deep.equal([
            {
                number: 1,
                description: 'Piso de materiais'
            },
            {
                number: 2,
                description: 'Piso de leitura'
            }
        ]);
    });

    /*

    it('buildingService unit test using buildingRepo mock for createBuilding', async function () {
        // Arrange
        const buildingDTO: IBuildingDTO = {
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            floors: [],
            elevator: null
        };

        let buildingRepoInstance = Container.get("BuildingRepo");
        let passagewayRepoInstance = Container.get("PassagewayRepo");

        const roleServiceMock = sinon.mock(buildingRepoInstance, "save")
        roleServiceMock.expects("save")
            .once()
            .withArgs(sinon.match({
                code: 'Q',
                name: 'Edifício Q',
                description: 'Edifício para transporte',
                numXCells: 10,
                numYCells: 10,
                floors: [
                    Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [] }).getValue()
                ],
                elevator: null
            }))
            .returns(Building.create({
                code: BuildingCode.create('Q').getValue(),
                name: BuildingName.create('Edifício Q').getValue(),
                description: Description.create('Edifício para transporte').getValue(),
                numXCells: BuildingDimension.create(10).getValue(),
                numYCells: BuildingDimension.create(10).getValue(),
                floors: [
                    Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [] }).getValue()
                ],
                elevator: null as any,
            }).getValue());

        const buildingService = new BuildingService(buildingRepoInstance as IBuildingRepo, passagewayRepoInstance as IPassagewayRepo);

        // Act
        const result = await buildingService.createBuilding(buildingDTO);

        // Assert
        roleServiceMock.verify();
        expect(result.getValue()).to.deep.equal({
            code: 'Q',
            name: 'Edifício Q',
            description: 'Edifício para transporte',
            numXCells: 10,
            numYCells: 10,
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de materiais').getValue(), rooms: [] }).getValue()
            ],
            elevator: null,
        });
    });

    */

});