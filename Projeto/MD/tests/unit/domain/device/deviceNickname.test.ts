import { expect } from 'chai';

import { DeviceNickname } from '../../../../src/domain/device/deviceNickname';

describe('deviceNickname value object', () => {
    it('can create a valid device nickname object', () => {
        const nickname = DeviceNickname.create('Jason');

        expect(nickname.isSuccess).to.be.true;
        expect(nickname.getValue().value).to.be.equal('Jason');
    });

    it('should fail to create a device nickname object with nickname exceeding maximum characters', () => {
        const nickname = DeviceNickname.create('A'.repeat(31));

        expect(nickname.isFailure).to.be.true;
        expect(nickname.error).to.be.equal('The nickname cannot have more than 30 characters.');
    });

    it('should return the correct nickname in toString()', () => {
        const nickname = DeviceNickname.create('Jason').getValue();

        expect(nickname.toString()).to.be.equal('Jason');
    });
});
