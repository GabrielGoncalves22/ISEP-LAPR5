import { Request, Response, NextFunction } from 'express';

export default interface IPassagewayController {
    createPassageway(req: Request, res: Response, next: NextFunction);
    getPassagewaysBetweenBuildings(req: Request, res: Response, next: NextFunction);
    updatePassageway(req: Request, res: Response, next: NextFunction);
    execute(req: Request, res: Response, next: NextFunction);
}