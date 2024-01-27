import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    // This error should crash whole process

    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    /**
     * Your favorite port : optional change to 4000 by JRT
     */
    port: parseInt(process.env.PORT, 10) || 4000,

    /**
     * That long string from mlab
     */
    /* databaseURL: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test", */
    //databaseURL: process.env.MONGODB_URI || "mongodb://mongoadmin:1f8402684f9645194a515c31@vs624.dei.isep.ipp.pt:27017/RobDroneGo",
    //databaseURL: process.env.MONGODB_URI || "mongodb+srv://admin:q3BiY7FsD0c6KZNE@robdronego.2glxkgb.mongodb.net/RobDroneGo?retryWrites=true&w=majority",
    databaseEnv: process.env.NODE_ENV,
    
    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

    /**
     * Used by winston logger
     */
    logs: {
        level: process.env.LOG_LEVEL || 'info',
    },

    /**
     * API configs
     */
    api: {
        prefix: '/api',
    },

    emailDomain: process.env.EMAIL_DOMAIN || "isep.ipp.pt",

    controllers: {
        user: {
            name: "UserController",
            path: "../controllers/userController"
        },
        building: {
            name: "BuildingController",
            path: "../controllers/buildingController"
        },
        passageway: {
            name: "PassagewayController",
            path: "../controllers/passagewayController"
        },
        device: {
            name: "DeviceController",
            path: "../controllers/deviceController"
        },
        deviceType: {
            name: "DeviceTypeController",
            path: "../controllers/deviceTypeController"
        }
    },

    repos: {
        user: {
            name: "UserRepo",
            path: "../repos/userRepo"
        },
        building: {
            name: "BuildingRepo",
            path: "../repos/buildingRepo"
        },
        passageway: {
            name: "PassagewayRepo",
            path: "../repos/passagewayRepo"
        },
        device: {
            name: "DeviceRepo",
            path: "../repos/deviceRepo"
        },
        deviceType: {
            name: "DeviceTypeRepo",
            path: "../repos/deviceTypeRepo"
        }
    },

    services: {
        user: {
            name: "UserService",
            path: "../services/userService"
        },
        building: {
            name: "BuildingService",
            path: "../services/buildingService"
        },
        passageway: {
            name: "PassagewayService",
            path: "../services/passagewayService"
        },
        device: {
            name: "DeviceService",
            path: "../services/deviceService"
        },
        deviceType: {
            name: "DeviceTypeService",
            path: "../services/deviceTypeService"
        }
    },
};