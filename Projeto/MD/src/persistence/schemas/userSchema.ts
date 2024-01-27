import { IUserPersistence } from '../../dataschema/IUserPersistence';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
    {
        domainId: {
            type: String,
            unique: true
        },

        name: {
            type: String,
            required: [true, 'Please enter the name']
        },

        email: {
            type: String,
            required: [true, 'Please enter the email'],
            lowercase: true,
            unique: true,
            index: true
        },

        password: {
            type: String,
            required: [true, 'Please enter the password'],
        },

        telephone: {
            type: String,
            required: [true, 'Please enter the telephone number'],
            unique: true,
            index: true
        },

        taxPayerNumber: {
            type: String,
            unique: true,
            sparse: true,
            index: true
        },

        role: {
            required: [true, 'Please enter the role'],
            type: String
        },

        active: {
            type: Boolean
        },
    },
    {
        timestamps: true
    },
);

export default mongoose.model<IUserPersistence & mongoose.Document>('User', User);
