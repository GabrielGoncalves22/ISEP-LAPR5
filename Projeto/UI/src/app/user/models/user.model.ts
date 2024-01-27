export interface User {
    name: string;
    email: string;
    password: string;
    telephone: string;
    taxPayerNumber?: string
    role: string;
    active?: boolean;
}