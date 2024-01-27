import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IPassagewayPersistence } from '../dataschema/IPassagewayPersistence';

import IPassagewayDTO from "../dto/IPassagewayDTO";
import { Passageway } from "../domain/building/passageway";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class PassagewayMap extends Mapper<Passageway> {

    public static toDTO(passageway: Passageway): IPassagewayDTO {
        return {
            code: passageway.code.toString(),
            building1: passageway.building1.code ? passageway.building1.code.toString() : passageway.building1,
            floor1: passageway.floor1.number ? passageway.floor1.number : passageway.floor1,
            building2: passageway.building2.code ? passageway.building2.code.toString() : passageway.building2,
            floor2: passageway.floor2.number ? passageway.floor2.number : passageway.floor2
        } as IPassagewayDTO;
    }

    public static toDomain(passageway: any | Model<IPassagewayPersistence & Document>): Passageway {
        const passagewayOrError = Passageway.create(
            passageway,
            new UniqueEntityID(passageway.domainId)
        );

        passagewayOrError.isFailure ? console.log(passagewayOrError.error) : '';

        return passagewayOrError.isSuccess ? passagewayOrError.getValue() : null;
    }

    public static toPersistence(passageway: Passageway): any {
        return {
            code: passageway.code.toString(),
            building1: passageway.building1.code.toString(),
            floor1: passageway.floor1.number,
            building2: passageway.building2.code.toString(),
            floor2: passageway.floor2.number,
            cellOrientation: passageway.cellOrientation ? passageway.cellOrientation.toString() : null,
            xStartCell: passageway.xStartCell ? passageway.xStartCell.position : null,
            yStartCell: passageway.yStartCell ? passageway.yStartCell.position : null
        }
    }
}