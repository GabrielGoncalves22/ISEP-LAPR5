import { expect } from 'chai';

import { ElevatorSerialNumber } from '../../../../src/domain/building/elevatorSerialNumber';

describe('elevatorSerialNumber value object', () => {
    it('can create a valid elevator serial number object', () => {
        const serialNumber = ElevatorSerialNumber.create('6007041A2');

        expect(serialNumber.isSuccess).to.be.true;
        expect(serialNumber.getValue().serialNumber).to.be.equal('6007041A2');
    });

    it('can create an elevator serial number with an empty string', () => {
        const serialNumber = ElevatorSerialNumber.create('');

        expect(serialNumber.isSuccess).to.be.true;
        expect(serialNumber.getValue().serialNumber).to.be.equal('');
    });

    it('should fail to create an elevator serial number object with serial number exceeding maximum characters', () => {
        const serialNumber = ElevatorSerialNumber.create('A'.repeat(51));

        expect(serialNumber.isFailure).to.be.true;
        expect(serialNumber.error).to.be.equal('The elevator serial number cannot have more than 50 characters.');
    });

    it('should return the correct serial number in toString()', () => {
        const serialNumber = ElevatorSerialNumber.create('6007041A2').getValue();

        expect(serialNumber.toString()).to.be.equal('6007041A2');
    });
});
