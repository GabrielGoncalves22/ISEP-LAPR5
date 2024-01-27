import { expect } from 'chai';

import { DeviceTypeModel } from '../../../../src/domain/device/deviceTypeModel';

describe('deviceTypeModel value object', () => {
    it('can create a valid device type model object', () => {
        const model = DeviceTypeModel.create('Vaccuum');

        expect(model.isSuccess).to.be.true;
        expect(model.getValue().model).to.be.equal('Vaccuum');
    });

    it('should fail to create a device type model object with model exceeding maximum characters', () => {
        const model = DeviceTypeModel.create('A'.repeat(51));

        expect(model.isFailure).to.be.true;
        expect(model.error).to.be.equal('The model cannot have more than 50 characters.');
    });

    it('should return the correct model in toString()', () => {
        const model = DeviceTypeModel.create('Vaccuum').getValue();

        expect(model.toString()).to.be.equal('Vaccuum');
    });
});
