import { Request, Response, NextFunction } from 'express';

export default interface IPassagewayController {
    register(req: Request, res: Response, next: NextFunction);
    login(req: Request, res: Response, next: NextFunction);
    getAllUsersByRole(req: Request, res: Response, next: NextFunction);
    execute(req: Request, res: Response, next: NextFunction);
    toggleActivation(req: Request, res: Response, next: NextFunction);
    delete(req: Request, res: Response, next: NextFunction);
}