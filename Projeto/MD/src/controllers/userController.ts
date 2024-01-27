import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IUserController from "./IControllers/IUserController";
import IUserService from '../services/IServices/IUserService';
import IUserDTO from '../dto/IUserDTO';

import { BaseController } from '../core/infra/BaseController';
import { Result } from '../core/logic/Result';
import { Role } from '../domain/user/role';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Service()
export default class UserController extends BaseController implements IUserController {
    constructor(
        @Inject(config.services.user.name) private userServiceInstance: IUserService
    ) {
        super();
    }

    protected executeImpl(): Promise<any> {
        if (this.req.method === "POST") {
            switch (this.req.url) {
                case "/register":
                    return this.register(this.req, this.res, this.next);
                case "/login":
                    return this.login(this.req, this.res, this.next);
            }
        } else if (this.req.method === "GET") {
            if (this.req.url.includes("/role")) {
                return this.getAllUsersByRole(this.req, this.res, this.next);
            } else if (this.req.url === "/me") {
                return this.me(this.req, this.res, this.next);
            }
        } else if (this.req.method === "PATCH" || this.req.method === "PUT") {
            switch (this.req.url) {
                case "/activate":
                    return this.toggleActivation(this.req, this.res, this.next);
                case "/profile":
                    return this.updateProfile(this.req, this.res, this.next);
            }
        } else if (this.req.method === "DELETE") {
            return this.delete(this.req, this.res, this.next);
        }
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.userServiceInstance.register(req.body as IUserDTO);

            if (result.isFailure) {
                return super.badRequest(res, result.error.toString());
            }

            const { user, token } = result.getValue();

            return super.created(res, { user, token });
        } catch (e) {
            return next(e);
        }
    };

    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, withFacebook } = req.body;
            const result = await this.userServiceInstance.login(email, password, withFacebook);

            if (result.isFailure) {
                return super.unauthorized(res, result.error.toString());
            }

            const { user, token } = result.getValue();

            return super.ok(res, { user, token });
        } catch (e) {
            return next(e);
        }
    };

    public async me(req, res: Response, next: NextFunction) {
        try {
            const userOrError = await this.userServiceInstance.me(req.auth.id);

            if (userOrError.isFailure) {
                return super.unauthorized(res, userOrError.error.toString());
            }

            return super.ok(res, userOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getAllUsersByRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.params;

            const result = await this.userServiceInstance.getAllUsersByRole(role);

            if (result.isFailure)
                return super.badRequest(res, result.error.toString());

            const users = result.getValue();

            if (users.length == 0)
                return super.notFound(res, "No users found.");

            return super.ok(res, users);
        } catch (e) {
            return next(e);
        }
    };

    public async toggleActivation(req: Request, res: Response, next: NextFunction) {
        try {
            const userOrError = await this.userServiceInstance.toggleActivation(req.body.id) as Result<IUserDTO>;

            if (userOrError.isFailure)
                return super.badRequest(res, userOrError.error.toString());

            return super.ok(res, userOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async updateProfile(req, res: Response, next: NextFunction) {
        try {
            const userOrError = await this.userServiceInstance.updateProfile(req.auth.id, req.body) as Result<IUserDTO>;

            if (userOrError.isFailure) {
                return super.badRequest(res, userOrError.error.toString());
            }

            return super.ok(res, userOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };


    public async delete(req, res: Response, next: NextFunction) {
        try {
            const deletedOrError = await this.userServiceInstance.delete(req.auth.id) as Result<string>;

            if (deletedOrError.isFailure)
                return super.badRequest(res, deletedOrError.error.toString());

            return super.ok(res, deletedOrError.getValue());
        } catch (e) {
            return next(e);
        }
    }

}
