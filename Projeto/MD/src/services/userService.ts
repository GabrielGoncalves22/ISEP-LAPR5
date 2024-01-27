import { Service, Inject } from 'typedi';
import { Result } from "../core/logic/Result";

import jwt from 'jsonwebtoken';
import config from '../../config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';

import IUserService from '../services/IServices/IUserService';
import { UserMap } from "../mappers/UserMap";
import IUserDTO from '../dto/IUserDTO';

import IUserRepo from './IRepos/IUserRepo';

import { User } from '../domain/user/user';
import { UserName } from '../domain/user/userName';
import { UserEmail } from '../domain/user/userEmail';
import { UserPassword } from '../domain/user/userPassword';
import { UserTelephone } from '../domain/user/userTelephone';
import { UserTaxPayerNumber } from '../domain/user/userTaxPayerNumber';
import { Role } from '../domain/user/role';

@Service()
export default class UserService implements IUserService {
    constructor(
        @Inject(config.repos.user.name) private userRepo: IUserRepo,
    ) { }

    public async register(userDTO: IUserDTO): Promise<Result<{ user: IUserDTO, token: string }>> {
        try {
            let user = await this.userRepo.findByEmail(userDTO.email);
            if (user) {
                return Result.fail<{ user: IUserDTO, token: string }>(`User already exists with email ${userDTO.email}!`);
            }

            user = await this.userRepo.findByTelephone(userDTO.telephone);
            if (user) {
                return Result.fail<{ user: IUserDTO, token: string }>(`User already exists with telephone number ${userDTO.telephone}!`);
            }

            const nameOrError = UserName.create(userDTO.name);
            if (nameOrError.isFailure) {
                return Result.fail<{ user: IUserDTO, token: string }>(nameOrError.errorValue());
            }

            const emailOrError = UserEmail.create(userDTO.email);
            if (emailOrError.isFailure) {
                return Result.fail<{ user: IUserDTO, token: string }>(emailOrError.errorValue());
            }

            const validPassword = UserPassword.isAppropriatePolicy(userDTO.password);
            if (!validPassword) {
                return Result.fail<{ user: IUserDTO, token: string }>("'Password doesnt meet criteria [1 uppercase, 1 lowercase, 1 digit, 1 symbol and 10 chars min]!");
            }

            const salt = randomBytes(32);
            const hashedPassword = await argon2.hash(userDTO.password, { salt });

            const passwordOrError = UserPassword.create({ password: hashedPassword, hashed: true });
            if (passwordOrError.isFailure) {
                return Result.fail<{ user: IUserDTO, token: string }>(passwordOrError.errorValue());
            }

            const telephoneOrError = UserTelephone.create(userDTO.telephone);
            if (telephoneOrError.isFailure) {
                return Result.fail<{ user: IUserDTO, token: string }>(telephoneOrError.errorValue());
            }

            let taxPayerNumberOrError: Result<UserTaxPayerNumber>;
            if (userDTO.taxPayerNumber) {
                user = await this.userRepo.findByTaxPayerNumber(userDTO.taxPayerNumber);

                if (user) {
                    return Result.fail<{ user: IUserDTO, token: string }>(`User already exists with tax payer number ${userDTO.taxPayerNumber}!`);
                }

                taxPayerNumberOrError = UserTaxPayerNumber.create(userDTO.taxPayerNumber);
                if (taxPayerNumberOrError.isFailure) {
                    return Result.fail<{ user: IUserDTO, token: string }>(taxPayerNumberOrError.errorValue());
                }
            } else {
                if (userDTO.role && !(Object.values(Role) as string[]).includes(userDTO.role)) {
                    return Result.fail<{ user: IUserDTO, token: string }>("The role is invalid!");
                }
            }

            const userOrError = User.create({
                name: nameOrError.getValue(),
                email: emailOrError.getValue(),
                password: passwordOrError.getValue(),
                telephone: telephoneOrError.getValue(),
                taxPayerNumber: taxPayerNumberOrError ? taxPayerNumberOrError.getValue() : undefined,
                role: userDTO.role ? userDTO.role as Role : undefined
            });

            if (userOrError.isFailure) {
                throw Result.fail<IUserDTO>(userOrError.errorValue());
            }

            const userResult = userOrError.getValue();
            const token = this.generateToken(userResult);

            await this.userRepo.save(userResult);

            const userDTOResult = UserMap.toDTO(userResult) as IUserDTO;
            return Result.ok<{ user: IUserDTO, token: string }>({ user: userDTOResult, token: token });
        } catch (e) {
            throw e;
        }
    }

    public async login(userEmail: string, userPassword: string, withFacebook: boolean): Promise<Result<{ user: IUserDTO, token: string }>> {
        try {
            const user = await this.userRepo.findByEmail(userEmail);

            if (!user) {
                return Result.fail<{ user: IUserDTO, token: string }>("The user with email " + userEmail + " doesn't exist!");
            }

            if (withFacebook) {
                return this.loginWithFacebook(user);
            } else {
                return this.loginWithPassword(user, userPassword);
            }
        } catch (e) {
            throw e;
        }
    }

    private async loginWithFacebook(user: User): Promise<Result<{ user: IUserDTO, token: string }>> {
        try {
            if (!user.active) {
                return Result.fail<{ user: IUserDTO, token: string }>('Your account has not yet been activated by an administrator!');
            }

            const token = this.generateToken(user) as string;
            const userDTO = UserMap.toDTO(user) as IUserDTO;

            return Result.ok<{ user: IUserDTO, token: string }>({ user: userDTO, token: token });
        } catch (e) {
            throw e;
        }
    }

    private async loginWithPassword(user: User, userPassword: string): Promise<Result<{ user: IUserDTO, token: string }>> {
        try {
            const validPassword = await argon2.verify(user.password.toString(), userPassword);

            if (validPassword) {
                if (!user.active) {
                    return Result.fail<{ user: IUserDTO, token: string }>('Your account has not yet been activated by an administrator!');
                }

                const token = this.generateToken(user) as string;
                const userDTO = UserMap.toDTO(user) as IUserDTO;

                return Result.ok<{ user: IUserDTO, token: string }>({ user: userDTO, token: token });
            } else {
                return Result.fail<{ user: IUserDTO, token: string }>('Your password is incorrect!');
            }
        } catch (e) {
            throw e;
        }
    }

    public async me(userId: string): Promise<Result<IUserDTO>> {
        try {
            const user = await this.userRepo.findById(userId);

            if (!user) {
                return Result.fail<IUserDTO>("The user doesn't exists!");
            }

            const userDTO = UserMap.toDTO(user) as IUserDTO;
            return Result.ok<IUserDTO>(userDTO);
        } catch (e) {
            throw e;
        }
    }

    public async getAllUsersByRole(role?: string): Promise<Result<IUserDTO[]>> {
        try {
            if (role != undefined && !Object.values(Role).includes(role as Role))
                return Result.fail<IUserDTO[]>("Invalid role.");

            const users = await this.userRepo.findAll(role);

            if (!users)
                return Result.fail<IUserDTO[]>("No users found");

            const userDTOs = users.map((user) => UserMap.toDTOWithActivation(user) as IUserDTO);

            return Result.ok<IUserDTO[]>(userDTOs);
        } catch (e) {
            throw e;
        }
    }

    public async toggleActivation(userEmail: string): Promise<Result<IUserDTO>> {
        try {
            const user = await this.userRepo.findByEmail(userEmail);

            if (!user)
                return Result.fail<IUserDTO>("The user doesn't exist!");

            user.toogleActivation();

            const updatedUser = await this.userRepo.update(user);

            if (!updatedUser)
                return Result.fail<IUserDTO>("Failed to update user in the database");

            const userDTO = UserMap.toDTOWithActivation(updatedUser);

            return Result.ok<IUserDTO>(userDTO);
        } catch (e) {
            throw e;
        }
    }

    public async updateProfile(userId: string, userDTO: IUserDTO): Promise<Result<IUserDTO>> {
        try {
            const user = await this.userRepo.findById(userId);

            if (!user) {
                return Result.fail<IUserDTO>("The user doesn't exist!");
            }

            const nameOrError = UserName.create(userDTO.name);
            if (nameOrError.isFailure) {
                return Result.fail<IUserDTO>(nameOrError.errorValue());
            }

            const telephoneOrError = UserTelephone.create(userDTO.telephone);
            if (telephoneOrError.isFailure) {
                return Result.fail<IUserDTO>(telephoneOrError.errorValue());
            }

            const newTelephone = telephoneOrError.getValue();
            if (user.telephone.toString() != newTelephone.toString() && await this.userRepo.findByTelephone(newTelephone.toString())) {
                return Result.fail<IUserDTO>(`User already exists with telephone number ${newTelephone.toString()}!`);
            }

            const taxPayerNumberOrError = UserTaxPayerNumber.create(userDTO.taxPayerNumber);
            if (taxPayerNumberOrError.isFailure) {
                return Result.fail<IUserDTO>(taxPayerNumberOrError.errorValue());
            }

            const newTaxPayerNumber = taxPayerNumberOrError.getValue();
            if (user.taxPayerNumber.toString() != newTaxPayerNumber.toString() && await this.userRepo.findByTaxPayerNumber(newTaxPayerNumber.toString())) {
                return Result.fail<IUserDTO>(`User already exists with tax payer number ${newTaxPayerNumber.toString()}!`);
            }

            user.name = nameOrError.getValue();
            user.telephone = newTelephone;
            user.taxPayerNumber = newTaxPayerNumber;

            if ((await this.userRepo.update(user)) === null) {
                return Result.fail<IUserDTO>("Something went wrong!");
            }

            const updatedUserDTO = UserMap.toDTO(user) as IUserDTO;

            return Result.ok<IUserDTO>(updatedUserDTO);
        } catch (e) {
            throw e;
        }
    }

    public async delete(id: string): Promise<Result<string>> {
        try {
            const deleted = await this.userRepo.delete(id);
            if (!deleted)
                return Result.fail<string>("The user does not exist")

            return Result.ok<string>("User deleted with success");
        } catch (e) {
            throw e;
        }
    }

    private generateToken(user: User) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 30);

        const tokenPayload = {
            id: user.id.toString(),
            name: user.name.toString(),
            email: user.email.toString(),
            telephone: user.telephone.toString(),
            role: user.role.toString(),
            exp: exp.getTime(),
        };

        return jwt.sign(tokenPayload, config.jwtSecret);
    }
}
