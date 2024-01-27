import { expect } from 'chai';

import { BuildingCode } from '../../../../src/domain/building/buildingCode';

describe('buildingCode value object', () => {
    it('can create a valid code object', () => {
        const code = BuildingCode.create('I');

        expect(code.isSuccess).to.be.true;
    });

    it('should fail to create a code object with code exceeding maximum characters', () => {
        const code = BuildingCode.create('A'.repeat(6));

        expect(code.isFailure).to.be.true;
        expect(code.error).to.be.equal('The building code cannot have more than 5 characters.');
    });

    it('should return the correct code in toString()', () => {
        const code = BuildingCode.create('I').getValue();

        expect(code.toString()).to.be.equal('I');
    });
});