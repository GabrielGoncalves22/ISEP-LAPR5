import { expect } from 'chai';
import { UserTaxPayerNumber } from '../../../../src/domain/user/userTaxPayerNumber';

describe('userTaxPayerNumber value object', () => {
    it('can create a valid UserTaxPayerNumber object', () => {
        const taxPayerNumber = UserTaxPayerNumber.create('123456789');

        expect(taxPayerNumber.isSuccess).to.be.true;
        expect(taxPayerNumber.getValue().taxPayerNumber).to.be.equal('123456789');
    });

    it('should fail to create a UserTaxPayerNumber object with non-numeric value', () => {
        const taxPayerNumber = UserTaxPayerNumber.create('abcd1234');

        expect(taxPayerNumber.isFailure).to.be.true;
        expect(taxPayerNumber.error).to.be.equal('TaxPayerNumber is not valid');
    });

    it('should fail to create a UserTaxPayerNumber object with invalid length', () => {
        const taxPayerNumber = UserTaxPayerNumber.create('12345');

        expect(taxPayerNumber.isFailure).to.be.true;
        expect(taxPayerNumber.error).to.be.equal('TaxPayerNumber is not valid');
    });

    it('should fail to create a UserTaxPayerNumber object with null value', () => {
        const taxPayerNumber = UserTaxPayerNumber.create(null as any);

        expect(taxPayerNumber.isFailure).to.be.true;
        expect(taxPayerNumber.error).to.be.equal('TaxPayerNumber is null or undefined.');
    });

    it('should fail to create a UserTaxPayerNumber object with undefined value', () => {
        const taxPayerNumber = UserTaxPayerNumber.create(undefined as any);

        expect(taxPayerNumber.isFailure).to.be.true;
        expect(taxPayerNumber.error).to.be.equal('TaxPayerNumber is null or undefined.');
    });
});
