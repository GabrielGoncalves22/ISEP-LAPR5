import { expect } from 'chai';

import { Floor } from '../../../../src/domain/building/floor';
import { Description } from '../../../../src/domain/building/description';
import { Room } from '../../../../src/domain/building/room';
import { RoomCategory } from '../../../../src/domain/building/roomCategory';
import { RoomName } from '../../../../src/domain/building/roomName';
import { CellOrientation } from '../../../../src/domain/building/cellOrientation';

describe('floor entity', () => {
    it('can create a valid Floor object', () => {
        const floorProps = {
            number: 1,
            description: Description.create('First Floor').getValue(),
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
                }).getValue()
            ],
            map: [],
            elevatorCellOrientation: CellOrientation.north
        };

        const floorResult = Floor.create(floorProps);

        expect(floorResult.isSuccess).to.be.true;
        const floor = floorResult.getValue();

        expect(floor.number).to.equal(1);
        expect(floor.description).to.deep.equal(Description.create('First Floor').getValue());
        expect(floor.rooms).to.have.lengthOf(1);
        expect(floor.rooms[0].name).to.deep.equal(RoomName.create('I102').getValue());
        expect(floor.rooms[0].description).to.deep.equal(Description.create('Sala para aulas práticas').getValue());
        expect(floor.rooms[0].category).to.equal(RoomCategory.Laboratório);
    });

    it('should fail to create a Floor object without a null number', () => {
        const floorProps = {
            number: null as any,
            description: Description.create('Second Floor').getValue(),
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
                }).getValue()
            ],
            map: [],
            elevatorCellOrientation: CellOrientation.north
        };

        const floor = Floor.create(floorProps);

        expect(floor.isFailure).to.be.true;
        expect(floor.error).to.equal('Number is null or undefined.');
    });

    it('should fail to create a Floor object without a undefined number', () => {
        const floorProps = {
            number: undefined as any,
            description: Description.create('Second Floor').getValue(),
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
                }).getValue()
            ],
            map: [],
            elevatorCellOrientation: CellOrientation.north
        };

        const floor = Floor.create(floorProps);

        expect(floor.isFailure).to.be.true;
        expect(floor.error).to.equal('Number is null or undefined.');
    });
});
