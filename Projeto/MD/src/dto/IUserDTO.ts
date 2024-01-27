export default interface IUserDTO {
    id: string;
    name: string;
    email: string;
    password?: string;
    telephone: string;
    taxPayerNumber?: string
    role: string;
    active?: boolean;
}