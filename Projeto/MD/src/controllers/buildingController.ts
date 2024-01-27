import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IBuildingController from "./IControllers/IBuildingController";
import IBuildingService from '../services/IServices/IBuildingService';
import IBuildingDTO from '../dto/IBuildingDTO';
import IBuildingInfoDTO from '../dto/IBuildingInfoDTO';
import IFloorDTO from '../dto/IFloorDTO';
import IElevatorDTO from '../dto/IElevatorDTO';
import IRoomDTO from '../dto/IRoomDTO';
import IFloorInfoDTO from '../dto/IFloorInfoDTO';
import IFloorMapDTO from '../dto/IFloorMapDTO';

import { Result } from "../core/logic/Result";
import { BaseController } from '../core/infra/BaseController';
import IRoomLocalizationDTO from '../dto/IRoomLocalizationDTO';

@Service()
export default class BuildingController extends BaseController implements IBuildingController {
    constructor(
        @Inject(config.services.building.name) private buildingServiceInstance: IBuildingService
    ) {
        super();
    }

    protected executeImpl(): Promise<any> {
        if (this.req.method === "POST") {
            if (this.req.url.includes("/floors") && this.req.params.buildingCode) {
                return this.checkBuildingFloors(this.req, this.res, this.next);
            } else {
                switch (this.req.url) {
                    case "/":
                        return this.createBuilding(this.req, this.res, this.next);
                    case "/floors":
                        return this.createFloor(this.req, this.res, this.next);
                    case "/elevators":
                        return this.createElevator(this.req, this.res, this.next);
                    case "/rooms":
                        return this.createRoom(this.req, this.res, this.next);
                }
            }
        } else if (this.req.method === "PUT" || this.req.method === "PATCH") {
            const url = this.req.url;

            if (url.includes('/elevators')) {
                return this.updateElevator(this.req, this.res, this.next);
            } else if (url.includes('/floors') && url.includes('/map')) {
                return this.loadMap(this.req, this.res, this.next);
            } else if(url.includes('/floors')) {
                return this.updateFloor(this.req, this.res, this.next);
            } else {
                return this.updateBuilding(this.req, this.res, this.next);
            }

        } else if (this.req.method === "GET") {
            const url = this.req.url;

            if (url.includes('/elevators')) {
                return this.getElevatorByBuilding(this.req, this.res, this.next);
            } else if (url.includes('/floors')) {
                if (url.includes('/map')) {
                    return this.getMap(this.req, this.res, this.next);
                } else if (url.includes('/passageways')) {
                    return this.getFloorsWithPassagewaysToBuildingByBuilding(this.req, this.res, this.next);
                } else {
                    return this.getFloorsByBuilding(this.req, this.res, this.next);
                }  
            } else if (this.req.url.includes("/rooms")) {
                if (this.req.params.buildingCode !== undefined && this.req.params.roomName !== undefined) {
                    return this.getRoomByCode(this.req, this.res, this.next);
                } else {
                    return this.getAllRooms(this.req, this.res, this.next);
                }
            } else {
                if (this.req.query && Object.keys(this.req.query).length > 0) {
                    return this.getBuildingsBetweenMinAndMaxFloors(this.req, this.res, this.next);
                } else if (Object.keys(this.req.params).length === 1) {
                    return this.getBuildingByCode(this.req, this.res, this.next);
                } else {
                    return this.getAllBuildings(this.req, this.res, this.next);
                }
            }
        }
    }

    public async createBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingOrError = await this.buildingServiceInstance.createBuilding(req.body as IBuildingDTO) as Result<IBuildingDTO>;

            if (buildingOrError.isFailure) {
                return super.badRequest(res, buildingOrError.error.toString());
            }

            return super.created(res, buildingOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async updateBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingOrError = await this.buildingServiceInstance.updateBuilding(req.params.code, req.body as IBuildingDTO) as Result<IBuildingDTO>;

            if (buildingOrError.isFailure) {
                return super.badRequest(res, buildingOrError.error.toString());
            }

            return super.ok(res, buildingOrError.getValue());
        } catch (e) {
            return next(e);
        }
    }

    public async createFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const floorOrError = await this.buildingServiceInstance.createFloor(req.body as IFloorDTO) as Result<IFloorDTO>;

            if (floorOrError.isFailure) {
                return super.badRequest(res, floorOrError.error.toString());
            }

            return super.created(res, floorOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async createElevator(req: Request, res: Response, next: NextFunction) {
        try {
            const elevatorOrError = await this.buildingServiceInstance.createElevator(req.body as IElevatorDTO) as Result<IElevatorDTO>;

            if (elevatorOrError.isFailure) {
                return super.badRequest(res, elevatorOrError.error.toString());
            }

            return super.created(res, elevatorOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async updateElevator(req: Request, res: Response, next: NextFunction) {
        try {
            const elevatorOrError = await this.buildingServiceInstance.updateElevator(req.params.code, req.body as IElevatorDTO) as Result<IElevatorDTO>;

            if (elevatorOrError.isFailure) {
                return super.badRequest(res, elevatorOrError.error.toString());
            }

            return super.ok(res, elevatorOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async updateFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const floorOrError = await this.buildingServiceInstance.updateFloor(req.params.code, Number(req.params.number), req.body as IFloorDTO) as Result<IFloorDTO>;

            if (floorOrError.isFailure) {
                return super.badRequest(res, floorOrError.error.toString());
            }

            return super.ok(res, floorOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async loadMap(req: Request, res: Response, next: NextFunction) {
        try {
            const dataExtractedFromFile = this.buildingServiceInstance.validateMapFileData(this.req.file.buffer);
            if (dataExtractedFromFile.isFailure) {
                return super.badRequest(res, dataExtractedFromFile.error.toString());
            }

            const mapOrError = await this.buildingServiceInstance.loadMap(req.params.buildingCode, Number(req.params.floorNumber), dataExtractedFromFile.getValue()) as Result<IFloorMapDTO>;
            if (mapOrError.isFailure) {
                return super.badRequest(res, mapOrError.error.toString());
            }

            return super.ok(res, mapOrError.getValue());
        } catch(e) {
            return next(e);
        }
    }

    public async createRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const roomOrError = await this.buildingServiceInstance.createRoom(req.body as IRoomDTO) as Result<IRoomDTO>;

            if (roomOrError.isFailure) {
                return super.badRequest(res, roomOrError.error.toString());
            }

            return super.created(res, roomOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getElevatorByBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const elevatorOrError = await this.buildingServiceInstance.getElevatorByBuilding(req.params.code) as Result<IElevatorDTO>;

            if (elevatorOrError.isFailure) {
                return super.notFound(res, elevatorOrError.error.toString());
            }

            return super.ok(res, elevatorOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getBuildingsBetweenMinAndMaxFloors(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingOrError = await this.buildingServiceInstance.getBuildingsBetweenMinAndMaxFloors(Number(req.query.min), Number(req.query.max)) as Result<IBuildingInfoDTO[]>;

            if (buildingOrError.isFailure) {
                return super.badRequest(res, buildingOrError.error.toString());
            }

            return super.ok(res, buildingOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getAllBuildings(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingsOrError = await this.buildingServiceInstance.getBuildings() as Result<IBuildingInfoDTO[]>;

            if (buildingsOrError.isFailure) {
                return super.badRequest(res, buildingsOrError.error.toString());
            }

            return super.ok(res, buildingsOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getBuildingByCode(req: Request, res: Response, next: NextFunction) {
        try {
            const buildingOrError = await this.buildingServiceInstance.getBuildingByCode(req.params.code) as Result<IBuildingInfoDTO>;

            if (buildingOrError.isFailure) {
                return super.notFound(res, buildingOrError.error.toString());
            }

            return super.ok(res, buildingOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getFloorsByBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const floorsOrError = await this.buildingServiceInstance.getFloorsByBuilding(req.params.code) as Result<IFloorInfoDTO[]>;

            if (floorsOrError.isFailure) {
                return super.badRequest(res, floorsOrError.error.toString());
            }

            return super.ok(res, floorsOrError.getValue());
        } catch (e) {
            return next(e);
        }
    };

    public async getFloorsWithPassagewaysToBuildingByBuilding(req: Request, res: Response, next: NextFunction) {
        try {
            const floorsOrError = await this.buildingServiceInstance.getFloorsWithPassagewaysToBuildingByBuilding(req.params.code) as Result<IFloorDTO[][]>;
            
            if (floorsOrError.isFailure) {
                return super.badRequest(res, floorsOrError.error.toString());
            }

            return super.ok(res, floorsOrError.getValue());
        } catch(e) {
            return next(e);
        }
    }

    public async getMap(req: Request, res: Response, next: NextFunction) {
        try {
            const mapOrError = await this.buildingServiceInstance.getMap(req.params.buildingCode, Number(req.params.floorNumber)) as Result<IFloorMapDTO>;
            
            if (mapOrError.isFailure) {
                return super.badRequest(res, mapOrError.error.toString());
            }

            return super.ok(res, mapOrError.getValue());
        } catch(e) {
            return next(e);
        }
    }

    public async getRoomByCode(req: Request, res: Response, next: NextFunction) {
        try {
            const roomOrError = await this.buildingServiceInstance.getRoomByName(req.params.buildingCode, req.params.roomName) as Result<IRoomLocalizationDTO>;

            if (roomOrError.isFailure) {
                return super.notFound(res, roomOrError.error.toString());
            }
            
            return super.ok(res, roomOrError.getValue());
        } catch (e) {
            return next(e);
        }
    }

    public async getAllRooms(req: Request, res: Response, next: NextFunction) {
        try {
            const roomsOrError = await this.buildingServiceInstance.getAllRooms() as Result<IRoomDTO[]>;

            if (roomsOrError.isFailure) {
                return super.notFound(res, roomsOrError.error.toString());
            }

            return super.ok(res, roomsOrError.getValue());
        } catch (e) {
            return next(e);
        }
    }

    public async checkBuildingFloors(req: Request, res: Response, next: NextFunction) {
        try {
            const checkBuildingFloors = await this.buildingServiceInstance.checkBuildingFloors(req.params.buildingCode, req.body.floors as number[]) as Result<string>;
            
            if (checkBuildingFloors.isFailure) {
                return super.notFound(res, checkBuildingFloors.error);
            }

            return super.ok(res, checkBuildingFloors.getValue());
        } catch(e) {
            return next(e);
        }
    }
}