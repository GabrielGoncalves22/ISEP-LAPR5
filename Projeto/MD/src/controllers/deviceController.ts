import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IDeviceController from "./IControllers/IDeviceController";
import IDeviceService from '../services/IServices/IDeviceService';
import IDeviceDTO from '../dto/IDeviceDTO';

import { Result } from "../core/logic/Result";
import { BaseController } from '../core/infra/BaseController';

@Service()
export default class DeviceController extends BaseController implements IDeviceController {
    constructor(
        @Inject(config.services.device.name) private deviceServiceInstance: IDeviceService
    ) {
        super();
    }

    protected executeImpl(): Promise<any> {
        if (this.req.method === "POST") {
            switch (this.req.url) {
                case "/":
                    return this.createDevice(this.req, this.res, this.next);
            }
        } else if (this.req.method === "PUT" || this.req.method === "PATCH") {
            const url = this.req.url;

            if (url.includes('/')) {
                return this.updateStateDevice(this.req, this.res, this.next);
            }
        } else if (this.req.method === "GET") {
            return this.getAllDevices(this.req, this.res, this.next);
        }
    }

    public async createDevice(req: Request, res: Response, next: NextFunction) {
        try {
            const deviceOrError = await this.deviceServiceInstance.createDevice(req.body as IDeviceDTO) as Result<IDeviceDTO>;

            if (deviceOrError.isFailure) {
                return super.badRequest(res, deviceOrError.error.toString());
            }

            return super.created(res, deviceOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async updateStateDevice(req: Request, res: Response, next: NextFunction) {
        try {
            const deviceOrError = await this.deviceServiceInstance.updateStateDevice(req.params.code) as Result<IDeviceDTO>;

            if (deviceOrError.isFailure) {
                return super.notFound(res, deviceOrError.error.toString());
            }

            return super.ok(res, deviceOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getAllDevices(req: Request, res: Response, next: NextFunction) {
        try {
            const devicesOrError = await this.deviceServiceInstance.getAllDevices() as Result<IDeviceDTO[]>;

            if (devicesOrError.isFailure) {
                return super.badRequest(res, devicesOrError.error.toString());
            }

            return super.ok(res, devicesOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

}