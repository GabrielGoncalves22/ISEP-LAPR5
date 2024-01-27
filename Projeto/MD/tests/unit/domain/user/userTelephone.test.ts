import { expect } from 'chai';
import { UserTelephone } from '../../../../src/domain/user/userTelephone';

describe('userTelephone value object', () => {
    it('can create a valid UserTelephone object', () => {
        const telephone = UserTelephone.create('912345678');

        expect(telephone.isSuccess).to.be.true;
        expect(telephone.getValue().number).to.be.equal('912345678');
    });

    it('should fail to create a UserTelephone object with invalid number', () => {
        const telephone = UserTelephone.create('123456789');

        expect(telephone.isFailure).to.be.true;
        expect(telephone.error).to.be.equal('Telephone is not valid');
    });

    it('should fail to create a UserTelephone object with null value', () => {
        const telephone = UserTelephone.create(null as any);

        expect(telephone.isFailure).to.be.true;
        expect(telephone.error).to.be.equal('Telephone is null or undefined.');
    });

    it('should fail to create a UserTelephone object with undefined value', () => {
        const telephone = UserTelephone.create(undefined as any);

        expect(telephone.isFailure).to.be.true;
        expect(telephone.error).to.be.equal('Telephone is null or undefined.');
    });
});
