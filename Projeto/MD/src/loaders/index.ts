import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';

export default async ({ expressApp }) => {
	const mongoConnection = await mongooseLoader();
	Logger.info('✌️ DB loaded and connected!');

	const userSchema = {
		// compare with the approach followed in repos and services
		name: 'userSchema',
		schema: '../persistence/schemas/userSchema',
	};

	const buildingSchema = {
		// compare with the approach followed in repos and services
		name: 'buildingSchema',
		schema: '../persistence/schemas/buildingSchema',
	};

	const passagewaySchema = {
		// compare with the approach followed in repos and services
		name: 'passagewaySchema',
		schema: '../persistence/schemas/passagewaySchema',
	};

	const deviceSchema = {
		// compare with the approach followed in repos and services
		name: 'deviceSchema',
		schema: '../persistence/schemas/deviceSchema'
	};

	const deviceTypeSchema = {
		// compare with the approach followed in repos and services
		name: 'deviceTypeSchema',
		schema: '../persistence/schemas/deviceTypeSchema'
	};

	const userController = {
		name: config.controllers.user.name,
		path: config.controllers.user.path
	}

	const buildingController = {
		name: config.controllers.building.name,
		path: config.controllers.building.path
	}

	const passagewayController = {
		name: config.controllers.passageway.name,
		path: config.controllers.passageway.path
	}

	const deviceController = {
		name: config.controllers.device.name,
		path: config.controllers.device.path
	}

	const deviceTypeController = {
		name: config.controllers.deviceType.name,
		path: config.controllers.deviceType.path
	}

	const userRepo = {
		name: config.repos.user.name,
		path: config.repos.user.path
	}

	const buildingRepo = {
		name: config.repos.building.name,
		path: config.repos.building.path
	}

	const passagewayRepo = {
		name: config.repos.passageway.name,
		path: config.repos.passageway.path
	}

	const deviceRepo = {
		name: config.repos.device.name,
		path: config.repos.device.path
	}

	const deviceTypeRepo = {
		name: config.repos.deviceType.name,
		path: config.repos.deviceType.path
	}

	const userService = {
		name: config.services.user.name,
		path: config.services.user.path
	}

	const buildingService = {
		name: config.services.building.name,
		path: config.services.building.path
	}

	const passagewayService = {
		name: config.services.passageway.name,
		path: config.services.passageway.path
	}

	const deviceService = {
		name: config.services.device.name,
		path: config.services.device.path
	}

	const deviceTypeService = {
		name: config.services.deviceType.name,
		path: config.services.deviceType.path
	}

	await dependencyInjectorLoader({
		mongoConnection,
		schemas: [
			userSchema,
			buildingSchema,
			passagewaySchema,
			deviceSchema,
			deviceTypeSchema
		],
		controllers: [
			userController,
			buildingController,
			passagewayController,
			deviceController,
			deviceTypeController
		],
		repos: [
			userRepo,
			buildingRepo,
			passagewayRepo,
			deviceRepo,
			deviceTypeRepo
		],
		services: [
			userService,
			buildingService,
			passagewayService,
			deviceService,
			deviceTypeService
		]
	});
	Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

	await expressLoader({ app: expressApp });
	Logger.info('✌️ Express loaded');
};