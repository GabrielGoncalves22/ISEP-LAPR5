export default interface FloorMapDTO {
    floor: {
        size: {
            numXCells: number;
            numYCells: number;
        };
        map: number[][];
        passageways: {
            code: string;
            destinationBuilding: string;
            destinationFloor: number;
            xStartCell: number;
            yStartCell: number;
            cellOrientation: "north" | "west" | "south";
        }[];
        elevator: {
            xStartCell: number;
            yStartCell: number;
            cellOrientation: "north" | "west" | "south";
        };
        rooms: {
            name: string;
            xStartCell: number;
            yStartCell: number;
            xEndCell: number;
            yEndCell: number;
            doors: {
                xPositionCell: number;
                yPositionCell: number;
                cellOrientation: "north" | "west" | "south";
            }[];
        }[];
    };
}