import { Repo } from "../../core/infra/Repo";
import { Passageway } from "../../domain/building/passageway";

export default interface IPassagewayRepo extends Repo<Passageway> {
	save(passageway: Passageway): Promise<Passageway>;
	update(passageway: Passageway): Promise<Passageway>;
	findByCode(passagewayCode: string): Promise<Passageway>;
	findPassageway(buildingCode1: string, floorNumber1: number, buildingCode2: string, floorNumber2: number): Promise<Passageway>;
	findAllPassageways(building1?: string, building2?: string): Promise<Passageway[]>;
	findPassagewayWithBuilding(buildingCode: string): Promise<Passageway[]>;
	findFloorPassageways(buildingCode: string, floorNumber: number): Promise<Passageway[]>;
}
