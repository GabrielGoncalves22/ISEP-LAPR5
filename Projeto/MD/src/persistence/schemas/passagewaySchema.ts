import { IPassagewayPersistence } from '../../dataschema/IPassagewayPersistence';
import mongoose from 'mongoose';

const PassagewaySchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: [true, 'The code of the passageway is mandatory.'],
			unique: true
		},

		building1: {
			type: String,
			required: [true, 'Please enter the building 1 code in passageway']
		},

		floor1: {
			type: Number,
			required: [true, 'Please enter the floor 1 number in passageway']
		},

		building2: {
			type: String,
			required: [true, 'Please enter the building 2 code in passageway']
		},

		floor2: {
			type: Number,
			required: [true, 'Please enter the floor 2 number in passageway']
		},
		cellOrientation: {
			type: String
		},
		xStartCell: {
			type: Number,
			min: 0
		},
		yStartCell: {
			type: Number,
			min: 0
		},
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IPassagewayPersistence & mongoose.Document>('Passageway', PassagewaySchema);
