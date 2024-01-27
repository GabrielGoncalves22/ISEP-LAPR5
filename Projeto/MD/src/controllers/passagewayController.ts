import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IPassagewayController from "./IControllers/IPassagewayController";
import IPassagewayService from '../services/IServices/IPassagewayService';
import IPassagewayDTO from '../dto/IPassagewayDTO';

import { Result } from "../core/logic/Result";
import { BaseController } from '../core/infra/BaseController';

@Service()
export default class PassagewayController extends BaseController implements IPassagewayController {
    constructor(
        @Inject(config.services.passageway.name) private passagewayServiceInstance: IPassagewayService
    ) {
        super();
    }

    protected executeImpl(): Promise<any> {
        if (this.req.method === "POST") {
            switch (this.req.url) {
                case "/passageways":
                    return this.createPassageway(this.req, this.res, this.next);
            }
        } else if (this.req.method === "GET") {
            return this.getPassagewaysBetweenBuildings(this.req, this.res, this.next);
        } else if (this.req.method === "PUT" || this.req.method === "PATCH") {
            return this.updatePassageway(this.req, this.res, this.next);
        }
    }

    public async createPassageway(req: Request, res: Response, next: NextFunction) {
        try {
            const passagewayOrError = await this.passagewayServiceInstance.createPassageway(req.body as IPassagewayDTO) as Result<IPassagewayDTO>;

            if (passagewayOrError.isFailure) {
                return super.badRequest(res, passagewayOrError.error.toString());
            }

            return super.created(res, passagewayOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getPassagewaysBetweenBuildings(req: Request, res: Response, next: NextFunction) {
        try {
            let passagewayOrError;
            if (req.query.building1 && req.query.building2) {
                passagewayOrError = await this.passagewayServiceInstance.getPassagewaysBetweenBuildings(String(req.query.building1), String(req.query.building2)) as Result<IPassagewayDTO[]>;
            } else {
                passagewayOrError = await this.passagewayServiceInstance.getPassagewaysBetweenBuildings() as Result<IPassagewayDTO[]>;
            }

            if (passagewayOrError.isFailure) {
                return super.badRequest(res, passagewayOrError.error.toString());
            }

            return super.ok(res, passagewayOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async updatePassageway(req: Request, res: Response, next: NextFunction) {
        try {
            const passagewayOrError = await this.passagewayServiceInstance.updatePassageway(req.params.passagewayCode, req.body as IPassagewayDTO) as Result<IPassagewayDTO>;

            if (passagewayOrError.isFailure) {
                return super.badRequest(res, passagewayOrError.error.toString());
            }

            return super.ok(res, passagewayOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };
}