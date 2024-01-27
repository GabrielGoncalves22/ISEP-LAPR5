import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IUserPersistence } from '../dataschema/IUserPersistence';

import IUserDTO from "../dto/IUserDTO";
import { User } from "../domain/user/user";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class UserMap extends Mapper<User> {

    public static toDTO(user: User): IUserDTO {
        return {
            id: user.id.toString(),
            name: user.name.toString(),
            email: user.email.toString(),
            telephone: user.telephone.toString(),
            taxPayerNumber: user.taxPayerNumber ? user.taxPayerNumber.toString() : undefined,
            role: user.role.toString(),
        } as IUserDTO;
    }

    public static toDTOWithActivation(user: User): IUserDTO {
        return {
            id: user.id.toString(),
            name: user.name.toString(),
            email: user.email.toString(),
            telephone: user.telephone.toString(),
            taxPayerNumber: user.taxPayerNumber ? user.taxPayerNumber.toString() : undefined,
            role: user.role.toString(),
            active: user.active
        } as IUserDTO;
    }

    public static toDomain(user: any | Model<IUserPersistence & Document>): User {
        const userOrError = User.create(
            user,
            new UniqueEntityID(user.domainId)
        );

        userOrError.isFailure ? console.log(userOrError.error) : '';

        return userOrError.isSuccess ? userOrError.getValue() : null;
    }

    public static toPersistence(user: User): any {
        return {
            domainId: user.id.toString(),
            name: user.name.toString(),
            email: user.email.toString(),
            password: user.password.toString(),
            telephone: user.telephone.toString(),
            taxPayerNumber: user.taxPayerNumber ? user.taxPayerNumber.toString() : undefined,
            role: user.role.toString(),
            active: user.active
        }
    }
}