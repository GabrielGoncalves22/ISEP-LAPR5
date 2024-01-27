export interface IUserPersistence {
	domainId: string;
	name: string;
	email: string;
	password: string;
	telephone: string;
	taxPayerNumber?: string
	role: string;
	active?: boolean;
}