import { expect } from 'chai';

import { PassagewayCode } from '../../../../src/domain/building/passagewayCode';

describe('passagewayCode value object', () => {
    it('can create a valid code object', () => {
        const code = PassagewayCode.create('I', 1, 'Q', 2);

        expect(code.isSuccess).to.be.true;
    });

    it('should return the correct code in toString()', () => {
        const code = PassagewayCode.create('I', 1, 'Q', 2).getValue();

        expect(code.toString()).to.be.equal('I1-Q2');
    });
});