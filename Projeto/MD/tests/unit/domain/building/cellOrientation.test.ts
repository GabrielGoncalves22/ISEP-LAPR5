import { expect } from 'chai';

import { CellOrientation } from '../../../../src/domain/building/cellOrientation';

describe('cellOrientation enum', () => {
    it('should have north defined', () => {
        expect(CellOrientation).to.have.property('north');
    });

    it('should have west defined', () => {
        expect(CellOrientation).to.have.property('west');
    });

    it('should have south defined', () => {
        expect(CellOrientation).to.have.property('south');
    });
});
