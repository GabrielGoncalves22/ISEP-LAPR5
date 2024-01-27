import { expect } from 'chai';

import { UniqueEntityID } from '../../../../src/core/domain/UniqueEntityID';
import { Room } from '../../../../src/domain/building/room';
import { RoomCategory } from '../../../../src/domain/building/roomCategory';
import { RoomName } from '../../../../src/domain/building/roomName';
import { Description } from '../../../../src/domain/building/description';

describe('room entity', () => {
    it('can create a valid room object', () => {
        const roomProps = {
            name: RoomName.create('I102').getValue(),
            description: Description.create('Sala para aulas práticas').getValue(),
            category: RoomCategory.Laboratório,
            xStartCell: null as any,
            yStartCell: null as any,
            xEndCell: null as any,
            yEndCell: null as any,
            doors: []
        };

        const roomResult = Room.create(roomProps, new UniqueEntityID());

        expect(roomResult.isSuccess).to.be.true;

        const room = roomResult.getValue();
        expect(room.name).to.deep.equal(RoomName.create('I102').getValue());
        expect(room.description).to.deep.equal(Description.create('Sala para aulas práticas').getValue());
        expect(room.category).to.equal(RoomCategory.Laboratório);
    });

    it('should fail to create a room object without a null name', () => {
        const roomProps = {
            name: null as any,
            description: Description.create('Sala para aulas práticas').getValue(),
            category: RoomCategory.Laboratório,
            xStartCell: null as any,
            yStartCell: null as any,
            xEndCell: null as any,
            yEndCell: null as any,
            doors: []
        };

        const roomResult = Room.create(roomProps, new UniqueEntityID()); ~

            expect(roomResult.isFailure).to.be.true;
        expect(roomResult.error).to.equal('Name is null or undefined.');
    });

    it('should fail to create a room object without a undefined name', () => {
        const roomProps = {
            name: undefined as any,
            description: Description.create('Sala para aulas práticas').getValue(),
            category: RoomCategory.Laboratório,
            xStartCell: null as any,
            yStartCell: null as any,
            xEndCell: null as any,
            yEndCell: null as any,
            doors: []
        };

        const roomResult = Room.create(roomProps, new UniqueEntityID());

        expect(roomResult.isFailure).to.be.true;
        expect(roomResult.error).to.equal('Name is null or undefined.');
    });

    it('should fail to create a room object without a null description', () => {
        const roomProps = {
            name: RoomName.create('I102').getValue(),
            description: null as any,
            category: RoomCategory.Laboratório,
            xStartCell: null as any,
            yStartCell: null as any,
            xEndCell: null as any,
            yEndCell: null as any,
            doors: []
        };

        const roomResult = Room.create(roomProps, new UniqueEntityID());

        expect(roomResult.isFailure).to.be.true;
        expect(roomResult.error).to.equal('Description is null or undefined.');
    });

    it('should fail to create a room object without a undefined description', () => {
        const roomProps = {
            name: RoomName.create('I102').getValue(),
            description: undefined as any,
            category: RoomCategory.Laboratório,
            xStartCell: null as any,
            yStartCell: null as any,
            xEndCell: null as any,
            yEndCell: null as any,
            doors: []
        };

        const roomResult = Room.create(roomProps, new UniqueEntityID());

        expect(roomResult.isFailure).to.be.true;
        expect(roomResult.error).to.equal('Description is null or undefined.');
    });

    it('should fail to create a room object without a null category', () => {
        const roomProps = {
            name: RoomName.create('I102').getValue(),
            description: Description.create('Sala para aulas práticas').getValue(),
            category: null as any,
            xStartCell: null as any,
            yStartCell: null as any,
            xEndCell: null as any,
            yEndCell: null as any,
            doors: []
        };

        const roomResult = Room.create(roomProps, new UniqueEntityID());

        expect(roomResult.isFailure).to.be.true;
        expect(roomResult.error).to.equal('Category is null or undefined.');
    });

    it('should fail to create a room object without a undefined category', () => {
        const roomProps = {
            name: RoomName.create('I102').getValue(),
            description: Description.create('Sala para aulas práticas').getValue(),
            category: undefined as any,
            xStartCell: null as any,
            yStartCell: null as any,
            xEndCell: null as any,
            yEndCell: null as any,
            doors: []
        };

        const roomResult = Room.create(roomProps, new UniqueEntityID());

        expect(roomResult.isFailure).to.be.true;
        expect(roomResult.error).to.equal('Category is null or undefined.');
    });

});
