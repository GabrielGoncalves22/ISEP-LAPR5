import { expect } from 'chai';

import { BuildingDimension } from '../../../../src/domain/building/buildingDimension';

describe('buildingDimension value object', () => {
    it('can create a valid dimension object', () => {
        const dimension = BuildingDimension.create(10);

        expect(dimension.isSuccess).to.be.true;
        expect(dimension.getValue().numCells).to.be.equal(10);
    });

    it('should fail to create a dimension object with zero cells', () => {
        const dimension = BuildingDimension.create(0);

        expect(dimension.isFailure).to.be.true;
        expect(dimension.error).to.be.equal('The dimension of the building cannot be equals or less than 0.');
    });

    it('should fail to create a dimension object with negative cells', () => {
        const dimension = BuildingDimension.create(-5);

        expect(dimension.isFailure).to.be.true;
        expect(dimension.error).to.be.equal('The dimension of the building cannot be equals or less than 0.');
    });

    it('should return the correct dimension in toNumber()', () => {
        const dimension = BuildingDimension.create(15).getValue();

        expect(dimension.toNumber()).to.be.equal(15);
    });
});
