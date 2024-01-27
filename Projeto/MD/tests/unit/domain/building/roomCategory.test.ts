import { expect } from 'chai';

import { RoomCategory } from '../../../../src/domain/building/roomCategory';

describe('roomCategory enum', () => {
    it('should have Gabinete defined', () => {
        expect(RoomCategory).to.have.property('Gabinete');
    });

    it('should have Anfiteatro defined', () => {
        expect(RoomCategory).to.have.property('Anfiteatro');
    });

    it('should have Laboratório defined', () => {
        expect(RoomCategory).to.have.property('Laboratório');
    });

    it('should have Outro defined', () => {
        expect(RoomCategory).to.have.property('Outro');
    });
});
