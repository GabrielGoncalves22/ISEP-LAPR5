export default interface IBuildingDTO {
    code: string;
    name: string;
    description: string;
    numXCells: number;
    numYCells: number;
    floors: {
        number: number,
        description: string
    }[];
    elevator?: {
        brand: string;
        model: string;
        serialNumber: string;
        description: string;
        floors: {
            number: number
        }[];
    } | null
}