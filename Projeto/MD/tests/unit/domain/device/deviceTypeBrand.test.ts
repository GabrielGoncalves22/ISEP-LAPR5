import { expect } from 'chai';

import { DeviceTypeBrand } from '../../../../src/domain/device/deviceTypeBrand';

describe('deviceTypeBrand value object', () => {
    it('can create a valid device type brand object', () => {
        const brand = DeviceTypeBrand.create('Xiamoi');

        expect(brand.isSuccess).to.be.true;
        expect(brand.getValue().brand).to.be.equal('Xiamoi');
    });

    it('should fail to create a device type brand object with brand exceeding maximum characters', () => {
        const brand = DeviceTypeBrand.create('A'.repeat(51));

        expect(brand.isFailure).to.be.true;
        expect(brand.error).to.be.equal('The brand cannot have more than 50 characters.');
    });

    it('should return the correct brand in toString()', () => {
        const brand = DeviceTypeBrand.create('Xiamoi').getValue();

        expect(brand.toString()).to.be.equal('Xiamoi');
    });
});
