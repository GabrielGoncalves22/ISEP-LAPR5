import { expect } from 'chai';

import { UserEmail } from '../../../../src/domain/user/userEmail';

describe('userEmail value object', () => {
    it('can create a valid UserEmail object', () => {
        const email = UserEmail.create('user@isep.ipp.pt');

        console.log(email.errorValue());

        expect(email.isSuccess).to.be.true;
        expect(email.getValue().email).to.be.equal('user@isep.ipp.pt');
    });

    it('should fail to create a UserEmail object with invalid domain', () => {
        const email = UserEmail.create('user@example.com');

        expect(email.isFailure).to.be.true;
        expect(email.error).to.be.equal('Email is not valid or does not belong to the domain isep.ipp.pt');
    });

    it('should fail to create a UserEmail object with null value', () => {
        const email = UserEmail.create(null as any);

        expect(email.isFailure).to.be.true;
        expect(email.error).to.be.equal('Email is null or undefined.');
    });

    it('should fail to create a UserEmail object with undefined value', () => {
        const email = UserEmail.create(undefined as any);

        expect(email.isFailure).to.be.true;
        expect(email.error).to.be.equal('Email is null or undefined.');
    });
});
