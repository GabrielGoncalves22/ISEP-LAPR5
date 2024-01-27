import { Service, Inject } from 'typedi';
import { Document, FilterQuery, Model } from 'mongoose';

import { IUserPersistence } from '../dataschema/IUserPersistence';

import IUserRepo from "../services/IRepos/IUserRepo";
import { UserMap } from "../mappers/UserMap";
import { User } from "../domain/user/user";
import { UserId } from "../domain/user/userId";
import { UserEmail } from "../domain/user/userEmail";
import { UserTelephone } from '../domain/user/userTelephone';
import { UserTaxPayerNumber } from '../domain/user/userTaxPayerNumber';

@Service()
export default class UserRepo implements IUserRepo {
    private models: any;

    constructor(
        @Inject('userSchema') private userSchema: Model<IUserPersistence & Document>,
    ) { }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async exists(user: User): Promise<boolean> {
        const idX = user.id instanceof UserId ? (<UserId>user.id).toValue() : user.id;

        const query = { domainId: idX };
        const deviceTypeDocument = await this.userSchema.findOne(query as FilterQuery<IUserPersistence & Document>);

        return !!deviceTypeDocument === true;
    }

    public async save(user: User): Promise<User> {
        const query = { domainId: user.id.toString() };

        const userDocument = await this.userSchema.findOne(query);

        try {
            if (userDocument === null) {
                const rawuser: any = UserMap.toPersistence(user);

                const userCreated = await this.userSchema.create(rawuser);

                return UserMap.toDomain(userCreated);
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
    }

    public async update(user: User): Promise<User> {
        const query = { domainId: user.id.toString() };

        try {
            const rawuser: IUserPersistence = UserMap.toPersistence(user);

            await this.userSchema.updateOne(query, rawuser);
        } catch (err) {
            throw err;
        }

        return user;
    }

    public async delete(userId: string): Promise<boolean> {

        const query = { domainId: userId };
    
        try {
            const result = await this.userSchema.deleteOne(query);
    
            if (result.deletedCount && result.deletedCount > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    }
    
    public async findAll(role?: string): Promise<User[]> {
        const query = role ? { role } : {};
        const userRecords = await this.userSchema.find(query).lean();
    
        if (userRecords != null) {
            const users = userRecords.map((userRecord) => UserMap.toDomain(userRecord));

            return users;
        }
        return null;
    }
    
    public async findById(userId: UserId | string): Promise<User> {
        const query = { domainId: userId};
        const userRecord = await this.userSchema.findOne(query).lean();

        if (userRecord != null) {
            return UserMap.toDomain(userRecord);
        } else {
            return null;
        }
    }

    public async findByEmail(userEmail: UserEmail | string): Promise<User> {
        const query = { email: userEmail.toString() };
        const userRecord = await this.userSchema.findOne(query).lean();

        if (userRecord != null) {
            return UserMap.toDomain(userRecord);
        } else {
            return null;
        }
    }

    public async findByTelephone(userTelephone: UserTelephone | string): Promise<User> {
        const query = { telephone: userTelephone.toString() };
        const userRecord = await this.userSchema.findOne(query).lean();

        if (userRecord != null) {
            return UserMap.toDomain(userRecord);
        } else {
            return null;
        }
    }

    public async findByTaxPayerNumber(userTaxPayerNumber: UserTaxPayerNumber | string): Promise<User> {
        const query = { taxPayerNumber: userTaxPayerNumber.toString() };
        const userRecord = await this.userSchema.findOne(query).lean();

        if (userRecord != null) {
            return UserMap.toDomain(userRecord);
        } else {
            return null;
        }
    }
}