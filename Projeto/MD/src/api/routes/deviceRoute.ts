import { Router } from 'express';
import cors from 'cors';

import middlewares from '../middlewares';
import { celebrate, Joi, errors } from 'celebrate';

import { Container } from 'typedi';
import IDeviceTypeController from '../../controllers/IControllers/IDeviceTypeController';

import config from "../../../config";
import IDeviceController from '../../controllers/IControllers/IDeviceController';

const route = Router();

// Define um objeto com mensagens personalizadas
const customErrorMessages = {
    type: 'The device type is required.',
    brand: 'The device type brand is required.',
    model: 'The device type model is required.',
    taskTypes: 'The device type task types is required.',
};

export default (app: Router) => {
    // Middleware para verificar se o utilizador está autenticado e se tem permissões
    app.use('/devices', middlewares.isAuth, middlewares.verifyRole.verifyRoleFleetManager, route);

    // Middleware para habilitar o CORS
    app.use(cors());
    
    // Middleware para lidar com erros de validação
    app.use(errors());

    const ctrlDeviceType = Container.get(config.controllers.deviceType.name) as IDeviceTypeController;
    const ctrlDevice = Container.get(config.controllers.device.name) as IDeviceController;

    route.post('/types',
        celebrate({
            body: Joi.object({
                type: Joi.string().required().error(new Error(customErrorMessages.type)),
                brand: Joi.string().required().error(new Error(customErrorMessages.brand)),
                model: Joi.string().required().error(new Error(customErrorMessages.model)),
                taskTypes: Joi.array().items(Joi.number()).required().error(new Error(customErrorMessages.model))
            }),
        }),
        (req, res, next) => ctrlDeviceType.execute(req, res, next)
    );

    route.route('')
        .post(
            celebrate({
                body: Joi.object({
                    code: Joi.string().required(),
                    description: Joi.string().allow('').optional(),
                    type: Joi.string().required(),
                    serialNumber: Joi.string().required(),
                    nickname: Joi.string().required()
                }),
            }),
            (req, res, next) => ctrlDevice.execute(req, res, next)
        )

        .get(
            (req, res, next) => ctrlDevice.execute(req, res, next)
        );

    route.patch('/:code',
        celebrate({
            params: {
                code: Joi.string().required(),
            },
        }),
        (req, res, next) => ctrlDevice.execute(req, res, next)
    );

};