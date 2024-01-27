import { Request, Response, NextFunction } from 'express';

export default interface IBuildingController {
    createBuilding(req: Request, res: Response, next: NextFunction);
    updateBuilding(req: Request, res: Response, next: NextFunction);
    createFloor(req: Request, res: Response, next: NextFunction);
    createElevator(req: Request, res: Response, next: NextFunction);
    createRoom(req: Request, res: Response, next: NextFunction);
    updateElevator(req: Request, res: Response, next: NextFunction);
    updateFloor(req: Request, res: Response, next: NextFunction);
    loadMap(req: Request, res: Response, next: NextFunction);
    getElevatorByBuilding(req: Request, res: Response, next: NextFunction);
    getBuildingsBetweenMinAndMaxFloors(req: Request, res: Response, next: NextFunction);
    getAllBuildings(req: Request, res: Response, next: NextFunction);
    getBuildingByCode(req: Request, res: Response, next: NextFunction);
    getFloorsByBuilding(req: Request, res: Response, next: NextFunction);
    getFloorsWithPassagewaysToBuildingByBuilding(req: Request, res: Response, next: NextFunction);
    getMap(req: Request, res: Response, next: NextFunction);
    checkBuildingFloors(req: Request, res: Response, next: NextFunction);
    getRoomByCode(req: Request, res: Response, next: NextFunction);
    getAllRooms(req: Request, res: Response, next: NextFunction);
    execute(req: Request, res: Response, next: NextFunction);
}