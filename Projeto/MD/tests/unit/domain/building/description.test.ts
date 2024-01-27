import { expect } from 'chai';

import { Description } from '../../../../src/domain/building/description';

describe('description value object', () => {
    it('can create a valid description object', () => {
        const description = Description.create('Edifício para os alunos de informática');

        expect(description.isSuccess).to.be.true;
        expect(description.getValue().description).to.be.equal('Edifício para os alunos de informática');
    });

    it('can create a description empty', () => {
        const description = Description.create('');

        expect(description.isSuccess).to.be.true;
        expect(description.getValue().description).to.be.equal('');
    });

    it('should fail to create a description object with description exceeding maximum characters', () => {
        const description = Description.create('A'.repeat(256));

        expect(description.isFailure).to.be.true;
        expect(description.error).to.be.equal('The description cannot have more than 255 characters.');
    });

    it('should return the correct description in toString()', () => {
        const description = Description.create('Edifício para os alunos de informática').getValue();

        expect(description.toString()).to.be.equal('Edifício para os alunos de informática');
    });
});
