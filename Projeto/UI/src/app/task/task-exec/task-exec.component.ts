import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as THREE from 'three';
import ThumbRaiser from '../../visualization/assets/thumb_raiser.js';
import Maze from '../../visualization/assets/maze.js';
import Orientation from '../../visualization/assets/orientation.js';
import { merge } from '../../visualization/assets/merge.js';
import { mazeData } from '../../visualization/assets/default_data.js';
import { TaskService } from '../task.service';
import { PathService } from '../path/path.service';
import { MapService } from './../../campus/map/map.service';
import { ElevatorService } from '../../campus/elevator/elevator.service';
import { RoomService } from 'src/app/campus/room/room.service';
import { PickupAndDeliveryTask } from '../models/pickupAndDeliveryTask.model';
import { CellPath } from 'src/app/visualization/models/cellPath.model.js';
import { UseElevator } from 'src/app/visualization/models/useElevator.model.js';
import { UsePassageway } from 'src/app/visualization/models/usePassageway.model.js';
import { Elevator } from 'src/app/campus/models/elevator.model.js';
import { Status } from '../models/status';

@Component({
	selector: 'app-task-exec',
	templateUrl: './task-exec.component.html',
	styleUrls: ['./task-exec.component.css'],
	providers: [TaskService, PathService, MapService, ElevatorService, RoomService]
})
export class TaskExecComponent implements AfterViewInit, OnDestroy {

	taskOrder: String[] = [];

	delTask: PickupAndDeliveryTask[] = [];

	delTaskSorted: PickupAndDeliveryTask[] = [];

	error: String | null = null;

	show3DVisualization: boolean = false;

	private thumbRaiser!: ThumbRaiser;

	maze = new Maze(new THREE.Vector3(1.0, 0.5, 1.0));

	path: (CellPath | UseElevator | UsePassageway)[] = [];

	showAnimateButton = true;

	showReturnButton = true;

	@ViewChild('gameContainer') gameContainer!: ElementRef;

	selectedBuilding: string = '';

	selectedFloor: number | undefined;

	lastSelectedBuilding: string = '';

	lastSelectedFloor: number | undefined;

	x1: string = null as any;

	y1: string = null as any;

	floorsServedElevator: number[] = [];

	selectTask: PickupAndDeliveryTask = null as any;

	constructor(private renderer: Renderer2, private pathService: PathService, private taskService: TaskService, private mapService: MapService, private elevatorService: ElevatorService, private roomService: RoomService) { }

	getTaskOrder() {
		this.error = null;
		this.delTaskSorted = [];

		this.showLoadingAlert();

		this.pathService.getTaskOrder().subscribe({
			next: (response: PickupAndDeliveryTask[]) => {
				Swal.close();
				this.delTaskSorted = response;
			},
			error: (error) => {
				Swal.close();
				this.error = error.message;
			}
		});
	}

	private async showLoadingAlert(): Promise<void> {
		await Swal.fire({
			title: 'Loading...',
			allowOutsideClick: false,
			didOpen: () => {
				Swal.showLoading();
			}
		});
	}

	ngAfterViewInit(): void {
		this.initialize("");
		this.animate = this.animate.bind(this);
		this.animate();
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
		// Crie um contÃªiner HTML para o overlay
		const container = this.renderer.createElement('div');
		this.renderer.addClass(container, 'overlay');

		// Adicione o contÃªiner HTML ao contÃªiner Angular
		this.renderer.appendChild(this.gameContainer.nativeElement, container);
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

	private async getPath(): Promise<void> {
		// pickup & delivery tasks
		let buildingInfoOne: string = "";
		let celOne: string = "";

		const pickupRoomData = await this.roomService.getRoomDataByRoomNameAndBuildingCode(this.selectTask.pickupBuildingCode, this.selectTask.pickupRoomName).toPromise();
		if (pickupRoomData === undefined) {
			alert("Something went wrong while trying to get the information required to build the path.");
			return;
		}

		let pickupRoomWidth: number = pickupRoomData.xEndCell - pickupRoomData.xStartCell;
		let pickupRoomHeight: number = pickupRoomData.yEndCell - pickupRoomData.yStartCell;
		const pickupRoomXCenterCell: string = (pickupRoomWidth !== 0 ? Math.ceil(pickupRoomData.xStartCell + (pickupRoomWidth / 2)) : 0).toString();
		const pickupRoomYCenterCell: string = (pickupRoomHeight !== 0 ? Math.ceil(pickupRoomData.yStartCell + (pickupRoomHeight / 2)) : 0).toString();

		/* Este valores sÃ£o do ponto inicial do robot TÃŠM DE SER DEFINIDOS */
		this.selectedBuilding = this.selectTask.pickupBuildingCode;
		this.selectedFloor = pickupRoomData.floor;
		this.x1 = pickupRoomXCenterCell;
		this.y1 = pickupRoomYCenterCell;

		buildingInfoOne = this.selectTask.pickupBuildingCode + "_" + pickupRoomData.floor;
		celOne = "cel(" + pickupRoomXCenterCell + "," + pickupRoomYCenterCell + ")";

		let buildingInfoTwo: string = "";
		let celTwo: string = "";
		const deliveryRoomData = await this.roomService.getRoomDataByRoomNameAndBuildingCode(this.selectTask.deliveryBuildingCode, this.selectTask.deliveryRoomName).toPromise();
		if (deliveryRoomData === undefined) {
			alert("Something went wrong while trying to get the information required to build the path.");
			return;
		}

		let deliveryRoomWidth: number = deliveryRoomData.xEndCell - deliveryRoomData.xStartCell;
		let deliveryRoomHeigth: number = deliveryRoomData.yEndCell - deliveryRoomData.yStartCell;

		const deliveryRoomXCenterCell: string = (deliveryRoomWidth !== 0 ? Math.ceil(deliveryRoomData.xStartCell + (deliveryRoomWidth / 2)) : 0).toString();
		const deliveryRoomYCenterCell: string = (deliveryRoomHeigth !== 0 ? Math.ceil(deliveryRoomData.yStartCell + (deliveryRoomHeigth / 2)) : 0).toString();

		buildingInfoTwo = this.selectTask.deliveryBuildingCode + "_" + deliveryRoomData.floor;
		celTwo = "cel(" + deliveryRoomXCenterCell + "," + deliveryRoomYCenterCell + ")";

		this.path = this.pathService.getPathAndBuildVisualization(buildingInfoOne, buildingInfoTwo, celOne, celTwo);

		/* Pode ser comentado */
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
	}

	async automaticPathAnimationSetup(task: any): Promise<void> {
		this.selectTask = task;
		await this.getPath();
		this.show3DVisualization = true;
		this.showReturnButton = true;
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
	}
}