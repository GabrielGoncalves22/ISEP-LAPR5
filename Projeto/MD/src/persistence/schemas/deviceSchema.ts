import { IDevicePersistence } from '../../dataschema/IDevicePersistence';
import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'The id of the device is mandatory.'],
            unique: true
        },

        description: {
            type: String
        },

        type: {
            type: String,
            required: [true, 'Please enter the device type'],
        },

        serialNumber: {
            type: String,
            required: [true, 'Please enter the device serial number'],
        },

        nickname: {
            type: String,
            required: [true, 'Please enter the device nickname'],
            unique: true
        },

        status: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

DeviceSchema.index({ type: 1, serialNumber: 1 }, { unique: true });

export default mongoose.model<IDevicePersistence & mongoose.Document>('Device', DeviceSchema);
