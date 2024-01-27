import { expect } from 'chai';

import { ElevatorBrand } from '../../../../src/domain/building/elevatorBrand';

describe('elevatorBrand value object', () => {
    it('can create a valid elevator brand object', () => {
        const brand = ElevatorBrand.create('Schindler');

        expect(brand.isSuccess).to.be.true;
        expect(brand.getValue().brand).to.be.equal('Schindler');
    });

    it('can create an elevator brand with an empty string', () => {
        const brand = ElevatorBrand.create('');

        expect(brand.isSuccess).to.be.true;
        expect(brand.getValue().brand).to.be.equal('');
    });

    it('should fail to create an elevator brand object with brand exceeding maximum characters', () => {
        const brand = ElevatorBrand.create('A'.repeat(51));

        expect(brand.isFailure).to.be.true;
        expect(brand.error).to.be.equal('The elevator brand cannot have more than 50 characters.');
    });

    it('should return the correct brand in toString()', () => {
        const brand = ElevatorBrand.create('Schindler').getValue();

        expect(brand.toString()).to.be.equal('Schindler');
    });
});
