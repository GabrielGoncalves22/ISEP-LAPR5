import { IDeviceTypePersistence } from '../../dataschema/IDeviceTypePersistence';
import mongoose from 'mongoose';

const DeviceTypeSchema = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true
        },

        type: {
            type: String,
            required: [true, 'Please enter the device type'],
            unique: true
        },

        brand: {
            type: String,
            required: [true, 'Please enter the device type brand'],
        },

        model: {
            type: String,
            required: [true, 'Please enter the device type brand'],
        },

        taskTypes: [
            {
                type: String,
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IDeviceTypePersistence & mongoose.Document>('DeviceType', DeviceTypeSchema);
