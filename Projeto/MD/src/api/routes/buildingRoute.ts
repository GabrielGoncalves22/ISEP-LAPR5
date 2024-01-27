import { Router } from 'express';
import cors from 'cors';
import multer from 'multer';

import middlewares from '../middlewares';
import { celebrate, Joi, errors } from 'celebrate';

import { Container } from 'typedi';
import IBuildingController from '../../controllers/IControllers/IBuildingController';
import IPassagewayController from '../../controllers/IControllers/IPassagewayController';

import config from "../../../config";

const route = Router();

// Define um objeto com mensagens personalizadas
const customErrorMessages = {
    buildingCode: 'The building code is required.',
    numXCells: 'The number of X cells must be a number greater than 0.',
    numYCells: 'The number of Y cells must be a number greater than 0.',
    numMinMaxFloors: 'The maximum number should be greater or equals to the minimum number.',
    number: 'The floor number is required and must be a number.',
    model: 'The elevator model is required.',
    floors: 'The elevator must serve at least 2 floors.',
    building2RequiredForListPassageways: 'You need to specify both buildings first.',
    name: 'The name field cannot be empty.',
    category: 'The category field cannot be empty.',
    floorRequired: 'You need to choose one floor.',
    roomName: 'The room code is required.'
};

export default (app: Router) => {
    // Middleware para verificar se o utilizador está autenticado
    // As permissões são verificadas individualmente em cada rota, pois existem as rotas usadas na visualização 3D que não precisam
    app.use('/buildings', middlewares.isAuth, route);

    // Middleware para habilitar o CORS
    app.use(cors());

    // Middleware para lidar com erros de validação
    app.use(errors());

    // Configurar o middleware multer para lidar com o upload de arquivos
    const storage = multer.memoryStorage(); // Armazenar o arquivo em memória (pode ser ajustado conforme necessário)
    const upload = multer({ storage: storage });

    const ctrlBuilding = Container.get(config.controllers.building.name) as IBuildingController;
    const ctrlPassageway = Container.get(config.controllers.passageway.name) as IPassagewayController;

    route.route('')
        .post(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                body: Joi.object({
                    code: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
                    name: Joi.string().allow('').optional(),
                    description: Joi.string().allow('').optional(),
                    numXCells: Joi.number().integer().required().error(new Error(customErrorMessages.numXCells)),
                    numYCells: Joi.number().integer().required().error(new Error(customErrorMessages.numYCells))
                })
            }),
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        );

    route.get('',
        celebrate({
            query: {
                min: Joi.number().integer().min(0).optional(),
                max: Joi.number().integer().when('min', {
                    is: Joi.exist(),
                    then: Joi.number().integer().min(Joi.ref('min')).required().error(new Error(customErrorMessages.numMinMaxFloors)),
                    otherwise: Joi.optional()
                })
            },
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.route('/:code')
        .put(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                params: {
                    code: Joi.string().required(),
                },
                body: Joi.object({
                    name: Joi.string().allow('').optional(),
                    description: Joi.string().allow('').optional(),
                    numXCells: Joi.number().integer().required().error(new Error(customErrorMessages.numXCells)),
                    numYCells: Joi.number().integer().required().error(new Error(customErrorMessages.numYCells))
                })
            }),
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        )

        .patch(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                params: {
                    code: Joi.string().required(),
                },
                body: Joi.object({
                    name: Joi.string().allow('').optional(),
                    description: Joi.string().allow('').optional(),
                    numXCells: Joi.number().integer().optional(),
                    numYCells: Joi.number().integer().optional()
                }).min(1)
            }),
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        );

    route.post('/floors', middlewares.verifyRole.verifyRoleCampusManager,
        celebrate({
            body: Joi.object({
                number: Joi.number().integer().required().error(new Error(customErrorMessages.number)),
                description: Joi.string().allow('').optional(),
                building: Joi.string().required().error(new Error(customErrorMessages.buildingCode))
            })
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.post('/:buildingCode/floors', middlewares.verifyRole.verifyRoleUser,
        celebrate({
            params: {
                buildingCode: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
            },
            body: Joi.object({
                floors: Joi.array().items(
                    Joi.number().integer().required().error(new Error(customErrorMessages.number))
                ).unique().min(1).required().error(new Error("There are no specified floors to verify!"))
            })
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.route('/:buildingCode/floors/:floorNumber/map')
        .patch(upload.single('filekey'), middlewares.verifyRole.verifyRoleCampusManager,
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        ).get(celebrate({
            params: {
                buildingCode: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
                floorNumber: Joi.number().integer().required().error(new Error(customErrorMessages.floorRequired))
            },
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.post('/elevators', middlewares.verifyRole.verifyRoleCampusManager,
        celebrate({
            body: Joi.object({
                brand: Joi.string().allow('').optional(),
                model: Joi.when('brand', {
                    is: Joi.string().required(),
                    then: Joi.string().required().error(new Error(customErrorMessages.model)),
                    otherwise: Joi.string().allow('').optional()
                }),
                serialNumber: Joi.string().allow('').optional(),
                description: Joi.string().allow('').optional(),
                building: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
                floors: Joi.array().items(
                    Joi.object({
                        number: Joi.number().integer().required().error(new Error(customErrorMessages.number))
                    })
                ).unique('number').min(2).required().error(new Error(customErrorMessages.floors))
            })
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.route('/:code/elevators')
        .put(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                params: {
                    code: Joi.string().required(),
                },
                body: Joi.object({
                    brand: Joi.string().allow('').optional(),
                    model: Joi.when('brand', {
                        is: Joi.exist(),
                        then: Joi.string().required(),
                        otherwise: Joi.string().allow('').optional()
                    }),
                    serialNumber: Joi.string().allow('').optional(),
                    description: Joi.string().allow('').optional(),
                    floors: Joi.array().items(
                        Joi.object({
                            number: Joi.number().integer().required()
                        })
                    ).unique('number').min(2).required()
                })
            }),
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        )
        .patch(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                params: {
                    code: Joi.string().required(),
                },
                body: Joi.object({
                    brand: Joi.string().allow('').optional(),
                    model: Joi.when('brand', {
                        is: Joi.exist(),
                        then: Joi.string().required(),
                        otherwise: Joi.string().allow('').optional()
                    }),
                    serialNumber: Joi.string().allow('').optional(),
                    description: Joi.string().allow('').optional(),
                    floors: Joi.array().items(
                        Joi.object({
                            number: Joi.number().integer().optional()
                        })
                    ).unique('number').min(2)
                }).min(1)
            }),
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        );

    route.route('/:code/floors/:number')
        .put(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                params: {
                    code: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
                    number: Joi.number().integer().required().error(new Error(customErrorMessages.number))
                },
                body: Joi.object({
                    number: Joi.number().integer().required(),
                    description: Joi.string().allow('').optional()
                })
            }),
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        )
        .patch(
            celebrate({
                params: {
                    code: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
                    number: Joi.number().integer().required().error(new Error(customErrorMessages.number))
                },
                body: Joi.object({
                    number: Joi.number().integer().optional(),
                    description: Joi.string().allow('').optional()
                }).min(1)
            }),
            (req, res, next) => ctrlBuilding.execute(req, res, next)
        );

    route.post('/rooms', middlewares.verifyRole.verifyRoleCampusManager,
        celebrate({
            body: Joi.object({
                building: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
                floor: Joi.number().integer().required().error(new Error(customErrorMessages.floorRequired)),
                name: Joi.string().required().error(new Error(customErrorMessages.name)),
                description: Joi.string().allow('').optional(),
                category: Joi.string().required().error(new Error(customErrorMessages.category))
            })
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.get('/rooms', middlewares.verifyRole.verifyRoleUser, (req, res, next) => ctrlBuilding.execute(req, res, next));

    route.get('/:buildingCode/rooms/:roomName',
        celebrate({
            params: {
                buildingCode: Joi.string().required().error(new Error(customErrorMessages.buildingCode)),
                roomName: Joi.string().required().error(new Error(customErrorMessages.roomName))
            }
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.route('/passageways')
        .post(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                body: Joi.object({
                    building1: Joi.string().required(),
                    floor1: Joi.number().integer().required(),
                    building2: Joi.string().required(),
                    floor2: Joi.number().integer().required()
                })
            }),
            (req, res, next) => ctrlPassageway.execute(req, res, next)
        )

        .get(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                query: {
                    building1: Joi.string().allow('').optional(),
                    building2: Joi.string().when('building1', {
                        is: Joi.exist(),
                        then: Joi.required().error(new Error(customErrorMessages.building2RequiredForListPassageways)),
                        otherwise: Joi.allow('').optional()
                    })
                }
            }),
            (req, res, next) => ctrlPassageway.execute(req, res, next)
        );

    route.route('/passageways/:passagewayCode')
        .put(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                params: {
                    passagewayCode: Joi.string().required(),
                },
                body: Joi.object({
                    building1: Joi.string().required(),
                    floor1: Joi.number().integer().required(),
                    building2: Joi.string().required(),
                    floor2: Joi.number().integer().required()
                })
            }),
            (req, res, next) => ctrlPassageway.execute(req, res, next)
        )
        .patch(middlewares.verifyRole.verifyRoleCampusManager,
            celebrate({
                params: {
                    passagewayCode: Joi.string().required(),
                },
                body: Joi.object({
                    building1: Joi.string().optional(),
                    floor1: Joi.number().integer().optional(),
                    building2: Joi.string().optional(),
                    floor2: Joi.number().integer().optional()
                }).min(1)
            }),
            (req, res, next) => ctrlPassageway.execute(req, res, next)
        );

    route.get('/:code/elevators/',
        celebrate({
            params: {
                code: Joi.string().required().error(new Error(customErrorMessages.buildingCode))
            },
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.get('/:code/floors/',
        celebrate({
            params: {
                code: Joi.string().required(),
            },
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.get('/:code/floors/passageways', middlewares.verifyRole.verifyRoleCampusManager,
        celebrate({
            params: {
                code: Joi.string().required(),
            },
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );

    route.get('/:code', middlewares.verifyRole.verifyRoleUser,
        celebrate({
            params: {
                code: Joi.string().required(),
            }
        }),
        (req, res, next) => ctrlBuilding.execute(req, res, next)
    );
};
