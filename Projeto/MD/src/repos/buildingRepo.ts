import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model } from 'mongoose';
import { IBuildingPersistence } from '../dataschema/IBuildingPersistence';

import IBuildingRepo from "../services/IRepos/IBuildingRepo";
import { BuildingMap } from "../mappers/BuildingMap";
import { FloorMap } from "../mappers/FloorMap";
import { ElevatorMap } from '../mappers/ElevatorMap';
import { Building } from '../domain/building/building';
import { Floor } from '../domain/building/floor';
import { Elevator } from '../domain/building/elevator';
import { Room } from '../domain/building/room';
import { BuildingCode } from '../domain/building/buildingCode';
import { RoomMap } from '../mappers/RoomMap';

@Service()
export default class BuildingRepo implements IBuildingRepo {
    private models: any;

    constructor(
        @Inject('buildingSchema') private buildingSchema: Model<IBuildingPersistence & Document>,
    ) { }

    public async exists(building: Building): Promise<boolean> {
        const idX = building.code instanceof BuildingCode ? (<BuildingCode>building.code).toValue() : building.code;

        const query = { code: idX };
        const buildingDocument = await this.buildingSchema.findOne(query as FilterQuery<IBuildingPersistence & Document>);

        return !!buildingDocument === true;
    }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async save(building: Building): Promise<Building> {
        const query = { code: building.code.toString() };

        const buildingDocument = await this.buildingSchema.findOne(query);

        try {
            if (buildingDocument === null) {
                const rawBuilding: any = BuildingMap.toPersistence(building);

                const buildingCreated = await this.buildingSchema.create(rawBuilding);

                return BuildingMap.toDomain(buildingCreated);
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    public async update(building: Building): Promise<Building> {
        const query = { code: building.code.toString() };

        try {
            const rawBuilding: IBuildingPersistence = BuildingMap.toPersistence(building);

            await this.buildingSchema.updateOne(query, rawBuilding);
        } catch (err) {
            throw err;
        }

        return building;
    }

    public async findByCode(buildingCode: BuildingCode | string): Promise<Building> {
        const query = { code: buildingCode.toString() };
        const buildingRecord = await this.buildingSchema.findOne(query).lean();

        if (buildingRecord != null) {
            return BuildingMap.toDomain(buildingRecord);
        } else {
            return null;
        }
    }

    public async findFloor(buildingCode: BuildingCode | string, floorNumber: number): Promise<Floor> {
        const query = { code: buildingCode.toString(), 'floors.number': floorNumber };
        const buildingRecord = await this.buildingSchema.findOne(query, { 'floors.$': 1 }).lean();

        if (buildingRecord != null && buildingRecord.floors && buildingRecord.floors.length > 0) {
            return FloorMap.toDomain(buildingRecord.floors[0]);
        } else {
            return null;
        }
    }

    public async findElevator(buildingCode: BuildingCode | string): Promise<Elevator> {
        const query = { code: buildingCode.toString() };
        const elevatorRecord = (await this.buildingSchema.findOne(query).lean()).elevator;

        if (elevatorRecord != null) {
            elevatorRecord.floors.sort((a, b) => a.number - b.number);
            return ElevatorMap.toDomain(elevatorRecord);
        } else {
            return null;
        }
    }

    public async findBuildingsBetweenMinAndMaxFloors(numMinFloors: number, numMaxFloors: number): Promise<any> {

        const buildings = await this.buildingSchema.aggregate([
            {
                $project: {
                    // Campos a selecionar
                    code: 1,
                    name: 1,
                    description: 1,
                    numXCells: 1,
                    numYCells: 1,
                    hasElevator: {
                        $cond: { // Verificar se o edifício tem elevador
                            if: {
                                $eq: ['$elevator', null]
                            },
                            then: false,
                            else: true
                        }
                    },
                    numFloors: {
                        $size: '$floors'
                    } // Tamanho do array 'floors'
                }
            },
            {
                $match: {
                    numFloors: { // Aplicar as condições com o valor de 'numFloors'
                        $gte: numMinFloors,
                        $lte: numMaxFloors
                    }
                }
            }
        ]);

        if (buildings != null) {
            return buildings;
        } else {
            return null;
        }

    }

    public async findAll(): Promise<Building[]> {
        const buildings = await this.buildingSchema.aggregate([
            {
                $project: {
                    // Campos a selecionar
                    code: 1,
                    name: 1,
                    description: 1,
                    numXCells: 1,
                    numYCells: 1,
                    hasElevator: {
                        $cond: { // Verificar se o edifício tem elevador
                            if: {
                                $eq: ['$elevator', null]
                            },
                            then: false,
                            else: true
                        }
                    },
                    numFloors: {
                        $size: '$floors'
                    } // Tamanho do array 'floors'
                }
            }
        ]);

        if (buildings != null) {
            return buildings;
        } else {
            return null;
        }
    }

    public async findAllBuildings(): Promise<Building[]> {
        const buildingsSchemas = await this.buildingSchema.find().lean();
        
        let buildings: Building[] = [];

        buildingsSchemas.forEach(buildingS => {
            buildings.push(BuildingMap.toDomain(buildingS))
        });

        if (buildings !== null) {
            return buildings;
        } else {
            return null;
        }
    }

    public async findRoom(buildingCode: string, roomName: string): Promise<Room> {
        const buildingRecords = await this.buildingSchema.findOne({ code: buildingCode }).lean();

        if (buildingRecords != null) {
            const room = buildingRecords.floors
                .map((floor) => floor.rooms.find((room) => room.name === roomName))
                .find((room) => room !== undefined);

            if (!room) {
                return null;
            }

            return RoomMap.toDomain(room);
        }
        return null;
    }

}