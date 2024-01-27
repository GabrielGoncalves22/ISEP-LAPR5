import { expect } from 'chai';

import { BuildingName } from '../../../../src/domain/building/buildingName';

describe('buildingName value object', () => {
    it('can create a valid name object', () => {
        const name = BuildingName.create('Edifício de informática');

        expect(name.isSuccess).to.be.true;
        expect(name.getValue().name).to.be.equal('Edifício de informática');
    });

    it('can create a name empty', () => {
        const name = BuildingName.create('');

        expect(name.isSuccess).to.be.true;
        expect(name.getValue().name).to.be.equal('');
    });

    it('should fail to create a name object with name exceeding maximum characters', () => {
        const name = BuildingName.create('A'.repeat(51));

        expect(name.isFailure).to.be.true;
        expect(name.error).to.be.equal('The name of the building cannot have more than 50 characters.');
    });

    it('should return the correct name in toString()', () => {
        const name = BuildingName.create('Edifício de informática').getValue();

        expect(name.toString()).to.be.equal('Edifício de informática');
    });
});
