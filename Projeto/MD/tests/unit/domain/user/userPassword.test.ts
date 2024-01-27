import { expect } from 'chai';

import { UserPassword } from '../../../../src/domain/user/userPassword';

describe('userPassword value object', () => {
    it('should create a user password object with valid password', () => {
        const password = UserPassword.create({ password: 'ValidPassword123', hashed: false });

        expect(password.isSuccess).to.be.true;
        expect(password.getValue().password).to.equal('ValidPassword123');
    });

    it('should fail to create a user password object with null password', () => {
        const password = UserPassword.create({ password: null as any });

        expect(password.isFailure).to.be.true;
        expect(password.error).to.equal('Password is null or undefined.');
    });

    it('should fail to create a user password object with undefined password', () => {
        const password = UserPassword.create({ password: undefined as any });

        expect(password.isFailure).to.be.true;
        expect(password.error).to.equal('Password is null or undefined.');
    });

    it('should fail to create a user password object with too short password', () => {
        const password = UserPassword.create({ password: 'Short1' });

        expect(password.isFailure).to.be.true;
        expect(password.error).to.equal('Password doesnt meet criteria [1 uppercase, 1 lowercase, 1 digit, 1 symbol and 10 chars min].');
    });
});