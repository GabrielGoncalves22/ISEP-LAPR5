import { Response, NextFunction } from 'express';

const attachCurrentUser = async (req, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.auth;

        if (!decodedToken || !decodedToken.exp) {
            res.status(401).json({ error: "Non-existent or invalid token!" });
        } else if (decodedToken.exp < Date.now()) {
            res.status(401).json({ error: "Token has expired" });
        } else {
            return next();
        }
    } catch (e) {
        return next(e);
    }
};

export default attachCurrentUser;