import { Service, Inject } from 'typedi';

import IPassagewayRepo from "../services/IRepos/IPassagewayRepo";
import { Passageway } from "../domain/building/passageway";
import { PassagewayCode } from "../domain/building/passagewayCode";
import { PassagewayMap } from "../mappers/PassagewayMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IPassagewayPersistence } from '../dataschema/IPassagewayPersistence';

@Service()
export default class PassagewayRepo implements IPassagewayRepo {
    private models: any;

    constructor(
        @Inject('passagewaySchema') private passagewaySchema: Model<IPassagewayPersistence & Document>,
    ) { }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async exists(passageway: Passageway): Promise<boolean> {
        const idX = passageway.code instanceof PassagewayCode ? (<PassagewayCode>passageway.code).toValue() : passageway.code;

        const query = { code: idX };
        const passagewayDocument = await this.passagewaySchema.findOne(query as FilterQuery<IPassagewayPersistence & Document>);

        return !!passagewayDocument === true;
    }

    public async save(passageway: Passageway): Promise<Passageway> {
        const query = { code: passageway.code.toString() };

        const passagewayDocument = await this.passagewaySchema.findOne(query);

        try {
            if (passagewayDocument === null) {
                const rawPassageway: any = PassagewayMap.toPersistence(passageway);

                const passagewayCreated = await this.passagewaySchema.create(rawPassageway);

                return PassagewayMap.toDomain(passagewayCreated);
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    public async update(passageway: Passageway): Promise<Passageway> {
        const query = { code: passageway.code.toString() };

        const passagewayDocument = await this.passagewaySchema.findOne(query);

        try {
            if (passagewayDocument === null) {
                return null;
            } else {
                passagewayDocument.building1 = passageway.building1.code ? passageway.building1.code.toString() : passageway.building1.toString();
                passagewayDocument.building2 = passageway.building2.code ? passageway.building2.code.toString() : passageway.building2.toString();
                passagewayDocument.floor1 = !isNaN(passageway.floor1.number) ? passageway.floor1.number : Number(passageway.floor1);
                passagewayDocument.floor2 = !isNaN(passageway.floor2.number) ? passageway.floor2.number : Number(passageway.floor2);
                passagewayDocument.cellOrientation = passageway.cellOrientation ? passageway.cellOrientation.toString() : '';
                passagewayDocument.xStartCell = passageway.xStartCell && !isNaN(passageway.xStartCell.position)
                    ? passageway.xStartCell.position
                    : passageway.xStartCell
                        ? Number(passageway.xStartCell)
                        : null;
                passagewayDocument.yStartCell = passageway.yStartCell && !isNaN(passageway.yStartCell.position)
                    ? passageway.yStartCell.position
                    : passageway.yStartCell
                        ? Number(passageway.yStartCell)
                        : null;

                await passagewayDocument.save();

                return passageway;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findByCode(passagewayCode: string): Promise<Passageway> {
        const query = { code: passagewayCode };
        const passagewayRecord = await this.passagewaySchema.findOne(query).lean();

        if (passagewayRecord != null) {
            return PassagewayMap.toDomain(passagewayRecord);
        } else {
            return null;
        }
    }

    public async findPassageway(buildingCode1: string, floorNumber1: number, buildingCode2: string, floorNumber2: number): Promise<Passageway> {
        const query = { building1: buildingCode1, floor1: floorNumber1, building2: buildingCode2, floor2: floorNumber2 };
        const passagewayRecord = (await this.passagewaySchema.findOne(query).lean());

        if (passagewayRecord) {
            return PassagewayMap.toDomain(passagewayRecord);
        } else {
            return null;
        }
    }

    public async findAllPassageways(building1?: string, building2?: string): Promise<Passageway[]> {
        let passageways;
        if (building1 && building2) {

            passageways = await this.passagewaySchema.find({
                building1: building1,
                building2: building2
            }).lean();

        } else {
            passageways = await this.passagewaySchema.find().lean();
        }

        const allPassageways: Passageway[] = [];
        passageways.forEach(passageway => {
            allPassageways.push(PassagewayMap.toDomain(passageway));
        });

        if (allPassageways) {
            return allPassageways;
        } else {
            return null;
        }
    }

    public async findPassagewayWithBuilding(buildingCode: string): Promise<Passageway[]> {
        const query = { building1: buildingCode };

        const passageways = await this.passagewaySchema.find(query).lean();

        if (passageways) {
            const allPassageways: Passageway[] = passageways.map((passageway) => PassagewayMap.toDomain(passageway));
            return allPassageways;
        } else {
            return null;
        }
    }

    public async findFloorPassageways(buildingCode: string, floorNumber: number): Promise<Passageway[]> {
        const query = { building1: buildingCode, floor1: floorNumber };

        const passageways = await this.passagewaySchema.find(query).lean();

        if (passageways) {
            const allPassageways: Passageway[] = passageways.map((passageway) => PassagewayMap.toDomain(passageway));
            return allPassageways;
        } else {
            return null;
        }
    }

}
