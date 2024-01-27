import { IBuildingPersistence } from '../../dataschema/IBuildingPersistence';
import mongoose from 'mongoose';

const BuildingSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: [true, 'The code of the building is mandatory.'],
			unique: true
		},

		name: {
			type: String,
		},

		description: {
			type: String,
			default: ''
		},

		numXCells: {
			type: Number,
			required: [true, 'Please enter the building width'],
		},

		numYCells: {
			type: Number,
			required: [true, 'Please enter the building lenght'],
		},

		floors: {
			type: [
				{
					number: {
						type: Number,
						required: [true, 'Please enter the floor number']
					},
					description: {
						type: String,
						default: ''
					},
					rooms: [
						{
							name: {
								type: String,
								required: [true, 'Please enter the room name'],
								unique: true
							},
							description: {
								type: String,
								default: ''
							},
							category: {
								type: String,
								required: [true, 'Please enter the room category']
							},
							xStartCell: {
								type: Number,
								min: 0
							},
							yStartCell: {
								type: Number,
								min: 0
							},
							xEndCell: {
								type: Number,
								min: 0
							},
							yEndCell: {
								type: Number,
								min: 0
							},
							doors: [
								{
									yPositionCell: {
										type: Number,
										min: 0
									},
									xPositionCell: {
										type: Number,
										min: 0
									},
									cellOrientation: {
										type: String
									}
								}
							]
						}
					],
					map: [[Number]],
				}
			],

			default: []
		},

		elevator: {
			type: {
				brand: {
					type: String,
					default: ''
				},

				model: {
					type: String,
					default: ''
				},

				serialNumber: {
					type: String,
					default: ''
				},

				description: {
					type: String,
					default: ''
				},

				floors: [
					{
						number: {
							type: Number,
							required: [true, 'Please enter the floor number']
						},
						elevatorCellOrientation: {
							type: String
						}
					}
				],

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

			default: null
		}
	},
	{
		timestamps: true
	}
);

export default mongoose.model<IBuildingPersistence & mongoose.Document>('Building', BuildingSchema);
