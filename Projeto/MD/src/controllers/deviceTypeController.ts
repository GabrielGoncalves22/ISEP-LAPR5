import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IDeviceTypeController from "./IControllers/IDeviceTypeController";
import IDeviceTypeService from '../services/IServices/IDeviceTypeService';
import IDeviceTypeDTO from '../dto/IDeviceTypeDTO';

import { Result } from "../core/logic/Result";
import { BaseController } from '../core/infra/BaseController';

@Service()
export default class DeviceTypeController extends BaseController implements IDeviceTypeController {
    constructor(
        @Inject(config.services.deviceType.name) private deviceTypeServiceInstance: IDeviceTypeService
    ) {
        super();
    }

    protected executeImpl(): Promise<any> {
        if (this.req.method === "POST") {
            switch (this.req.url) {
                case "/types":
                    return this.createDeviceType(this.req, this.res, this.next);
            }
        }
    }

    public async createDeviceType(req: Request, res: Response, next: NextFunction) {
        try {
            const deviceTypeOrError = await this.deviceTypeServiceInstance.createDeviceType(req.body as IDeviceTypeDTO) as Result<IDeviceTypeDTO>;

            if (deviceTypeOrError.isFailure) {
                return super.badRequest(res, deviceTypeOrError.error.toString());
            }

            return super.created(res, deviceTypeOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };
}