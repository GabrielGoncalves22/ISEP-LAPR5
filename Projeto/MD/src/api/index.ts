import { Router } from 'express';
import building from './routes/buildingRoute';
import device from './routes/deviceRoute';
import user from './routes/userRoute';

export default () => {
	const app = Router();

	building(app);
	device(app);
	user(app);

	return app;
}