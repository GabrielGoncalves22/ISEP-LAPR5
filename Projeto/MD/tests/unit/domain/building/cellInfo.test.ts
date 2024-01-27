import { expect } from 'chai';

import { CellInfo } from '../../../../src/domain/building/cellInfo';

describe('cellInfo value object', () => {
    it('can create a valid cell info object', () => {
        const cellInfo = CellInfo.create(1);

        expect(cellInfo.isSuccess).to.be.true;
        expect(cellInfo.getValue().type).to.be.equal(1);
    });

    it('should fail to create a cell info object with higher boundary', () => {
        const cellInfo = CellInfo.create(4);

        expect(cellInfo.isFailure).to.be.true;
        expect(cellInfo.error).to.be.equal('The cell type is not within range 0 to 3.');
    });

    it('should fail to create a cell info object with lower boundary', () => {
        const cellInfo = CellInfo.create(-1);

        expect(cellInfo.isFailure).to.be.true;
        expect(cellInfo.error).to.be.equal('The cell type is not within range 0 to 3.');
    });
});
