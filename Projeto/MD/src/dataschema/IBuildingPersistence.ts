export interface IBuildingPersistence {
    code: string;
    name: string;
    description: string;
    numXCells: number;
    numYCells: number;
    floors: {
        number: number;
        description: string;
        rooms: {
            name: string;
            description: string;
            category: string;
            xStartCell: number;
            yStartCell: number;
            xEndCell: number;
            yEndCell: number;
            doors: {
                yPositionCell: number;
                xPositionCell: number;
                cellOrientation: string;
            }[]
        }[],
        map: {
            cellInfo: number
        }[][]
    }[];
    elevator : {
        brand: string;
        model: string;
        serialNumber: string;
        description: string;
        floors: {
            number: number;
            elevatorCellOrientation: string;
        }[],
        xStartCell: number;
        yStartCell: number;
    }
}