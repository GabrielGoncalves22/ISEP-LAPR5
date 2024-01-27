import { expect } from 'chai';
import { UserName } from '../../../../src/domain/user/userName';

describe('userName value object', () => {
    it('can create a valid UserName object', () => {
        const userName = UserName.create('John Doe');

        expect(userName.isSuccess).to.be.true;
        expect(userName.getValue().name).to.be.equal('John Doe');
    });

    it('should fail to create a UserName object with null value', () => {
        const userName = UserName.create(null as any);

        expect(userName.isFailure).to.be.true;
        expect(userName.error).to.be.equal('Name is null or undefined.');
    });

    it('should fail to create a UserName object with undefined value', () => {
        const userName = UserName.create(undefined as any);

        expect(userName.isFailure).to.be.true;
        expect(userName.error).to.be.equal('Name is null or undefined.');
    });
});
