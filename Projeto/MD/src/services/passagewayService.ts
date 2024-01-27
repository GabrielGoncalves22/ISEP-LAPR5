import { Service, Inject } from 'typedi';
import config from "../../config";
import IPassagewayDTO from '../dto/IPassagewayDTO';
import { Building } from "../domain/building/building";
import { Floor } from "../domain/building/floor";
import { Passageway } from "../domain/building/passageway";
import { PassagewayCode } from "../domain/building/passagewayCode";
import IPassagewayRepo from '../services/IRepos/IPassagewayRepo';
import IBuildingRepo from '../services/IRepos/IBuildingRepo';
import IPassagewayService from './IServices/IPassagewayService';
import { Result } from "../core/logic/Result";
import { PassagewayMap } from "../mappers/PassagewayMap";

@Service()
export default class PassagewayService implements IPassagewayService {
    constructor(
        @Inject(config.repos.passageway.name) private passagewayRepo: IPassagewayRepo,
        @Inject(config.repos.building.name) private buildingRepo: IBuildingRepo
    ) { }

    public async createPassageway(passagewayDTO: IPassagewayDTO): Promise<Result<IPassagewayDTO>> {
        try {
            const code1OrError = PassagewayCode.create(passagewayDTO.building1, passagewayDTO.floor1, passagewayDTO.building2, passagewayDTO.floor2);
            if (code1OrError.isFailure) {
                return Result.fail<IPassagewayDTO>(code1OrError.errorValue());
            }

            const code2OrError = PassagewayCode.create(passagewayDTO.building2, passagewayDTO.floor2, passagewayDTO.building1, passagewayDTO.floor1);
            if (code2OrError.isFailure) {
                return Result.fail<IPassagewayDTO>(code1OrError.errorValue());
            }

            const building1OrError = await this.getBuilding(passagewayDTO.building1);
            if (building1OrError.isFailure) {
                return Result.fail<IPassagewayDTO>(building1OrError.errorValue());
            }

            const floor1OrError = await this.getFloor(passagewayDTO.building1, passagewayDTO.floor1);
            if (floor1OrError.isFailure) {
                return Result.fail<IPassagewayDTO>(floor1OrError.errorValue());
            }

            const building2OrError = await this.getBuilding(passagewayDTO.building2);
            if (building2OrError.isFailure) {
                return Result.fail<IPassagewayDTO>(building2OrError.errorValue());
            }

            const floor2OrError = await this.getFloor(passagewayDTO.building2, passagewayDTO.floor2);
            if (floor2OrError.isFailure) {
                return Result.fail<IPassagewayDTO>(floor2OrError.errorValue());
            }

            const passagewayExists = await this.passagewayExists(passagewayDTO.building1, passagewayDTO.floor1, passagewayDTO.building2, passagewayDTO.floor2);
            if (passagewayExists) {
                return Result.fail<IPassagewayDTO>("The indicated passageway already exists.");
            }

            if (passagewayDTO.building1 === passagewayDTO.building2) {
                return Result.fail<IPassagewayDTO>("It is not possible to have a passage within the same building.");
            }

            const passagewayOrError = [
                Passageway.create({
                    code: code1OrError.getValue(),
                    building1: building1OrError.getValue(),
                    floor1: floor1OrError.getValue(),
                    building2: building2OrError.getValue(),
                    floor2: floor2OrError.getValue(),
                    cellOrientation: null,
                    xStartCell: null,
                    yStartCell: null
                }),
                Passageway.create({
                    code: code2OrError.getValue(),
                    building1: building2OrError.getValue(),
                    floor1: floor2OrError.getValue(),
                    building2: building1OrError.getValue(),
                    floor2: floor1OrError.getValue(),
                    cellOrientation: null,
                    xStartCell: null,
                    yStartCell: null
                })];

            passagewayOrError.forEach(async passageway => {
                if (passageway.isFailure) {
                    return Result.fail<IPassagewayDTO>(passageway.errorValue());
                }

                const passagewayResult = passageway.getValue();

                if ((await this.passagewayRepo.save(passagewayResult)) === null) {
                    return Result.fail<IPassagewayDTO>("The passageway with the code " + passageway.getValue().code + " already exists.");
                }
            });

            const passagewayDTOResult = PassagewayMap.toDTO(passagewayOrError[0].getValue()) as IPassagewayDTO;
            return Result.ok<IPassagewayDTO>(passagewayDTOResult)
        } catch (e) {
            throw e;
        }
    }

    public async getPassagewaysBetweenBuildings(building1?: string, building2?: string): Promise<Result<IPassagewayDTO[]>> {
        try {
            let passageways;
            if (building1 && building2) {
                // Procurar entre 2 edifícios específicos
                passageways = await this.passagewayRepo.findAllPassageways(building1, building2);
            } else {
                // Procurar todas as passagens entre todos os edifícios
                passageways = await this.passagewayRepo.findAllPassageways();
            }

            if (!passageways || passageways.length === 0 || passageways == null) {
                if (building1 && building2) {
                    return Result.fail<IPassagewayDTO[]>("There isn't any created passageways between the buildings " + building1 + " and " + building2 + ".");
                } else {
                    return Result.fail<IPassagewayDTO[]>("There isn't any created passageways in the whole system.");
                }
            }

            let passagewaysDTO: IPassagewayDTO[] = [];
            passageways.forEach(passageway => {
                passagewaysDTO.push(PassagewayMap.toDTO(passageway) as IPassagewayDTO);
            });

            return Result.ok<IPassagewayDTO[]>(passagewaysDTO);
        } catch (e) {
            throw e;
        }

    }

    public async updatePassageway(passagewayCode: string, passagewayDTO: IPassagewayDTO): Promise<Result<IPassagewayDTO>> {
        try {
            const passagewayExists = await this.getPassageway(passagewayCode);
            if (passagewayExists.isFailure) {
                return Result.fail<IPassagewayDTO>(passagewayExists.errorValue());
            }

            const passagewayResult = passagewayExists.getValue();

            if (passagewayDTO.building1 != undefined) {
                const building1OrError = await this.getBuilding(passagewayDTO.building1);
                if (building1OrError.isFailure) {
                    return Result.fail<IPassagewayDTO>(building1OrError.errorValue());
                }

                if (passagewayDTO.floor1 == undefined) {
                    const checkFloorExists = await this.getFloor(passagewayDTO.building1, Number(passagewayResult.floor1));
                    if (checkFloorExists.isFailure) {
                        return Result.fail<IPassagewayDTO>(checkFloorExists.errorValue());
                    }
                }
                passagewayResult.changeBuildingOne = building1OrError.getValue();
            }

            if (passagewayDTO.building2 != undefined) {
                const building2OrError = await this.getBuilding(passagewayDTO.building2);
                if (building2OrError.isFailure) {
                    return Result.fail<IPassagewayDTO>(building2OrError.errorValue());
                }

                if (passagewayDTO.floor2 == undefined) {
                    const checkFloorExists = await this.getFloor(passagewayDTO.building2, Number(passagewayResult.floor2));
                    if (checkFloorExists.isFailure) {
                        return Result.fail<IPassagewayDTO>(checkFloorExists.errorValue());
                    }
                }
                passagewayResult.changeBuildingTwo = building2OrError.getValue();
            }

            if (passagewayDTO.floor1 != undefined) {
                let floor1OrError;
                if (passagewayDTO.building1 != undefined) {
                    floor1OrError = await this.getFloor(passagewayDTO.building1, passagewayDTO.floor1);
                } else {
                    floor1OrError = await this.getFloor(String(passagewayResult.building1), passagewayDTO.floor1);
                }

                if (floor1OrError.isFailure) {
                    return Result.fail<IPassagewayDTO>(floor1OrError.errorValue());
                }

                passagewayResult.changeFloorOne = floor1OrError.getValue();
            }

            if (passagewayDTO.floor2 != undefined) {
                let floor2OrError;

                if (passagewayDTO.building2 != undefined) {
                    floor2OrError = await this.getFloor(passagewayDTO.building2, passagewayDTO.floor2);
                } else {
                    floor2OrError = await this.getFloor(String(passagewayResult.building2), passagewayDTO.floor2);
                }

                if (floor2OrError.isFailure) {
                    return Result.fail<IPassagewayDTO>(floor2OrError.errorValue());
                }
                passagewayResult.changeFloorTwo = floor2OrError.getValue();
            }

            if ((await this.passagewayRepo.update(passagewayResult)) === null) {
                return Result.fail<IPassagewayDTO>("Something went wrong!");
            }

            const passagewayDTOResult = PassagewayMap.toDTO(passagewayResult) as IPassagewayDTO;
            return Result.ok<IPassagewayDTO>(passagewayDTOResult);
        } catch (e) {
            throw e;
        }
    }

    private async getBuilding(buildingCode: string): Promise<Result<Building>> {
        const building = await this.buildingRepo.findByCode(buildingCode);

        if (building) {
            return Result.ok<Building>(building);
        } else {
            return Result.fail<Building>("Couldn't find building by code " + buildingCode + ".");
        }
    }

    private async getFloor(buildingCode: string, floorNumber: number): Promise<Result<Floor>> {
        const floor = await this.buildingRepo.findFloor(buildingCode, floorNumber);

        if (floor) {
            return Result.ok<Floor>(floor);
        } else {
            return Result.fail<Floor>("Couldn't find floor number " + floorNumber + " in the building with the code " + buildingCode + ".");
        }
    }

    private async passagewayExists(buildingCode1: string, floorNumber1: number, buildingCode2: string, floorNumber2: number): Promise<boolean> {
        const passageway = await this.passagewayRepo.findPassageway(buildingCode1, floorNumber1, buildingCode2, floorNumber2);

        return passageway ? true : false;
    }

    private async getPassageway(passagewayCode: string): Promise<Result<Passageway>> {
        const passageway = await this.passagewayRepo.findByCode(passagewayCode);

        if (passageway) {
            return Result.ok<Passageway>(passageway);
        } else {
            return Result.fail<Passageway>("Couldn't find building by code " + passagewayCode + ".");
        }
    }
}
