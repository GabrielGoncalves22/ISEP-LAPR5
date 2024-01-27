import { Request, Response, NextFunction } from 'express';

export default interface IDeviceController {
    createDevice(req: Request, res: Response, next: NextFunction);
    updateStateDevice(req: Request, res: Response, next: NextFunction);
    getAllDevices(req: Request, res: Response, next: NextFunction);
    execute(req: Request, res: Response, next: NextFunction);
}