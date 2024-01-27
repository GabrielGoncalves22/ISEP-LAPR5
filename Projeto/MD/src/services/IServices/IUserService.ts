import { Result } from "../../core/logic/Result";
import IUserDTO from "../../dto/IUserDTO";

export default interface IUserService {
    updateProfile(userId: string, userDTO: IUserDTO): Promise<Result<IUserDTO>>
    register(userDTO: IUserDTO): Promise<Result<{ user: IUserDTO, token: string }>>;
    login(userEmail: string, userPassword: string, withFacebook: boolean): Promise<Result<{ user: IUserDTO, token: string }>>;
    me(userId: string): Promise<Result<IUserDTO>>;
    getAllUsersByRole(role?: string): Promise<Result<IUserDTO[]>>;
    toggleActivation(userEmail: string): Promise<Result<IUserDTO>>;
    delete(id: string): Promise<Result<string>>;
}