import { Result } from "../../core/logic/Result";
import IPassagewayDTO from "../../dto/IPassagewayDTO";

export default interface IPassagewayService {
    createPassageway(passagewayDTO: IPassagewayDTO): Promise<Result<IPassagewayDTO>>;
    updatePassageway(passagewayCode: string, passagewayDTO: IPassagewayDTO): Promise<Result<IPassagewayDTO>>;
    getPassagewaysBetweenBuildings(building1?: string, building2?: string): Promise<Result<IPassagewayDTO[]>>
}
