import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../../config';

export default async (): Promise<Db> => {
    let connection;
    if (config.databaseEnv === 'development') {
        connection = await mongoose.connect("mongodb+srv://admin:q3BiY7FsD0c6KZNE@robdronego.2glxkgb.mongodb.net/RobDroneGo?retryWrites=true&w=majority");
    } else if (config.databaseEnv === 'production') {
        connection = await mongoose.connect("mongodb://vs624.dei.isep.ipp.pt:27017/RobDroneGo", {
            authSource: "admin",
            user: "mongoadmin",
            pass: "1f8402684f9645194a515c31",
        });
    } else {
        console.log("The database for this environment isn't defined!");
        return;
    }

    return connection.connection.db;  

    //const connection = await mongoose.connect(config.databaseURL);
    //return connection.connection.db;
};
