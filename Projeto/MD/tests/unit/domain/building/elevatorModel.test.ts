import { expect } from 'chai';

import { ElevatorModel } from '../../../../src/domain/building/elevatorModel';

describe('elevatorModel value object', () => {
    it('can create a valid elevator model object', () => {
        const elevatorModel = ElevatorModel.create('Thyssenkrupp');

        expect(elevatorModel.isSuccess).to.be.true;
        expect(elevatorModel.getValue().model).to.be.equal('Thyssenkrupp');
    });

    it('can create an elevator model with an empty string', () => {
        const elevatorModel = ElevatorModel.create('');

        expect(elevatorModel.isSuccess).to.be.true;
        expect(elevatorModel.getValue().model).to.be.equal('');
    });

    it('should fail to create an elevator model object with model exceeding maximum characters', () => {
        const elevatorModel = ElevatorModel.create('A'.repeat(51));

        expect(elevatorModel.isFailure).to.be.true;
        expect(elevatorModel.error).to.be.equal('The elevator model cannot have more than 50 characters.');
    });

    it('should return the correct model in toString()', () => {
        const elevatorModel = ElevatorModel.create('Thyssenkrupp').getValue();

        expect(elevatorModel.toString()).to.be.equal('Thyssenkrupp');
    });
});
