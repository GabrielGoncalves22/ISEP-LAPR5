export interface Elevator {
    brand: string;
    model: string;
    serialNumber: string;
    description: string;
    building?: string;
    floors: {
        number: number
    }[];
}