import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as THREE from 'three';
import ThumbRaiser from '../assets/thumb_raiser.js';
import Orientation from '../assets/orientation.js';
import { merge } from '../assets/merge.js';
import { mazeData } from '../assets/default_data.js';
import { Building } from '../../campus/models/building.model';
import { Floor } from '../../campus/models/floor.model';
import { Elevator } from '../../campus/models/elevator.model';
import { BuildingService } from '../../campus/building/building.service';
import { FloorService } from '../../campus/floor/floor.service';
import { ElevatorService } from '../../campus/elevator/elevator.service';
import { MapService } from './../../campus/map/map.service';

@Component({
    selector: 'app-floor-visualization',
    templateUrl: './floor-visualization.component.html',
    styleUrls: ['./floor-visualization.component.css'],
    providers: [BuildingService, FloorService, MapService, ElevatorService]
})

export class FloorVisualizationComponent implements OnInit, AfterViewInit, OnDestroy {

    private thumbRaiser!: ThumbRaiser;

    buildings: Building[] = [];

    floors: Floor[] = [];

    floorsServedElevator: number[] = [];

    selectedBuilding: string = '';

    selectedFloor: number | undefined;

    lastSelectedBuilding: string = '';

    lastSelectedFloor: number | undefined;

    @ViewChild('gameContainer') gameContainer!: ElementRef;

    constructor(private renderer: Renderer2, private buildingService: BuildingService, private floorService: FloorService,
        private mapService: MapService, private elevatorService: ElevatorService) { }

    ngOnInit(): void {
        this.getAllBuildings();
    }

    ngAfterViewInit(): void {
        this.initialize("");
        this.animate = this.animate.bind(this);
        this.animate();
        this.createAndAppendHtmlElement();
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

    changeMap(viaElevator: boolean = false, viaPassageway: boolean = false) {
        if (this.selectedBuilding && this.selectedFloor !== undefined) {
            this.mapService.getMap(this.selectedBuilding, this.selectedFloor).subscribe({
                next: (map: string) => {
                    map = viaElevator ? this.addViaElevatorInMap(map) : map;
                    map = viaPassageway ? this.addViaPassagewayInMap(map) : map;
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
            error: (error) => {
            }
        });
    }

    chosenFloorElevator(floor: number) {
        if (this.selectedFloor != floor) {
            this.selectedFloor = floor;
            this.changeMap(true, false);
        }
    }

    getCurrentPassagewayCode(): void {
        let passageway = this.thumbRaiser.findCurrentPassageway();

        if (passageway != null) {
            this.lastSelectedBuilding = this.selectedBuilding;
            this.lastSelectedFloor = this.selectedFloor;
            this.selectedBuilding = passageway.destinationBuilding;
            this.selectedFloor = passageway.destinationFloor;

            this.changeMap(false, true);
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

    private convertJsonToFile(jsonData: string): string {
        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }
}