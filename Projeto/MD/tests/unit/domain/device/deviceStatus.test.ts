import { expect } from 'chai';

import { DeviceStatus } from '../../../../src/domain/device/deviceStatus';

describe('deviceStatus enum', () => {
    it('should have Active defined', () => {
        expect(DeviceStatus).to.have.property('Active');
    });

    it('should have Inactive defined', () => {
        expect(DeviceStatus).to.have.property('Inactive');
    });
});
