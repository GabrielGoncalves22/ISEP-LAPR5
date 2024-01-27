import { expect } from 'chai';

import { UniqueEntityID } from '../../../../src/core/domain/UniqueEntityID';
import { BuildingCode } from '../../../../src/domain/building/buildingCode';
import { BuildingName } from '../../../../src/domain/building/buildingName';
import { Description } from '../../../../src/domain/building/description';
import { BuildingDimension } from '../../../../src/domain/building/buildingDimension';
import { Building } from '../../../../src/domain/building/building';
import { PassagewayCode } from '../../../../src/domain/building/passagewayCode';
import { Floor } from '../../../../src/domain/building/floor';
import { Passageway } from '../../../../src/domain/building/passageway';
import { CellOrientation } from '../../../../src/domain/building/cellOrientation';

describe('passageway entity', () => {
    const building1 = Building.create({
        code: BuildingCode.create('B').getValue(),
        name: BuildingName.create('Edifício B').getValue(),
        description: Description.create('Edifício para comércio').getValue(),
        numXCells: BuildingDimension.create(10).getValue(),
        numYCells: BuildingDimension.create(10).getValue(),
        floors: [],
        elevator: null as any,
    }).getValue();

    const building2 = Building.create({
        code: BuildingCode.create('Q').getValue(),
        name: BuildingName.create('Edifício Q').getValue(),
        description: Description.create('Edifício para transporte').getValue(),
        numXCells: BuildingDimension.create(10).getValue(),
        numYCells: BuildingDimension.create(10).getValue(),
        floors: [],
        elevator: null as any,
    }).getValue();

    const floor1 = Floor.create({
        number: 1,
        description: Description.create('1º Piso').getValue(),
        rooms: [],
        map: [],
        elevatorCellOrientation: CellOrientation.north
    }).getValue();

    const floor2 = Floor.create({
        number: 2,
        description: Description.create('2º Piso').getValue(),
        rooms: [],
        map: [],
        elevatorCellOrientation: CellOrientation.north
    }).getValue();

    it('can create a valid passageway object', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: building1,
            floor1: floor1,
            building2: building2,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isSuccess).to.be.true;

        const passageway = passagewayResult.getValue();
        expect(passageway.code.toString()).to.deep.equal('B1-Q2');
        expect(passageway.building1).to.deep.equal(building1);
        expect(passageway.floor1).to.deep.equal(floor1);
        expect(passageway.building2).to.deep.equal(building2);
        expect(passageway.floor2).to.deep.equal(floor2);
    });

    it('should fail to create a passageway object without null code', () => {
        const passagewayProps = {
            code: null as any,
            building1: building1,
            floor1: floor1,
            building2: building2,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Code is null or undefined.');
    });

    it('should fail to create a passageway object without undefined code', () => {
        const passagewayProps = {
            code: undefined as any,
            building1: building1,
            floor1: floor1,
            building2: building2,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Code is null or undefined.');
    });

    it('should fail to create a passageway object without null building1', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: null as any,
            floor1: floor1,
            building2: building2,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Building1 is null or undefined.');
    });

    it('should fail to create a passageway object without undefined building1', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: undefined as any,
            floor1: floor1,
            building2: building2,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Building1 is null or undefined.');
    });

    it('should fail to create a passageway object without null floor1', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: building1,
            floor1: null as any,
            building2: building2,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Floor1 is null or undefined.');
    });

    it('should fail to create a passageway object without undefined floor1', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: building1,
            floor1: undefined as any,
            building2: building2,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Floor1 is null or undefined.');
    });

    it('should fail to create a passageway object without null building2', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: building1,
            floor1: floor1,
            building2: null as any,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Building2 is null or undefined.');
    });

    it('should fail to create a passageway object without undefined building2', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: building1,
            floor1: floor1,
            building2: undefined as any,
            floor2: floor2,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Building2 is null or undefined.');
    });

    it('should fail to create a passageway object without null floor2', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: building1,
            floor1: floor1,
            building2: building2,
            floor2: null as any,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Floor2 is null or undefined.');
    });

    it('should fail to create a passageway object without undefined floor2', () => {
        const passagewayProps = {
            code: PassagewayCode.create(building1.code.toString(), floor1.number, building2.code.toString(), floor2.number).getValue(),
            building1: building1,
            floor1: floor1,
            building2: building2,
            floor2: undefined as any,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const passagewayResult = Passageway.create(passagewayProps, new UniqueEntityID());

        expect(passagewayResult.isFailure).to.be.true;
        expect(passagewayResult.error).to.equal('Floor2 is null or undefined.');
    });
});
