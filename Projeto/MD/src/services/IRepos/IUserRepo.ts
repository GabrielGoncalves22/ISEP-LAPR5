import { Repo } from "../../core/infra/Repo";
import { User } from "../../domain/user/user";
import { UserEmail } from "../../domain/user/userEmail";
import { UserId } from "../../domain/user/userId";
import { UserTaxPayerNumber } from "../../domain/user/userTaxPayerNumber";
import { UserTelephone } from "../../domain/user/userTelephone";

export default interface IUserRepo extends Repo<User> {
	save(user: User): Promise<User>;
	update(user: User): Promise<User>;
	delete(userId: string): Promise<boolean>;
	findAll(role?: string): Promise<User[]>;
	findById(userId: UserId | string): Promise<User>;
	findByEmail(userEmail: UserEmail | string): Promise<User>;
	findByTelephone(userTelephone: UserTelephone | string): Promise<User>;
	findByTaxPayerNumber(userTaxPayerNumber: UserTaxPayerNumber | string): Promise<User>;
}