import { expect } from 'chai';

import { DeviceSerialNumber } from '../../../../src/domain/device/deviceSerialNumber';

describe('deviceSerialNumber value object', () => {
    it('can create a valid device serial number object', () => {
        const serialNumber = DeviceSerialNumber.create('456789');

        expect(serialNumber.isSuccess).to.be.true;
        expect(serialNumber.getValue().value).to.be.equal('456789');
    });

    it('should fail to create a device serial number object with serial number exceeding maximum characters', () => {
        const serialNumber = DeviceSerialNumber.create('A'.repeat(51));

        expect(serialNumber.isFailure).to.be.true;
        expect(serialNumber.error).to.be.equal('The serial number cannot have more than 50 characters.');
    });

    it('should return the correct serial number in toString()', () => {
        const serialNumber = DeviceSerialNumber.create('456789').getValue();

        expect(serialNumber.toString()).to.be.equal('456789');
    });
});
