import { Router } from 'express';
import cors from 'cors';
import { celebrate, Joi, errors } from 'celebrate';
import { Container } from 'typedi';

import IUserController from '../../controllers/IControllers/IUserController';
import middlewares from '../middlewares';
import config from "../../../config";

const route = Router();

// Define um objeto com mensagens personalizadas
const customErrorMessages = {
    name: 'The name is required.',
    email: 'The email is required.',
    password: 'The password is required.',
    telephone: 'The telephone is required.',
    taxPayerNumber: 'The tax payer number is required.',
};

export default (app: Router) => {
    app.use('/users', route);

    // Middleware para habilitar o CORS
    app.use(cors());

    // Middleware para lidar com erros de validação
    app.use(errors());

    const ctrl = Container.get(config.controllers.user.name) as IUserController;

    route.post('/register',
        (req, res, next) => {
            if (req.body.role) {
                middlewares.isAuth(req, res, (err) => {
                    if (err) {
                        return next(err);
                    }

                    middlewares.verifyRole.verifyRoleSystemManager(req, res, next);
                });
            } else {
                next();
            }
        },
        celebrate({
            body: Joi.object({
                name: Joi.string().required().error(new Error(customErrorMessages.name)),
                email: Joi.string().email().required().error(new Error(customErrorMessages.email)),
                password: Joi.string().required().error(new Error(customErrorMessages.password)),
                telephone: Joi.string().required().error(new Error(customErrorMessages.telephone)),
                taxPayerNumber: Joi.when('role', {
                    is: Joi.exist(),
                    then: Joi.forbidden(),
                    otherwise: Joi.string().required().error(new Error(customErrorMessages.taxPayerNumber))
                }),
                role: Joi.string()
            })
        }),
        (req, res, next) => ctrl.execute(req, res, next)
    );

    route.post('/login',
        celebrate({
            body: Joi.object({
                email: Joi.string().email().required().error(new Error(customErrorMessages.email)),
                password: Joi.when('withFacebook', {
                    is: true,
                    then: Joi.optional(),
                    otherwise: Joi.string().required().error(new Error(customErrorMessages.password)),
                }),
                withFacebook: Joi.boolean().optional(),
            }),
        }),
        (req, res, next) => ctrl.execute(req, res, next)
    );

    route.get('/role/:role',
        celebrate({
            params: Joi.object({
                role: Joi.string().required()
            }),
        }),
        (req, res, next) => ctrl.execute(req, res, next)
    );

    route.get('/role',
        (req, res, next) => ctrl.execute(req, res, next)
    );

    route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser,
        (req, res, next) => ctrl.execute(req, res, next)
    );

    route.patch('/activate',
        celebrate({
            body: Joi.object({
                id: Joi.string().required()
            }),
        }),
        (req, res, next) => ctrl.execute(req, res, next)
    );

    route.put('/profile', middlewares.isAuth, middlewares.attachCurrentUser,
        celebrate({
            body: Joi.object({
                name: Joi.string().required().error(new Error(customErrorMessages.name)),
                telephone: Joi.string().required().error(new Error(customErrorMessages.telephone)),
                taxPayerNumber: Joi.string().required().error(new Error(customErrorMessages.taxPayerNumber)),
            }),
        }),
        (req, res, next) => ctrl.execute(req, res, next)
    );

    route.delete('/me', middlewares.isAuth, middlewares.attachCurrentUser,
        (req, res, next) => ctrl.execute(req, res, next)
    );

    /*
        route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger') as winston.Logger;
            logger.debug('Calling Sign-Out endpoint with body: %o', req.body)
            try {
                //@TODO AuthService.Logout(req.user) do some clever stuff
                return res.status(200).end();
            } catch (e) {
                logger.error('🔥 error %o', e);
                return next(e);
            }
        });
    
        */
};
