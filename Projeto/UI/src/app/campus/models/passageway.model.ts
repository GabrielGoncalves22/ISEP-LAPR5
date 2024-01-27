export interface Passageway {
    code?: string;
    building1: string;
    floor1: number;
    building2: string;
    floor2: number;
    cellOrientation?: string;
    xStartCell?: number;
    yStartCell?: number;
    expanded?: boolean;
}
