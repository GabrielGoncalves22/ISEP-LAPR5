import { expect } from 'chai';

import { UniqueEntityID } from '../../../../src/core/domain/UniqueEntityID';
import { Elevator } from '../../../../src/domain/building/elevator';
import { ElevatorBrand } from '../../../../src/domain/building/elevatorBrand';
import { ElevatorModel } from '../../../../src/domain/building/elevatorModel';
import { ElevatorSerialNumber } from '../../../../src/domain/building/elevatorSerialNumber';
import { Description } from '../../../../src/domain/building/description';
import { Floor } from '../../../../src/domain/building/floor';
import { CellOrientation } from '../../../../src/domain/building/cellOrientation';

describe('elevator entity', () => {
    it('can create a valid elevator object', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevatorResult = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevatorResult.isSuccess).to.be.true;

        const elevator = elevatorResult.getValue();
        expect(elevator.brand).to.deep.equal(ElevatorBrand.create('Schindler').getValue());
        expect(elevator.model).to.deep.equal(ElevatorModel.create('Thyssenkrupp').getValue());
        expect(elevator.serialNumber).to.deep.equal(ElevatorSerialNumber.create('6007041A2').getValue());
        expect(elevator.description).to.deep.equal(Description.create('Elevator para servir o edifício I').getValue());
        expect(elevator.floors).to.have.lengthOf(2);
        expect(elevator.floors[0]).to.include({ number: 1 });
        expect(elevator.floors[1]).to.include({ number: 2 });
    });

    it('should fail to create an elevator object without null floors', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: null as any,
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isFailure).to.be.true;
        expect(elevator.error).to.equal('Floors is null or undefined.');
    });

    it('can create a valid elevator object with null brand', () => {
        const elevatorProps = {
            brand: null as any,
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });

    it('can create a valid elevator object with undefined brand', () => {
        const elevatorProps = {
            brand: undefined as any,
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });

    it('can create a valid elevator object with null model', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: null as any,
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });

    it('can create a valid elevator object with undefined model', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: undefined as any,
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });

    it('can create a valid elevator object with null serial number', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: null as any,
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });

    it('can create a valid elevator object with undefined serial number', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: undefined as any,
            description: Description.create('Elevator para servir o edifício I').getValue(),
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });

    it('can create a valid elevator object with null description', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: null as any,
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });

    it('can create a valid elevator object with undefined description', () => {
        const elevatorProps = {
            brand: ElevatorBrand.create('Schindler').getValue(),
            model: ElevatorModel.create('Thyssenkrupp').getValue(),
            serialNumber: ElevatorSerialNumber.create('6007041A2').getValue(),
            description: undefined as any,
            floors: [
                Floor.create({ number: 1, description: Description.create('Piso de ferramentas').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue(),
                Floor.create({ number: 2, description: Description.create('Piso de materiais').getValue(), rooms: [], map: [], elevatorCellOrientation: CellOrientation.north }).getValue()
            ],
            cellOrientation: null as any,
            xStartCell: null as any,
            yStartCell: null as any
        };

        const elevator = Elevator.create(elevatorProps, new UniqueEntityID());

        expect(elevator.isSuccess).to.be.true;
    });
});

