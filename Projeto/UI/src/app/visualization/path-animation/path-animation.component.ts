import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as THREE from 'three';
import Swal from 'sweetalert2';
import ThumbRaiser from '../assets/thumb_raiser.js';
import Maze from '../assets/maze.js';
import Orientation from '../assets/orientation.js';
import { merge } from '../assets/merge.js';
import { mazeData } from '../assets/default_data.js';
import { Building } from '../../campus/models/building.model';
import { Floor } from '../../campus/models/floor.model';
import { Elevator } from '../../campus/models/elevator.model';
import { BuildingService } from '../../campus/building/building.service';
import { FloorService } from '../../campus/floor/floor.service';
import { ElevatorService } from '../../campus/elevator/elevator.service';
import { PathService } from 'src/app/task/path/path.service';
import { MapService } from './../../campus/map/map.service';
import { CellPath } from '../models/cellPath.model.js';
import { UseElevator } from '../models/useElevator.model.js';
import { UsePassageway } from '../models/usePassageway.model.js';
import { Path } from 'src/app/task/models/path.model.js';

@Component({
    selector: 'app-floor-visualization',
    templateUrl: './path-animation.component.html',
    styleUrls: ['./path-animation.component.css'],
    providers: [BuildingService, FloorService, MapService, ElevatorService, PathService]
})

export class PathAnimationComponent implements OnInit, AfterViewInit, OnDestroy {

    show3DVisualization: boolean = false;

    private thumbRaiser!: ThumbRaiser;

    //private maze!: Maze;

    maze = new Maze(new THREE.Vector3(1.0, 0.5, 1.0));

    buildings: Building[] = [];

    floors: Floor[] = [];

    floorsServedElevator: number[] = [];

    selectedBuilding: string = '';

    selectedFloor: number | undefined;

    lastSelectedBuilding: string = '';

    lastSelectedFloor: number | undefined;

    building1Code: string = null as any;

    building2Code: string = null as any;

    floor1Number: number = null as any;

    floor2Number: number = null as any;

    x1: string = null as any;

    y1: string = null as any;

    x2: string = null as any;

    y2: string = null as any;

    floor: Floor = {
        number: null as any,
        description: ''
    };

    floors1: Floor[] = [];

    floors2: Floor[] = [];

    error: String | null = null;

    success: String | null = null;

    path: (CellPath | UseElevator | UsePassageway)[] = [];

    showAnimateButton = true;

    showReturnButton = true;

    @ViewChild('gameContainer') gameContainer!: ElementRef;

    constructor(private renderer: Renderer2, private buildingService: BuildingService, private floorService: FloorService,
        private mapService: MapService, private elevatorService: ElevatorService, private pathService: PathService) { }

    ngOnInit(): void {
        this.getAllBuildings();
    }

    ngAfterViewInit(): void {
        this.initialize("");
        this.animate = this.animate.bind(this);
        this.animate();
        //this.createAndAppendHtmlElement();
        this.thumbRaiser.userInterface?.setVisibility(true);
    }

    ngOnDestroy(): void {
        if (this.thumbRaiser) {
            this.thumbRaiser.destroy();
        }
        this.thumbRaiser.userInterface?.setVisibility(false);
    }

    initialize(url: string): void {
        if (this.thumbRaiser) {
            this.thumbRaiser.destroy();
        }

        // Create the game
        mazeData.url = url;

        let parameters = merge({}, mazeData, { scale: new THREE.Vector3(1.0, 0.5, 1.0) });
        this.thumbRaiser = new ThumbRaiser(
            parameters,
            {}, // General Parameters
            { scale: new THREE.Vector3(1.0, 0.5, 1.0) }, // Maze parameters
            {}, // Player parameters
            {}, // Door parameters
            { ambientLight: { intensity: 0.1 }, pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) }, pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) } }, // Lights parameters
            {}, // Fog parameters
            { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }, // Fixed view camera parameters
            { view: "first-person", multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // First-person view camera parameters
            { view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // Third-person view camera parameters
            { view: "top", multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0 }, // Top view camera parameters
            { view: "mini-map", multipleViewsViewport: new THREE.Vector4(0.99, 0.02, 0.3, 0.3), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.64 }, // Mini-msp view camera parameters
            {} // Elevator parameters
        );
    }

    animate(): void {
        requestAnimationFrame(this.animate);
        // Update the game
        this.thumbRaiser.updateScene();
    }

    createAndAppendHtmlElement(): void {
        // Crie um contêiner HTML para o overlay
        const container = this.renderer.createElement('div');
        this.renderer.addClass(container, 'overlay');

        // Adicione o contêiner HTML ao contêiner Angular
        this.renderer.appendChild(this.gameContainer.nativeElement, container);
    }

    getAllBuildings() {
        this.buildingService.getAllBuildings().subscribe({
            next: (buildings: Building[]) => {
                this.buildings = buildings;
            },
            error: () => {
                alert('There are no buildings!')
            }
        });
    }

    onBuildingChange() {
        const selectedBuilding = this.buildings.find(building => building.code === this.selectedBuilding);

        if (selectedBuilding) {
            this.floorService.getFloorsByBuilding(this.selectedBuilding).subscribe({
                next: (floors: Floor[]) => {
                    this.floors = floors;
                    this.selectedFloor = floors.length > 0 ? floors[0].number : undefined;
                },
                error: () => {
                    alert(`There are no floors for the building ${this.selectedBuilding}.`);
                    this.selectedBuilding = '';
                }
            });
        }
    }

    changeMap(viaElevator: boolean = false, viaPassageway: boolean = false, viaPath: boolean = false) {
        if (this.selectedBuilding && this.selectedFloor !== undefined) {
            this.mapService.getMap(this.selectedBuilding, this.selectedFloor).subscribe({
                next: (map: string) => {
                    map = viaElevator ? this.addViaElevatorInMap(map) : map;
                    map = viaPassageway ? this.addViaPassagewayInMap(map) : map;
                    map = viaPath ? this.pathAnimationInitialPositionSetup(map) : map;
                    map = this.addPathAnimationInMap(map);
                    this.initialize(this.convertJsonToFile(map));
                    this.listFloorsServedElevator();
                },
                error: () => {
                    alert(`There is no map for the floor ${this.selectedFloor} of the building ${this.selectedBuilding}.`);
                    this.selectedBuilding = '';
                    this.selectedFloor = undefined;
                }
            });
        } else {
            alert('Please select a building and floor before changing the map.');
        }
    }

    listFloorsServedElevator() {
        this.elevatorService.getElevatorByBuilding(this.selectedBuilding).subscribe({
            next: (elevator: Elevator) => {
                this.floorsServedElevator = elevator.floors.map(floor => floor.number);
            },
            error: (error: { message: String | null; }) => {
                this.error = error.message;
            }
        });
    }

    chosenFloorElevator(floor: number) {
        if (this.selectedFloor != floor) {
            this.selectedFloor = floor;
            this.changeMap(true, false, false);
        }
    }

    getCurrentPassagewayCode(): void {
        let passageway = this.thumbRaiser.findCurrentPassageway();

        if (passageway != null) {
            this.lastSelectedBuilding = this.selectedBuilding;
            this.lastSelectedFloor = this.selectedFloor;
            this.selectedBuilding = passageway.destinationBuilding;
            this.selectedFloor = passageway.destinationFloor;

            this.changeMap(false, true, false);
        }
    }

    private addViaElevatorInMap(map: any): string {
        const updatedMap = { ...map };

        if (updatedMap.floor) {
            updatedMap.floor.viaElevator = true;
        }

        return updatedMap;
    }

    private addViaPassagewayInMap(map: any): string {
        const updatedMap = { ...map };

        if (updatedMap.floor) {
            const matchingPassageway = updatedMap.floor.passageways.find((passageway: any) =>
                passageway.destinationBuilding == this.lastSelectedBuilding &&
                passageway.destinationFloor == this.lastSelectedFloor);

            if (matchingPassageway) {
                updatedMap.floor.viaPassageway = true;
                updatedMap.floor.initialPosition = {
                    xStartCell: matchingPassageway.xStartCell,
                    yStartCell: matchingPassageway.yStartCell
                };
            }
        }

        return updatedMap;
    }

    private pathAnimationInitialPositionSetup(map: any): string {
        const updatedMap = { ...map };

        if (updatedMap.floor && this.path[0] != null) {
            updatedMap.floor.viaPath = true;
            updatedMap.floor.initialPosition = {
                xStartCell: this.x1,
                yStartCell: this.y1
            };
        }

        return updatedMap;
    }

    private addPathAnimationInMap(map: any): string {
        const updatedMap = { ...map };
        updatedMap.pathAnimation = true;

        return updatedMap;
    }

    private convertJsonToFile(jsonData: string): string {
        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }

    loadFloorsOfBuilding1() {
        this.floors1 = [];
        this.floor = { number: null as any, description: '' }; // Limpa os dados atuais
        this.error = null;

        if (this.building1Code !== '') {
            this.floorService.getFloorsByBuilding(this.building1Code).subscribe({
                next: (floors: Floor[]) => {
                    this.floors1 = floors;
                },
                error: (error: { message: String | null; }) => {
                    this.error = error.message;
                }
            });
        }
    }

    loadFloorsOfBuilding2() {
        this.floors2 = [];
        this.floor = { number: null as any, description: '' }; // Limpa os dados atuais
        this.error = null;

        if (this.building2Code !== '') {
            this.floorService.getFloorsByBuilding(this.building2Code).subscribe({
                next: (floors: Floor[]) => {
                    this.floors2 = floors;
                },
                error: (error: { message: String | null; }) => {
                    this.error = error.message;
                }
            });
        }
    }

    private getPath(): void {
        const buildingInfoOne = this.building1Code + "_" + this.floor1Number;
        const buildingInfoTwo = this.building2Code + "_" + this.floor2Number;

        const celOne: string = "cel(" + this.x1 + "," + this.y1 + ")";
        const celTwo: string = "cel(" + this.x2 + "," + this.y2 + ")";

        this.path = this.pathService.getPathAndBuildVisualization(buildingInfoOne, buildingInfoTwo, celOne, celTwo);

        // cellPath é um array de arrays de inteiros, onde cada array de inteiros representa uma célula do mapa
        // use é um booleano que indica se o bichano tem de usar uma passagem
        // floor é um inteiro que indica o piso onde o bichano tem de ir

        // Valores estáticos para testar
        // B1 -> B2
        //this.path = [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [6,10], [6,11], [6,12], [6,13], [6,14], [6,15], [6,16], [6,17], [6,18], [7,18], [8,18], [9,18]];

        // A1 -> A2 -> B2

        // AQUI
        /*let segment1: CellPath = {
            cellPath: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14], [6, 15], [6, 16], [6, 17], [6, 18], [5, 18], [4, 18], [3, 18], [2, 18], [1, 19]]
        };
        let segment2: UseElevator = {
            floor: 2
        };
        let segment3: CellPath = {
            cellPath: [[1, 19], [2, 19], [3, 19], [4, 19], [5, 19], [6, 19]]
        };
        let segment4: UsePassageway = {
            use: true
        }
        this.path = [segment1, segment2, segment3, segment4];*/

        // A2 -> B2
        /*
        let segment1: CellPath = {
            cellPath: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[6,15],[6,16],[6,17],[6,18],[6, 19]]
        };
        let segment2: UsePassageway = {
            use: true
        }
        this.path = [segment1, segment2];*/

        // A2 -> B2
        /*
        let segment1: CellPath = {
            cellPath: [[6,17],[6,18],[6, 19]]
        };
        let segment2: UsePassageway = {
            use: true
        }
        this.path = [segment1, segment2];*/

        // C3 -> B2 -> A2
        /*
        let segment1: CellPath = {
            cellPath: [[1,1], [6,1], [6,5], [8,5], [8,0]]
        };
        let segment2: UsePassageway = {
            use: true
        }
        let segment3: CellPath = {
            cellPath: [[11, 19], [11, 11], [0, 11], [0, 6], [11, 6], [11, 0], [6,0]]
        };
        let segment4: UsePassageway = {
            use: true
        }
        let segment5: CellPath = {
            cellPath: [[6, 19], [0, 19]]
        };
        let segment6: UseElevator = {
            floor: 1
        }
        let segment7: CellPath = {
            cellPath: [[0, 19], [1, 1]]
        };
        this.path = [segment1, segment2, segment3, segment4, segment5, segment6, segment7]; */

        // A2 -> B2 -> C3 -> D3 -> B2 -> C3
        /*
        let segment1: CellPath = {
            cellPath: [[1,1], [6,1], [6,19]]
        };
        let segment2: UsePassageway = {
            use: true
        };
        let segment3: CellPath = {
            cellPath: [[6, 0], [11, 0], [11, 7], [0, 7], [0, 12], [11, 12], [11,19]]
        };
        let segment4: UsePassageway = {
            use: true
        };
        let segment5: CellPath = {
            cellPath: [[8, 0], [8, 3], [14,3], [14,0]]
        };
        let segment6: UsePassageway = {
            use: true
        };
        let segment7: CellPath = {
            cellPath: [[1, 11], [0, 9]]
        };
        let segment8: UsePassageway = {
            use: true
        };
        let segment9: CellPath = {
            cellPath: [[11, 18], [11, 19]]
        };
        let segment10: UsePassageway = {
            use: true
        };
        this.path = [segment1, segment2, segment3, segment4, segment5, segment6, segment7, segment8, segment9, segment10];*/
    }

    automaticPathAnimationSetup(): void {
        this.getPath();
        this.show3DVisualization = true;
        this.showReturnButton = true;
        this.selectedBuilding = this.building1Code;
        this.selectedFloor = this.floor1Number;
        this.changeMap(false, false, true);
    }

    private async animateSegment(segment: CellPath): Promise<void> {
        this.thumbRaiser.pathAnimation(segment.cellPath);
        await new Promise(resolve => setTimeout(resolve, segment.cellPath.length * 500));
    }

    private async showInfoAlert(title: string, text: string): Promise<void> {
        await Swal.fire({
            title: title,
            text: text,
            icon: 'info',
            timer: 3000,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    private async showPathAnimationCompleteAlert(): Promise<void> {
        await Swal.fire({
            title: 'Path animation completed!',
            icon: 'success',
            showConfirmButton: false,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: 'Return',
            didOpen: () => {
                const cancelButton = Swal.getCancelButton();
                cancelButton?.addEventListener('click', () => {
                    this.turnOffPathAnimation();
                });
            }
        });
    }

    async automaticPathAnimation(): Promise<void> {
        this.showAnimateButton = false;
        this.showReturnButton = false;

        for (const segment of this.path) {
            if ('cellPath' in segment) {
                await this.animateSegment(segment);
            } else if ('floor' in segment) {
                this.chosenFloorElevator(segment.floor);

                await this.showInfoAlert('Elevator Animation', `Floor: ${this.selectedFloor}`);
            } else if ('use' in segment) {
                this.getCurrentPassagewayCode();

                await this.showInfoAlert('Passageway Animation', `Building: ${this.selectedBuilding} | Floor: ${this.selectedFloor}`);
            }
        }

        this.showReturnButton = true;
        await this.showPathAnimationCompleteAlert();
    }

    turnOffPathAnimation(): void {
        this.show3DVisualization = false;
        this.showAnimateButton = true;
        this.thumbRaiser.userInterface?.setVisibility(false);
        this.thumbRaiser.destroy();
        this.building1Code = null as any;
        this.building2Code = null as any;
        this.floor1Number = null as any;
        this.floor2Number = null as any;
        this.x1 = null as any;
        this.y1 = null as any;
        this.x2 = null as any;
        this.y2 = null as any;
    }
}