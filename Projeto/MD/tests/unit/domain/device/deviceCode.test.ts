import { expect } from 'chai';

import { DeviceCode } from '../../../../src/domain/device/deviceCode';

describe('deviceCode value object', () => {
    it('can create a valid code object', () => {
        const code = DeviceCode.create('I');

        expect(code.isSuccess).to.be.true;
    });

    it('should fail to create a code object with code exceeding maximum characters', () => {
        const code = DeviceCode.create('A'.repeat(31));

        expect(code.isFailure).to.be.true;
        expect(code.error).to.be.equal('The device code cannot have more than 30 characters.');
    });

    it('should return the correct code in toString()', () => {
        const code = DeviceCode.create('I').getValue();

        expect(code.toString()).to.be.equal('I');
    });
});