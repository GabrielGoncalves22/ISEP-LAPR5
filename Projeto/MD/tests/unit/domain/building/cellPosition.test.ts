import { expect } from 'chai';

import { CellPosition } from '../../../../src/domain/building/cellPosition';

describe('cellPosition value object', () => {
    it('can create a valid cell position object', () => {
        const cellPosition = CellPosition.create(10);

        expect(cellPosition.isSuccess).to.be.true;
        expect(cellPosition.getValue().position).to.be.equal(10);
    });

    it('can create a cell position object with zero cells', () => {
        const cellPosition = CellPosition.create(0);

        expect(cellPosition.isSuccess).to.be.true;
        expect(cellPosition.getValue().position).to.be.equal(0);
    });

    it('should fail to create a cell position object with negative cells', () => {
        const cellPosition = CellPosition.create(-1);

        expect(cellPosition.isFailure).to.be.true;
        expect(cellPosition.error).to.be.equal('The cell position cannot be less than 0.');
    });
});
