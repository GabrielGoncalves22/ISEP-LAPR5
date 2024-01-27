import { expect } from 'chai';

import { RoomName } from '../../../../src/domain/building/roomName';

describe('roomName value object', () => {
    it('can create a valid name object', () => {
        const name = RoomName.create('Sala 101');

        expect(name.isSuccess).to.be.true;
        expect(name.getValue().name).to.be.equal('Sala 101');
    });

    it('can create an empty name object', () => {
        const name = RoomName.create('');

        expect(name.isSuccess).to.be.true;
        expect(name.getValue().name).to.be.equal('');
    });

    it('should fail to create a name object with a name exceeding maximum characters', () => {
        const name = RoomName.create('A'.repeat(51));

        expect(name.isFailure).to.be.true;
        expect(name.error).to.be.equal('The name of the room cannot have more than 50 characters.');
    });

    it('should return the correct name in toString()', () => {
        const name = RoomName.create('Sala 101').getValue();

        expect(name.toString()).to.be.equal('Sala 101');
    });
});
