import { Request, Response, NextFunction } from 'express';

export default interface IDeviceTypeController {
    createDeviceType(req: Request, res: Response, next: NextFunction);
    execute(req: Request, res: Response, next: NextFunction);
}