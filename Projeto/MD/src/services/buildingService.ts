import { Service, Inject } from 'typedi';
import config from "../../config";
import IBuildingDTO from '../dto/IBuildingDTO';
import IBuildingInfoDTO from '../dto/IBuildingInfoDTO';
import IFloorDTO from '../dto/IFloorDTO';
import IFloorInfoDTO from "../dto/IFloorInfoDTO";
import IFloorMapDTO from '../dto/IFloorMapDTO';
import IElevatorDTO from '../dto/IElevatorDTO';
import IRoomDTO from '../dto/IRoomDTO';
import { Building } from "../domain/building/building";
import { Floor } from "../domain/building/floor";
import { Elevator } from "../domain/building/elevator";
import IBuildingRepo from '../services/IRepos/IBuildingRepo';
import IBuildingService from './IServices/IBuildingService';
import { Result } from "../core/logic/Result";
import { BuildingMap } from "../mappers/BuildingMap";
import { FloorMap } from "../mappers/FloorMap";
import { ElevatorMap } from '../mappers/ElevatorMap';
import { RoomMap } from '../mappers/RoomMap';
import { BuildingName } from '../domain/building/buildingName';
import { Description } from '../domain/building/description';
import { BuildingDimension } from '../domain/building/buildingDimension';
import { BuildingCode } from '../domain/building/buildingCode';
import { ElevatorBrand } from "../domain/building/elevatorBrand";
import { ElevatorModel } from "../domain/building/elevatorModel";
import { ElevatorSerialNumber } from "../domain/building/elevatorSerialNumber";
import { Room } from '../domain/building/room';
import { RoomCategory } from '../domain/building/roomCategory';
import { RoomName } from '../domain/building/roomName';
import { CellPosition } from '../domain/building/cellPosition';
import IPassagewayRepo from './IRepos/IPassagewayRepo';
import { CellOrientation } from '../domain/building/cellOrientation';
import { CellInfo } from '../domain/building/cellInfo';
import { Passageway } from '../domain/building/passageway';
import { Door } from '../domain/building/door';
import IRoomLocalizationDTO from '../dto/IRoomLocalizationDTO';

@Service()
export default class BuildingService implements IBuildingService {

    constructor(
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo,
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo
    ) { }

    public async createBuilding(buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
        try {
            const codeOrError = await BuildingCode.create(buildingDTO.code);
            if (codeOrError.isFailure) {
                return Result.fail<IBuildingDTO>(codeOrError.errorValue());
            }

            const nameOrError = await BuildingName.create(buildingDTO.name);
            if (nameOrError.isFailure) {
                return Result.fail<IBuildingDTO>(nameOrError.errorValue());
            }

            const descriptionOrError = await Description.create(buildingDTO.description);
            if (descriptionOrError.isFailure) {
                return Result.fail<IBuildingDTO>(descriptionOrError.errorValue());
            }

            const numXCellsOrError = await BuildingDimension.create(buildingDTO.numXCells);
            if (numXCellsOrError.isFailure) {
                return Result.fail<IBuildingDTO>(numXCellsOrError.errorValue());
            }

            const numYCellsOrError = await BuildingDimension.create(buildingDTO.numYCells);
            if (numYCellsOrError.isFailure) {
                return Result.fail<IBuildingDTO>(numYCellsOrError.errorValue());
            }

            const buildingOrError = await Building.create({
                code: codeOrError.getValue(),
                name: nameOrError.getValue(),
                description: descriptionOrError.getValue(),
                numXCells: numXCellsOrError.getValue(),
                numYCells: numYCellsOrError.getValue(),
                floors: [],
                elevator: null
            });

            if (buildingOrError.isFailure) {
                return Result.fail<IBuildingDTO>(buildingOrError.errorValue());
            }

            const buildingResult = buildingOrError.getValue();

            if ((await this.buildingRepo.save(buildingResult)) === null) {
                return Result.fail<IBuildingDTO>("The building already exists!");
            }

            const buildingDTOResult = BuildingMap.toDTO(buildingResult) as IBuildingDTO;
            return Result.ok<IBuildingDTO>(buildingDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async updateBuilding(buildingCode: string, buildingDTO: IBuildingDTO): Promise<Result<IBuildingDTO>> {
        try {
            const buildingExists = await this.getBuilding(buildingCode);
            if (buildingExists.isFailure) {
                return Result.fail<IBuildingDTO>(buildingExists.errorValue());
            }

            const buildingResult = buildingExists.getValue();

            const nameOrError = buildingDTO.name != undefined ? await BuildingName.create(buildingDTO.name) : await BuildingName.create(buildingResult.name.toString());
            if (nameOrError.isFailure) {
                return Result.fail<IBuildingDTO>(nameOrError.errorValue());
            }

            const descriptionOrError = buildingDTO.description != undefined ? await Description.create(buildingDTO.description) : await Description.create(buildingResult.description.toString());
            if (descriptionOrError.isFailure) {
                return Result.fail<IBuildingDTO>(descriptionOrError.errorValue());
            }

            const numXCellsOrError = buildingDTO.numXCells != undefined ? await BuildingDimension.create(buildingDTO.numXCells) : await BuildingDimension.create(Number(buildingResult.numXCells))
            if (numXCellsOrError.isFailure) {
                return Result.fail<IBuildingDTO>(numXCellsOrError.errorValue());
            }

            const numYCellsOrError = buildingDTO.numYCells != undefined ? await BuildingDimension.create(buildingDTO.numYCells) : await BuildingDimension.create(Number(buildingResult.numYCells));
            if (numYCellsOrError.isFailure) {
                return Result.fail<IBuildingDTO>(numYCellsOrError.errorValue());
            }

            buildingResult.name = nameOrError.getValue();
            buildingResult.description = descriptionOrError.getValue();
            buildingResult.numXCells = numXCellsOrError.getValue();
            buildingResult.numYCells = numYCellsOrError.getValue();

            if ((await this.buildingRepo.update(buildingResult)) === null) {
                return Result.fail<IBuildingDTO>("Something went wrong!");
            }

            const buildingDTOResult = BuildingMap.toDTO(buildingResult) as IBuildingDTO;
            return Result.ok<IBuildingDTO>(buildingDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async createFloor(floorDTO: IFloorDTO): Promise<Result<IFloorDTO>> {
        try {
            const descriptionOrError = await Description.create(floorDTO.description);
            if (descriptionOrError.isFailure) {
                return Result.fail<IFloorDTO>(descriptionOrError.errorValue());
            }

            const buildingOrError = await this.getBuilding(floorDTO.building);
            if (buildingOrError.isFailure) {
                return Result.fail<IFloorDTO>(buildingOrError.errorValue());
            }

            const floorExists = await this.floorExists(floorDTO.building, floorDTO.number);
            if (floorExists) {
                return Result.fail<IFloorDTO>("The floor number " + floorDTO.number + " already exists in the building with the code " + floorDTO.building + ".");
            }

            const floorOrError = await Floor.create({
                number: floorDTO.number,
                description: descriptionOrError.getValue(),
                rooms: [],
                map: [],
                elevatorCellOrientation: null
            });

            if (floorOrError.isFailure) {
                return Result.fail<IFloorDTO>(floorOrError.errorValue());
            }

            const buildingResult = buildingOrError.getValue();
            const floorResult = floorOrError.getValue();
            buildingResult.addFloor(floorResult);

            if ((await this.buildingRepo.update(buildingResult)) === null) {
                return Result.fail<IFloorDTO>("Something went wrong!");
            }

            const buildingDTOResult = FloorMap.toDTO(floorResult) as IFloorDTO;
            return Result.ok<IFloorDTO>(buildingDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async createElevator(elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>> {
        try {
            const brandOrError = await ElevatorBrand.create(elevatorDTO.brand);
            if (brandOrError.isFailure) {
                return Result.fail<IElevatorDTO>(brandOrError.errorValue());
            }

            const modelOrError = await ElevatorModel.create(elevatorDTO.model);
            if (modelOrError.isFailure) {
                return Result.fail<IElevatorDTO>(modelOrError.errorValue());
            }

            const serialNumberOrError = await ElevatorSerialNumber.create(elevatorDTO.serialNumber);
            if (serialNumberOrError.isFailure) {
                return Result.fail<IElevatorDTO>(serialNumberOrError.errorValue());
            }

            const descriptionOrError = await Description.create(elevatorDTO.description);
            if (descriptionOrError.isFailure) {
                return Result.fail<IElevatorDTO>(descriptionOrError.errorValue());
            }

            const buildingOrError = await this.getBuilding(elevatorDTO.building);
            if (buildingOrError.isFailure) {
                return Result.fail<IElevatorDTO>(buildingOrError.errorValue());
            }

            const elevatorExists = await this.getElevator(elevatorDTO.building);
            if (elevatorExists.isSuccess) {
                return Result.fail<IElevatorDTO>("The building with the code " + elevatorDTO.building + " already contains an elevator.");
            }

            const floorsOrError = await this.getFloors(elevatorDTO.building, elevatorDTO.floors.map(floor => floor.number));
            if (floorsOrError.isFailure) {
                return Result.fail<IElevatorDTO>(floorsOrError.errorValue());
            }

            const elevatorOrError = await Elevator.create({
                brand: brandOrError.getValue(),
                model: modelOrError.getValue(),
                serialNumber: serialNumberOrError.getValue(),
                description: descriptionOrError.getValue(),
                floors: floorsOrError.getValue(),
                xStartCell: null,
                yStartCell: null
            });

            if (elevatorOrError.isFailure) {
                return Result.fail<IElevatorDTO>(elevatorOrError.errorValue());
            }

            const buildingResult = buildingOrError.getValue();
            const elevatorResult = elevatorOrError.getValue();
            buildingResult.elevator = elevatorResult;

            if ((await this.buildingRepo.update(buildingResult)) === null) {
                return Result.fail<IElevatorDTO>("Something went wrong!");
            }

            const elevatorDTOResult = ElevatorMap.toDTO(elevatorResult) as IElevatorDTO;
            return Result.ok<IElevatorDTO>(elevatorDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async updateElevator(buildingCode: string, elevatorDTO: IElevatorDTO): Promise<Result<IElevatorDTO>> {
        try {
            const buildingExists = await this.getBuilding(buildingCode);

            if (buildingExists.isFailure) {
                return Result.fail<IElevatorDTO>(buildingExists.errorValue());
            }

            const elevatorExists = await this.getElevator(buildingCode);

            if (elevatorExists.isFailure) {
                return Result.fail<IElevatorDTO>(elevatorExists.errorValue());
            }

            const buildingResult = buildingExists.getValue();

            const elevatorResult = elevatorExists.getValue();

            const brand = await (elevatorDTO.brand != undefined ? ElevatorBrand.create(elevatorDTO.brand) : ElevatorBrand.create(elevatorResult.brand.toString())).getValue();
            const model = await (elevatorDTO.model != undefined ? ElevatorModel.create(elevatorDTO.model) : ElevatorModel.create(elevatorResult.model.toString())).getValue();
            const serialNumber = await (elevatorDTO.serialNumber != undefined ? ElevatorSerialNumber.create(elevatorDTO.serialNumber) : ElevatorSerialNumber.create(elevatorResult.serialNumber.toString())).getValue();
            const description = await (elevatorDTO.description != undefined ? Description.create(elevatorDTO.description) : Description.create(elevatorResult.description.toString())).getValue();
            const floors = (await ((elevatorDTO.floors != undefined ? this.getFloors(buildingResult.code.toString(), elevatorDTO.floors.map(floor => floor.number)) :
                this.getFloors(buildingResult.code.toString(), elevatorResult.floors.map(floor => floor.number))))).getValue();

            const elevatorOrError = Elevator.create({
                brand: brand,
                model: model,
                serialNumber: serialNumber,
                description: description,
                floors: floors,
                xStartCell: null,
                yStartCell: null
            })

            buildingResult.elevator = elevatorOrError.getValue();

            if ((await this.buildingRepo.update(buildingResult)) === null) {
                return Result.fail<IElevatorDTO>("Something went wrong!");
            }

            const buildingDTOResult = ElevatorMap.toDTO(elevatorOrError.getValue()) as IElevatorDTO;
            return Result.ok<IElevatorDTO>(buildingDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async updateFloor(buildingCode: string, number: number, floorDTO: IFloorDTO): Promise<Result<IFloorDTO>> {
        try {
            const buildingExists = await this.getBuilding(buildingCode);

            if (buildingExists.isFailure) {
                return Result.fail<IFloorDTO>(buildingExists.errorValue());
            }

            const floorExists = await this.getFloor(buildingCode, number);
            const numberExists = await this.getFloor(buildingCode, floorDTO.number);

            if (floorExists.isFailure) {
                return Result.fail<IFloorDTO>(floorExists.errorValue());
            } else if (numberExists.isSuccess && numberExists.getValue().number !== number) {
                return Result.fail<IFloorDTO>("The building with the code " + buildingCode + " contains the floor number " + floorDTO.number + ".");
            }

            const buildingResult = buildingExists.getValue();
            const floorResult = floorExists.getValue();

            const numberOrError = floorDTO.number != undefined ? Number(floorDTO.number) : floorResult.number;
            const descriptionOrError = floorDTO.description != undefined ? Description.create(floorDTO.description) : Description.create(floorResult.description.toString());

            floorResult.number = numberOrError;
            floorResult.description = descriptionOrError.getValue();

            buildingResult.updateFloor(number, floorResult);

            if ((await this.buildingRepo.update(buildingResult)) === null) {
                return Result.fail<IFloorDTO>("Something went wrong!");
            }

            const buildingDTOResult = FloorMap.toDTO(floorResult) as IFloorDTO;
            return Result.ok<IFloorDTO>(buildingDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async createRoom(roomDTO: IRoomDTO): Promise<Result<IRoomDTO>> {
        try {

            const buildingOrError = await this.getBuilding(roomDTO.building);
            if (buildingOrError.isFailure) {
                return Result.fail<IRoomDTO>(buildingOrError.errorValue());
            }

            const floorExists = await this.floorExists(roomDTO.building, roomDTO.floor);
            if (!floorExists) {
                return Result.fail<IRoomDTO>("The floor doesn't exists!");
            }

            const nameOrError = RoomName.create(roomDTO.name);
            if (nameOrError.isFailure) {
                return Result.fail<IRoomDTO>(nameOrError.errorValue());
            }

            const descriptionOrError = Description.create(roomDTO.description);
            if (descriptionOrError.isFailure) {
                return Result.fail<IRoomDTO>(descriptionOrError.errorValue());
            }

            if (!(Object.values(RoomCategory) as string[]).includes(roomDTO.category)) {
                return Result.fail<IRoomDTO>("The category is invalid!");
            }

            const roomOrError = Room.create({
                name: nameOrError.getValue(),
                description: descriptionOrError.getValue(),
                category: roomDTO.category as RoomCategory,
                xStartCell: null,
                yStartCell: null,
                xEndCell: null,
                yEndCell: null,
                doors: []
            });

            if (roomOrError.isFailure) {
                return Result.fail<IRoomDTO>(roomOrError.errorValue());
            }

            const buildingResult = buildingOrError.getValue();
            const roomResult = roomOrError.getValue();

            const floor = buildingResult.floors.find((f) => f.number === roomDTO.floor);
            floor.rooms.push(roomResult);

            if ((await this.buildingRepo.update(buildingResult)) === null) {
                return Result.fail<IRoomDTO>("Something went wrong!");
            }

            const buildingDTOResult = RoomMap.toDTO(roomResult) as IRoomDTO;
            return Result.ok<IRoomDTO>(buildingDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public validateMapFileData(file: Buffer): Result<IFloorMapDTO> {
        const fileData = JSON.parse(file.toString());
        let errorMessage = '';

        if (typeof fileData === 'object' && fileData !== null) {
            // Verificar se existem as dimensões
            if (fileData.floor) {
                if (!fileData.floor.size.numXCells) {
                    errorMessage = 'The size of X cells of the building is missing.';
                } else if (!fileData.floor.size.numYCells) {
                    errorMessage = 'The size of Y cells of the building is missing.';
                }

                // Verificar se o campo map existe
                if (errorMessage === '' && !fileData.floor.map) {
                    errorMessage = 'Map field is missing.';
                }

                // Se as passageways forem especificadas
                if (errorMessage === '' && fileData.floor.passageways) {
                    if (Array.isArray(fileData.floor.passageways)) {
                        let countPassageways = 0;
                        let valid = true;
                        while (countPassageways < fileData.floor.passageways.length && valid) {
                            const passageway = fileData.floor.passageways[countPassageways];

                            if (!passageway.code || passageway.xStartCell === undefined || passageway.yStartCell === undefined || !passageway.cellOrientation) {
                                errorMessage = 'The field passageways is invalid in the ' + (countPassageways + 1) + ' passageway data.';
                                valid = false;
                            }

                            countPassageways++;
                        }
                    } else {
                        errorMessage = 'The field passageways is invalid.';
                    }
                }

                // Se o elevador for especificado
                if (errorMessage === '' && fileData.floor.elevator) {
                    if (!fileData.floor.elevator.xStartCell
                        || !fileData.floor.elevator.yStartCell
                        || !fileData.floor.elevator.cellOrientation
                    ) {
                        errorMessage = 'The field elevator is invalid.';
                    }
                }

                // Se as salas forem especificadas
                if (errorMessage === '' && fileData.floor.rooms) {
                    if (Array.isArray(fileData.floor.rooms)) {
                        let countRooms = 0;
                        let valid = true;
                        while (countRooms < fileData.floor.rooms.length && valid) {
                            const room = fileData.floor.rooms[countRooms];

                            if (room.name === undefined || room.xStartCell === undefined || room.yStartCell === undefined
                                || room.xEndCell === undefined || room.yEndCell === undefined || room.doors === undefined) {
                                errorMessage = 'The field rooms is invalid in the ' + (countRooms + 1) + ' room data.';
                                valid = false;
                            } else if (Array.isArray(room.doors)) {
                                let countDoors = 0;
                                let validDoors = true;
                                while (countDoors < fileData.floor.rooms[countRooms].doors.length && validDoors) {
                                    const door = fileData.floor.rooms[countRooms].doors[countDoors];
                                    if (!door.xPositionCell || !door.yPositionCell || !door.cellOrientation) {
                                        errorMessage = 'The door ' + (countDoors + 1) + ' is invalid in the room number ' + (countRooms + 1) + ' room data.';
                                        validDoors = false;
                                    }
                                    countDoors++;
                                }
                            } else {
                                errorMessage = 'The field doors is invalid in the room number ' + (countRooms + 1) + ' room data.';
                                valid = false;
                            }

                            countRooms++;
                        }
                    } else {
                        errorMessage = 'The field rooms is invalid.';
                    }
                }

            } else {
                errorMessage = 'Floor field is missing.';
            }

        } else {
            errorMessage = 'The file is invalid!';
        }

        if (errorMessage !== '') {
            return Result.fail<IFloorMapDTO>(errorMessage);
        }

        return Result.ok<IFloorMapDTO>(fileData as IFloorMapDTO);
    }

    public async loadMap(buildingCode: string, floorNumber: number, floorMap: IFloorMapDTO): Promise<Result<IFloorMapDTO>> {
        try {
            const buildingExists = await this.getBuilding(buildingCode);

            if (buildingExists.isFailure) {
                return Result.fail<IFloorMapDTO>(buildingExists.errorValue());
            }

            const buildingResult = buildingExists.getValue();
            if (Number(buildingResult.numXCells) !== floorMap.floor.size.numXCells) {
                return Result.fail<IFloorMapDTO>("The X dimensions doesn't match!");
            }

            if (Number(buildingResult.numYCells) !== floorMap.floor.size.numYCells) {
                return Result.fail<IFloorMapDTO>("The Y dimensions doesn't match!");
            }

            const buildingFloor = buildingResult.floors.find((floor) => floor.number === floorNumber);
            if (!buildingFloor) {
                return Result.fail<IFloorMapDTO>("The floor with number " + floorNumber + " doesn't exists in the building " + buildingCode + "!");
            }

            // Mapa
            const floor = buildingResult.floors.find((floor) => floor.number === floorNumber);

            floor.map = [];
            for (let i = 0; i < floorMap.floor.map.length; i++) {
                const array: CellInfo[] = [];
                for (let j = 0; j < floorMap.floor.map[i].length; j++) {
                    const cellInfo = CellInfo.create(floorMap.floor.map[i][j]);
                    if (cellInfo.isFailure) {
                        return Result.fail<IFloorMapDTO>("The map is not valid in the position [" + i + "] [" + j + "]!");
                    }
                    array.push(cellInfo.getValue());
                }

                floor.map.push(array);
            }

            // Informação das passagens
            if (floorMap.floor.passageways !== undefined) {
                floorMap.floor.passageways.forEach(async passageway => {
                    const passagewayExists = await this.getPassageway(passageway.code);
                    if (passagewayExists.isFailure) {
                        return Result.fail<IFloorMapDTO>(passagewayExists.errorValue());
                    }

                    const thePassageway = passagewayExists.getValue();
                    if (
                        (String(thePassageway.building1) !== buildingCode && String(thePassageway.building2) !== buildingCode) ||
                        (String(thePassageway.building1) === buildingCode && Number(thePassageway.floor1) !== floorNumber) ||
                        (String(thePassageway.building2) === buildingCode && Number(thePassageway.floor2) !== floorNumber)
                    ) {
                        return Result.fail<IFloorMapDTO>("The passageway with code " + passageway.code + " doesn't exists in the floor!");
                    }

                    const validXStartCell = CellPosition.create(passageway.xStartCell);
                    if (validXStartCell.isFailure) {
                        return Result.fail<IFloorMapDTO>(validXStartCell.errorValue());
                    }
                    thePassageway.changeXStartCell = validXStartCell.getValue();


                    const validYStartCell = CellPosition.create(passageway.yStartCell);
                    if (validYStartCell.isFailure) {
                        return Result.fail<IFloorMapDTO>(validYStartCell.errorValue());
                    }
                    thePassageway.changeYStartCell = validYStartCell.getValue();

                    thePassageway.cellOrientation = CellOrientation[passageway.cellOrientation as keyof typeof CellOrientation];

                    await this.passagewayRepo.update(thePassageway);
                });
            }

            if (buildingResult.elevator === null && floorMap.floor.elevator !== undefined) {
                return Result.fail<IFloorMapDTO>("The building doesn't have an elevator!");

                // Informação do elevador
            } else if (buildingResult.elevator !== null && floorMap.floor.elevator !== undefined) {
                const validXStartCell = CellPosition.create(floorMap.floor.elevator.xStartCell);
                if (validXStartCell.isFailure) {
                    return Result.fail<IFloorMapDTO>(validXStartCell.errorValue());
                }
                buildingResult.elevator.xStartCell = validXStartCell.getValue();

                const validYStartCell = CellPosition.create(floorMap.floor.elevator.yStartCell);
                if (validYStartCell.isFailure) {
                    return Result.fail<IFloorMapDTO>(validYStartCell.errorValue());
                }
                buildingResult.elevator.yStartCell = validYStartCell.getValue();

                const elevatorFloorInfo = buildingResult.elevator.floors.find((elevatorFloor) => elevatorFloor.number === floor.number);
                // Orientação do elevador no floor
                elevatorFloorInfo.elevatorCellOrientation = CellOrientation[floorMap.floor.elevator.cellOrientation as keyof typeof CellOrientation];
            }

            // Informação das salas
            if (floorMap.floor.rooms !== undefined) {

                floorMap.floor.rooms.forEach(mapRoom => {
                    const roomExists = buildingFloor.rooms.find((room) => mapRoom.name === String(room.name));

                    if (!roomExists) {
                        return Result.fail<IFloorMapDTO>("The room with name " + mapRoom.name + " doesn't exists in the specified floor!");
                    }

                    const xStartCellValid = CellPosition.create(mapRoom.xStartCell);
                    if (xStartCellValid.isFailure) {
                        return Result.fail<IFloorMapDTO>(xStartCellValid.error.toString());
                    }
                    roomExists.xStartCell = xStartCellValid.getValue();

                    const yStartCellValid = CellPosition.create(mapRoom.yStartCell);
                    if (yStartCellValid.isFailure) {
                        return Result.fail<IFloorMapDTO>(yStartCellValid.error.toString());
                    }
                    roomExists.yStartCell = yStartCellValid.getValue();

                    const xEndCellValid = CellPosition.create(mapRoom.xEndCell);
                    if (xEndCellValid.isFailure) {
                        return Result.fail<IFloorMapDTO>(xEndCellValid.error.toString());
                    }
                    roomExists.xEndCell = xEndCellValid.getValue();

                    const yEndCellValid = CellPosition.create(mapRoom.yEndCell);
                    if (yEndCellValid.isFailure) {
                        return Result.fail<IFloorMapDTO>(yEndCellValid.error.toString());
                    }
                    roomExists.yEndCell = yEndCellValid.getValue();

                    roomExists.doors = [];
                    mapRoom.doors.forEach((door) => {
                        const yDoorPositionCell = CellPosition.create(door.yPositionCell);
                        if (yDoorPositionCell.isFailure) {
                            return Result.fail<IFloorMapDTO>(yDoorPositionCell.error.toString());
                        }

                        const xDoorPositionCell = CellPosition.create(door.xPositionCell);
                        if (xDoorPositionCell.isFailure) {
                            return Result.fail<IFloorMapDTO>(xDoorPositionCell.error.toString());
                        }

                        const doorCellOrientation = CellOrientation[door.cellOrientation as keyof typeof CellOrientation];

                        const doorValid = Door.create({
                            yPositionCell: yDoorPositionCell.getValue(),
                            xPositionCell: xDoorPositionCell.getValue(),
                            cellOrientation: doorCellOrientation
                        });

                        if (doorValid.isFailure) {
                            return Result.fail<IFloorMapDTO>(doorValid.error.toString());
                        }

                        roomExists.doors.push(doorValid.getValue());
                    });
                });
            }

            // Update
            if ((await this.buildingRepo.update(buildingResult)) === null) {
                return Result.fail<IFloorMapDTO>("Something went wrong!");
            }

            return Result.ok<IFloorMapDTO>(floorMap);
        } catch (e) {
            throw e;
        }
    }

    public async getElevatorByBuilding(buildingCode: string): Promise<Result<IElevatorDTO>> {
        try {
            const buildingExists = await this.getBuilding(buildingCode);
            if (buildingExists.isFailure) {
                return Result.fail<IElevatorDTO>(buildingExists.errorValue());
            }

            const elevatorExists = await this.getElevator(buildingCode);
            if (elevatorExists.isFailure) {
                return Result.fail<IElevatorDTO>(elevatorExists.errorValue());
            }

            const elevatorDTOResult = ElevatorMap.toDTO(elevatorExists.getValue()) as IElevatorDTO;
            return Result.ok<IElevatorDTO>(elevatorDTOResult);
        } catch (e) {
            throw e;
        }
    }

    public async getBuildingsBetweenMinAndMaxFloors(numMinFloors: number, numMaxFloors: number): Promise<Result<IBuildingInfoDTO[]>> {
        try {
            const buildingsInfos = await this.buildingRepo.findBuildingsBetweenMinAndMaxFloors(numMinFloors, numMaxFloors);
            if (!buildingsInfos || buildingsInfos.length === 0 || buildingsInfos == null) {
                return Result.fail<IBuildingInfoDTO[]>("There isn't any building with a number of floors between " + numMinFloors + " and " + numMaxFloors + ".");
            }

            let buildingsDTO: IBuildingInfoDTO[] = [];
            buildingsInfos.forEach(building => {
                buildingsDTO.push(BuildingMap.toInfoDTO(building));
            });

            return Result.ok<IBuildingInfoDTO[]>(buildingsDTO);
        } catch (e) {
            throw e;
        }
    }

    public async getFloorsByBuilding(buildingCode: string): Promise<Result<IFloorInfoDTO[]>> {
        try {
            const buildingExists = await this.getBuilding(buildingCode);
            if (buildingExists.isFailure) {
                return Result.fail<IFloorInfoDTO[]>(buildingExists.errorValue());
            }

            const floors = buildingExists.getValue().floors;
            floors.sort((a, b) => a.number - b.number);

            if (!floors.length) {
                return Result.fail<IFloorInfoDTO[]>("The building doesn't have floors.");
            }

            const floorDTOResult = FloorMap.toInfoDTO(floors) as IFloorInfoDTO[];
            return Result.ok<IFloorInfoDTO[]>(floorDTOResult);
        } catch (e) {
            throw e;
        }
    }

    public async getBuildings(): Promise<Result<IBuildingInfoDTO[]>> {
        const buildings = await this.buildingRepo.findAll();
        if (buildings) {
            const buildingDTOs = buildings.map((building) => BuildingMap.toInfoDTO(building));
            return Result.ok<IBuildingInfoDTO[]>(buildingDTOs);
        }

        return Result.fail<IBuildingInfoDTO[]>("Could not find any buildings");
    }

    public async getBuildingByCode(buildingCode: string): Promise<Result<IBuildingInfoDTO>> {
        const building = await this.getBuilding(buildingCode);

        if (building.isSuccess) {
            return Result.ok<IBuildingInfoDTO>(BuildingMap.toInfoDTO(building.getValue()));
        } else {
            return Result.fail<IBuildingInfoDTO>(building.errorValue());
        }
    }

    public async getFloorsWithPassagewaysToBuildingByBuilding(buildingCode: string): Promise<Result<IFloorDTO[][]>> {

        const passageways = await this.passagewayRepo.findPassagewayWithBuilding(buildingCode);

        if (!passageways || passageways.length === 0) {
            return Result.fail<IFloorDTO[][]>("Could not find any floors with passageways to other buildings");
        }

        const floors = passageways.map((passageway) => {
            const floorInfoBuilding1 = this.buildingRepo.findFloor(passageway.building1.toString(), Number(passageway.floor1));
            const floorInfoBuilding2 = this.buildingRepo.findFloor(passageway.building2.toString(), Number(passageway.floor2));
            return [[floorInfoBuilding1, passageway.building1], [floorInfoBuilding2, passageway.building2]];
        });

        const floorsDTO = await Promise.all(floors.map(async (floorPair) => {
            //@ts-ignore
            const floor1DTO = FloorMap.toDTO(await floorPair[0][0]);
            //@ts-ignore
            const floor2DTO = FloorMap.toDTO(await floorPair[1][0]);
            //@ts-ignore
            floor1DTO.building = floorPair[0][1];
            //@ts-ignore
            floor2DTO.building = floorPair[1][1];
            return [floor1DTO, floor2DTO];
        }));

        return Result.ok<IFloorDTO[][]>(floorsDTO);
    }

    public async getMap(buildingCode: string, floorNumber: number): Promise<Result<IFloorMapDTO>> {
        // Dados do piso, mapa, e quartos e respestivas portas
        const floorData = await this.getFloor(buildingCode, floorNumber);
        if (floorData.isFailure) {
            return Result.fail<IFloorMapDTO>(floorData.errorValue());
        }

        // Para ter os tamanhos
        const buildingData = await this.getBuilding(buildingCode);
        if (buildingData.isFailure) {
            return Result.fail<IFloorMapDTO>(buildingData.errorValue());
        }

        // Dados das passageways
        const passagewaysResult = await this.getFloorPassageways(buildingCode, floorNumber);
        let passagewaysData: Passageway[] | undefined = undefined;

        if (passagewaysResult.isSuccess) {
            passagewaysData = passagewaysResult.getValue();
        }

        // Dados do elevador
        const elevatorResult = await this.getElevator(buildingCode);
        let elevatorData: Elevator | undefined = undefined;

        if (elevatorResult.isSuccess) {
            elevatorData = elevatorResult.getValue();
        }

        const result: IFloorMapDTO = FloorMap.toMapDTO(buildingData.getValue(), floorData.getValue(), passagewaysData, elevatorData);

        if (result) {
            return Result.ok<IFloorMapDTO>(result);
        } else {
            return Result.fail<IFloorMapDTO>(`The building with the code ${buildingCode} in floor ${floorNumber} doesn't contains a map.`);
        }
    }

    public async checkBuildingFloors(buildingCode: string, floors: number[]): Promise<Result<string>> {
        const buildingData = await this.getBuilding(buildingCode);
        if (buildingData.isFailure) {
            return Result.fail<string>(buildingData.errorValue());
        }

        const buildingFloors = buildingData.getValue().floors;
        let floorsExist = false;
        let index = 0;

        do {
            floorsExist = buildingFloors.find(buildingFloor => buildingFloor.number == floors[index]) !== undefined ? true : false;
            index++;
        } while (index < floors.length && floorsExist);

        if (floorsExist) {
            return Result.ok<string>("All the floors specified exists in the building with code " + buildingCode + ".");
        } else {
            return Result.fail<string>("The floor " + floors[index - 1] + " doesn't exists in the building with code " + buildingCode + "!");
        }
    }

    public async getRoomByName(buildingCode: string, roomName: string): Promise<Result<IRoomLocalizationDTO>> {
        const room = await this.getRoom(buildingCode, roomName);
        
        if (room.isSuccess) {
            const floor = await this.getFloorByBuildingAndRoom(buildingCode, roomName);
            if (floor.isSuccess) {
                return Result.ok<IRoomLocalizationDTO>(RoomMap.toLocalizationDTO(room.getValue(), buildingCode, floor.getValue()));
            } else {
                return Result.fail<IRoomLocalizationDTO>(floor.errorValue());
            }
        } else {
            return Result.fail<IRoomLocalizationDTO>(room.errorValue());
        }
    }

    public async getAllRooms(): Promise<Result<IRoomDTO[]>> {
        const buildings = await this.buildingRepo.findAllBuildings();
        if (buildings) {
            let roomsDTOs: IRoomDTO[] = [];

            buildings.forEach(building => {
                if (building.floors) {
                    building.floors.forEach(floor => {
                        if (floor.rooms) {
                            floor.rooms.forEach(room => {
                                roomsDTOs.push(RoomMap.toDTOWithBuilding(room, building));
                            })
                        }
                    });
                }
            });

            return Result.ok<IRoomDTO[]>(roomsDTOs);
        } else {
            return Result.fail<IRoomDTO[]>("There are no buildings in the system.");
        }
    }

    private async getBuilding(buildingCode: string): Promise<Result<Building>> {
        const building = await this.buildingRepo.findByCode(buildingCode);

        if (building) {
            return Result.ok<Building>(building);
        } else {
            return Result.fail<Building>("Couldn't find building by code " + buildingCode + ".");
        }
    }

    private async getFloors(buildingCode: string, floorNumbers: number[]): Promise<Result<Floor[]>> {
        const floors: Floor[] = [];
        const notFoundFloors: number[] = [];

        for (const floorNumber of floorNumbers) {
            const floor = await this.buildingRepo.findFloor(buildingCode, floorNumber);

            if (floor) {
                floors.push(floor);
            } else {
                notFoundFloors.push(floorNumber);
            }
        }

        if (floors.length === floorNumbers.length) {
            return Result.ok<Floor[]>(floors);
        } else {
            return Result.fail<Floor[]>("Couldn't find floors with numbers: " + notFoundFloors.join(', ') + " in the building with the code " + buildingCode + ".");
        }
    }

    private async getElevator(buildingCode: string): Promise<Result<Elevator>> {
        const elevator = await this.buildingRepo.findElevator(buildingCode);

        if (elevator) {
            return Result.ok<Elevator>(elevator);
        } else {
            return Result.fail<Elevator>("The building with the code " + buildingCode + " no contains an elevator.");
        }
    }

    private async getFloor(buildingCode: string, floorNumber: number): Promise<Result<Floor>> {
        const floor = await this.buildingRepo.findFloor(buildingCode, floorNumber);

        if (floor) {
            return Result.ok<Floor>(floor);
        } else {
            return Result.fail<Floor>("The building with the code " + buildingCode + " doesn't contain the floor number " + floorNumber + ".");
        }
    }

    private async getPassageway(passagewayCode: string): Promise<Result<Passageway>> {
        const passageway = await this.passagewayRepo.findByCode(passagewayCode);

        if (passageway) {
            return Result.ok<Passageway>(passageway);
        } else {
            return Result.fail<Passageway>("The passageway with code " + passagewayCode + " doesn't exists!");
        }
    }

    private async getFloorPassageways(buildingCode: string, floorNumber: number): Promise<Result<Passageway[]>> {
        const passageways = await this.passagewayRepo.findFloorPassageways(buildingCode, floorNumber);

        if (passageways) {
            return Result.ok<Passageway[]>(passageways);
        }
    }

    private async getRoom(buildingCode: string, roomName: string) {
        const room = await this.buildingRepo.findRoom(buildingCode, roomName);

        if (room) {
            return Result.ok<Room>(room);
        } else {
            return Result.fail<Room>("There is no data about a room with name '" + roomName + "' in a building with code '" + buildingCode + "'!");
        }
    }

    private async floorExists(buildingCode: string, floorNumber: number): Promise<boolean> {
        const floor = await this.buildingRepo.findFloor(buildingCode, floorNumber);

        return floor ? true : false;
    }

    private async roomExists(buildingCode: string, roomName: string) {
        const room = await this.buildingRepo.findRoom(buildingCode, roomName);
        return room ? true : false;
    }

    private async getFloorByBuildingAndRoom(buildingCode: string, roomName: string): Promise<Result<Floor>> {
        const building = await this.getBuilding(buildingCode);

        if (building.isFailure) {
            return Result.fail<Floor>("The building with code '" + buildingCode + "' doesn't exists!");
        }

        const floor = building.getValue().floors.find(buildingFloor => {
            return buildingFloor.rooms.find(floorRoom => floorRoom.name.toString() === roomName);
        });

        if (floor !== undefined) {
            return Result.ok<Floor>(floor);
        } else {
            return Result.fail<Floor>("There is no room named '" + roomName + "' in the building with code '" + buildingCode + "' doesn't exists!");
        }
    }
}