import { Request, Response, NextFunction } from 'express';

const verifyUserRole = async (req, res: Response, next: NextFunction, roleName: string) => {
    try {
        const decodedToken = req.auth;

        if (!decodedToken || !decodedToken.exp || !decodedToken.role) {
            res.status(401).json({ error: "Non-existent or invalid token" });
        } else if (decodedToken.exp < Date.now()) {
            res.status(401).json({ error: "Token has expired" });
        } else if (decodedToken.role !== roleName) {
            res.status(401).json({ error: "The user does not have the required permissions" });
        } else {
            return next();
        }
    } catch (e) {
        return next(e);
    }
};

const verifyRoleSystemManager = async (req: Request, res: Response, next: NextFunction) => {
    await verifyUserRole(req, res, next, "System Manager");
};

const verifyRoleCampusManager = async (req: Request, res: Response, next: NextFunction) => {
    await verifyUserRole(req, res, next, "Campus Manager");
};

const verifyRoleFleetManager = async (req: Request, res: Response, next: NextFunction) => {
    await verifyUserRole(req, res, next, "Fleet Manager");
};

const verifyRoleTaskManager = async (req: Request, res: Response, next: NextFunction) => {
    await verifyUserRole(req, res, next, "Task manager");
};

const verifyRoleUser = async (req: Request, res: Response, next: NextFunction) => {
    await verifyUserRole(req, res, next, "User");
};

export default { verifyRoleSystemManager, verifyRoleCampusManager, verifyRoleFleetManager, verifyRoleTaskManager, verifyRoleUser };