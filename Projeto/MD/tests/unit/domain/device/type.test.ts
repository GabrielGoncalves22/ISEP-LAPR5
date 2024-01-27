import { expect } from 'chai';

import { Type } from '../../../../src/domain/device/type';

describe('type value object', () => {
    it('can create a valid Type object', () => {
        const type = Type.create('Robot');

        expect(type.isSuccess).to.be.true;
        expect(type.getValue().type).to.be.equal('Robot');
    });

    it('should fail to create a Type object with type exceeding maximum characters', () => {
        const type = Type.create('A'.repeat(26));

        expect(type.isFailure).to.be.true;
        expect(type.error).to.be.equal('The type cannot have more than 25 characters.');
    });

    it('should return the correct type in toString()', () => {
        const type = Type.create('Robot').getValue();

        expect(type.toString()).to.be.equal('Robot');
    });
});
