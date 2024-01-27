// Thumb Raiser - JPP 2021, 2022, 2023
// 3D modeling
// 3D models importing
// Perspective and orthographic projections
// Viewing
// Linear and affine transformations
// Lighting and materials
// Shadow projection
// Fog
// Texture mapping
// User interaction

import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';
import Stats from "three/addons/libs/stats.module.js";
import Orientation from "./orientation.js";
import { generalData, mazeData, playerData, doorData, lightsData, fogData, cameraData, elevatorData } from "./default_data.js";
import { merge } from "./merge.js";
import Maze from "./maze.js";
import Player from "./player.js";
import Lights from "./lights.js";
import Elevator from "./elevator.js";
import Door from "./door.js";
import Fog from "./fog.js";
import Camera from "./camera.js";
import AnimationsPlayer from "./animationsPlayer.js";
import AnimationsElevator from "./animationElevator.js";
import AnimationsDoor from "./animationDoor.js";
import UserInterface from "./user_interface.js";
import { FloatingText } from "./floating_tip.js";

/*
 * generalParameters = {
 *  setDevicePixelRatio: Boolean
 * }
 *
 * mazeParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 *
 * playerParameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3,
 *  walkingSpeed: Float,
 *  initialDirection: Float,
 *  turningSpeed: Float,
 *  runningFactor: Float,
 *  keyCodes: { fixedView: String, firstPersonView: String, thirdPersonView: String, topView: String, viewMode: String, userInterface: String, miniMap: String, help: String, statistics: String, run: String, left: String, right: String, backward: String, forward: String, dance: String, opening: String, clicking: String, wave: String }
 * }
 *
 * lightsParameters = {
 *  ambientLight: { color: Integer, intensity: Float },
 *  pointLight1: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  pointLight2: { color: Integer, intensity: Float, range: Float, position: Vector3 },
 *  spotLight: { color: Integer, intensity: Float, range: Float, angle: Float, penumbra: Float, position: Vector3, direction: Float }
 * }
 *
 * fogParameters = {
 *  enabled: Boolean,
 *  color: Integer,
 *  near: Float,
 *  far: Float
 * }
 *
 * fixedViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * firstPersonViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * thirdPersonViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * topViewCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  target: Vector3,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 *
 * miniMapCameraParameters = {
 *  view: String,
 *  multipleViewsViewport: Vector4,
 *  initialOrientation: Orientation,
 *  orientationMin: Orientation,
 *  orientationMax: Orientation,
 *  initialDistance: Float,
 *  distanceMin: Float,
 *  distanceMax: Float,
 *  initialZoom: Float,
 *  zoomMin: Float,
 *  zoomMax: Float,
 *  initialFov: Float,
 *  near: Float,
 *  far: Float
 * }
 */
export default class ThumbRaiser {

    constructor(parameters, generalParameters, mazeParameters, playerParameters, doorParameters, lightsParameters, fogParameters, fixedViewCameraParameters, firstPersonViewCameraParameters, thirdPersonViewCameraParameters, topViewCameraParameters, miniMapCameraParameters, elevatorParameters) {
        this.onLoad = function (description) {
            // Store the maze's map and size
            this.map = description.floor.map;
            this.size = description.floor.size;

            this.generalParameters = merge({}, generalData, generalParameters);
            this.mazeParameters = merge({}, mazeData, mazeParameters);
            this.playerParameters = merge({}, playerData, playerParameters);
            this.doorParameters = merge({}, doorData, doorParameters);
            this.lightsParameters = merge({}, lightsData, lightsParameters);
            this.fogParameters = merge({}, fogData, fogParameters);
            this.fixedViewCameraParameters = merge({}, cameraData, fixedViewCameraParameters);
            this.firstPersonViewCameraParameters = merge({}, cameraData, firstPersonViewCameraParameters);
            this.thirdPersonViewCameraParameters = merge({}, cameraData, thirdPersonViewCameraParameters);
            this.topViewCameraParameters = merge({}, cameraData, topViewCameraParameters);
            this.miniMapCameraParameters = merge({}, cameraData, miniMapCameraParameters);
            this.elevatorParameters = merge({}, elevatorData, elevatorParameters);

            // Create a 2D scene (the viewports frames)
            this.scene2D = new THREE.Scene();

            // Create a square
            let points = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(1.0, 0.0, 0.0), new THREE.Vector3(1.0, 1.0, 0.0), new THREE.Vector3(0.0, 1.0, 0.0)];
            let geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ color: 0xffffff });
            this.square = new THREE.LineLoop(geometry, material);
            this.scene2D.add(this.square);

            // Create the camera corresponding to the 2D scene
            this.camera2D = new THREE.OrthographicCamera(0.0, 1.0, 1.0, 0.0, 0.0, 1.0);

            // Create a 3D scene (the game itself)
            this.scene3D = new THREE.Scene();

            this.doors = [];

            this.maze = new Maze(this.mazeParameters);

            // Criar múltiplas instâncias de doors
            this.doorPositionList = [];
            this.doorDirectionList = [];

            for (const room of description.floor.rooms) {
                for (const roomDoor of room.doors) {
                    const door = new Door(this.doorParameters);
                    door.setDoorName(room.name)

                    this.doors.push(door);

                    let doorDirection;

                    switch (roomDoor.cellOrientation) {
                        case "north":
                            doorDirection = 0;
                            break;
                        case "west":
                            doorDirection = 90;
                            break;
                    }

                    this.doorDirectionList.push(doorDirection);

                    let doorPosition;
                    if (doorDirection === 0) {
                        doorPosition = this.cellToCartesian([roomDoor.yPositionCell - 0.5, roomDoor.xPositionCell]);
                    } else if (doorDirection === 90) {
                        doorPosition = this.cellToCartesian([roomDoor.yPositionCell, roomDoor.xPositionCell - 0.5]);
                    }

                    this.doorPositionList.push(doorPosition);
                }
            }

            // Create the player
            this.player = new Player(this.playerParameters);

            // Create the elevator
            this.elevator = new Elevator(this.elevatorParameters);

            // Create the lights
            this.lights = new Lights(this.lightsParameters);

            // Create the fog
            this.fog = new Fog(this.fogParameters);

            // Create the cameras corresponding to the four different views: fixed view, first-person view, third-person view and top view
            this.fixedViewCamera = new Camera(this.fixedViewCameraParameters, window.innerWidth, window.innerHeight);
            this.firstPersonViewCamera = new Camera(this.firstPersonViewCameraParameters, window.innerWidth, window.innerHeight);
            this.thirdPersonViewCamera = new Camera(this.thirdPersonViewCameraParameters, window.innerWidth, window.innerHeight);
            this.topViewCamera = new Camera(this.topViewCameraParameters, window.innerWidth, window.innerHeight);

            // Create the mini-map camera
            this.miniMapCamera = new Camera(this.miniMapCameraParameters, window.innerWidth, window.innerHeight);

            // Create the statistics and make its node invisible
            this.statistics = new Stats();
            this.statistics.dom.style.visibility = "hidden";
            document.body.appendChild(this.statistics.dom);

            // Create a renderer and turn on shadows in the renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            if (this.generalParameters.setDevicePixelRatio) {
                this.renderer.setPixelRatio(window.devicePixelRatio);
            }

            this.renderer.autoClear = false;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.setSize(window.innerWidth, window.innerHeight);

            document.getElementById("game-container").appendChild(this.renderer.domElement);

            // Set the mouse move action (none)
            this.dragMiniMap = false;
            this.changeCameraDistance = false;
            this.changeCameraOrientation = false;

            // Set the game state
            this.gameRunning = false;

            // Get and configure the panel's <div> elements
            this.viewsPanel = document.getElementById("views-panel");
            this.view = document.getElementById("view");
            this.projection = document.getElementById("projection");
            this.horizontal = document.getElementById("horizontal");
            this.horizontal.step = 1;
            this.vertical = document.getElementById("vertical");
            this.vertical.step = 1;
            this.distance = document.getElementById("distance");
            this.distance.step = 0.1;
            this.zoom = document.getElementById("zoom");
            this.zoom.step = 0.1;
            this.reset = document.getElementById("reset");
            this.resetAll = document.getElementById("reset-all");
            this.helpPanel = document.getElementById("help-panel");
            this.helpPanel.style.visibility = "hidden";
            this.subwindowsPanel = document.getElementById("subwindows-panel");
            this.multipleViewsCheckBox = document.getElementById("multiple-views");
            this.multipleViewsCheckBox.checked = false;
            this.userInterfaceCheckBox = document.getElementById("user-interface");
            this.userInterfaceCheckBox.checked = true;
            this.miniMapCheckBox = document.getElementById("mini-map");
            this.miniMapCheckBox.checked = true;
            this.helpCheckBox = document.getElementById("help");
            this.helpCheckBox.checked = false;
            this.statisticsCheckBox = document.getElementById("statistics");
            this.statisticsCheckBox.checked = false;

            // Build the help panel
            this.buildHelpPanel();

            // Set the active view camera (fixed view)
            this.setActiveViewCamera(this.fixedViewCamera);

            // Arrange viewports by view mode
            this.arrangeViewports(this.multipleViewsCheckBox.checked);

            // Register the event handler to be called on window resize
            window.addEventListener("resize", event => this.windowResize(event));

            // Register the event handler to be called on key down
            document.addEventListener("keydown", event => this.keyChange(event, true));

            // Register the event handler to be called on key release
            document.addEventListener("keyup", event => this.keyChange(event, false));

            // Register the event handler to be called on mouse down
            this.renderer.domElement.addEventListener("mousedown", event => this.mouseDown(event));

            // Register the event handler to be called on mouse move
            this.renderer.domElement.addEventListener("mousemove", event => this.mouseMove(event));

            // Register the event handler to be called on mouse Over door
            this.renderer.domElement.addEventListener("click", event => this.mouseOver(event));

            // Register the event handler to be called on mouse up
            this.renderer.domElement.addEventListener("mouseup", event => this.mouseUp(event));

            // Register the event handler to be called on mouse wheel
            this.renderer.domElement.addEventListener("wheel", event => this.mouseWheel(event));

            // Register the event handler to be called on context menu
            this.renderer.domElement.addEventListener("contextmenu", event => this.contextMenu(event));

            // Register the event handler to be called on select, input number, or input checkbox change
            this.view.addEventListener("change", event => this.elementChange(event));
            this.projection.addEventListener("change", event => this.elementChange(event));
            this.horizontal.addEventListener("change", event => this.elementChange(event));
            this.vertical.addEventListener("change", event => this.elementChange(event));
            this.distance.addEventListener("change", event => this.elementChange(event));
            this.zoom.addEventListener("change", event => this.elementChange(event));
            this.multipleViewsCheckBox.addEventListener("change", event => this.elementChange(event));
            this.userInterfaceCheckBox.addEventListener("change", event => this.elementChange(event));
            this.helpCheckBox.addEventListener("change", event => this.elementChange(event));
            this.statisticsCheckBox.addEventListener("change", event => this.elementChange(event));

            // Register the event handler to be called on input button click
            this.reset.addEventListener("click", event => this.buttonClick(event));
            this.resetAll.addEventListener("click", event => this.buttonClick(event));

            this.activeElement = document.activeElement;

            this.windowResize();

            const closeMenuButton = document.getElementById("close-menu-button");
            if (closeMenuButton !== null) {
                closeMenuButton.click();
            }

            //Inicializa o tween.js
            TWEEN.default = TWEEN;
            //TWEEN.default.update();
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            //console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );

    }

    destroy() {
        if (this.maze && this.maze.object) {
            this.scene3D.remove(this.maze.object);
        }

        if (this.player && this.player.object) {
            this.scene3D.remove(this.player.object);
        }

        if (this.elevator && this.elevator.object) {
            this.scene3D.remove(this.elevator.object);
        }

        if (this.doors && Array.isArray(this.doors)) {
            this.doors.forEach((door) => {
                if (door && door.object) {
                    this.scene3D.remove(door.object);
                }
            });
        }

        if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentElement === document.getElementById("game-container")) {
            document.getElementById("game-container").removeChild(this.renderer.domElement);
        }
    }

    buildHelpPanel() {
        const table = document.getElementById("help-table");
        let i = 0;

        for (const key in this.player.keyCodes) {
            while (table.rows[i].cells.length < 2) {
                i++;
            };
            table.rows[i++].cells[0].innerHTML = this.player.keyCodes[key];
        }

        table.rows[i].cells[0].innerHTML = this.maze.credits + "<br>" + this.player.credits;
    }

    displayPanel() {
        this.view.options.selectedIndex = ["fixed", "first-person", "third-person", "top"].indexOf(this.activeViewCamera.view);
        this.projection.options.selectedIndex = ["perspective", "orthographic"].indexOf(this.activeViewCamera.projection);
        this.horizontal.value = this.activeViewCamera.orientation.h.toFixed(0);
        this.vertical.value = this.activeViewCamera.orientation.v.toFixed(0);
        this.distance.value = this.activeViewCamera.distance.toFixed(1);
        this.zoom.value = this.activeViewCamera.zoom.toFixed(1);
    }

    // Set active view camera
    setActiveViewCamera(camera) {
        this.activeViewCamera = camera;
        this.horizontal.min = this.activeViewCamera.orientationMin.h.toFixed(0);
        this.horizontal.max = this.activeViewCamera.orientationMax.h.toFixed(0);
        this.vertical.min = this.activeViewCamera.orientationMin.v.toFixed(0);
        this.vertical.max = this.activeViewCamera.orientationMax.v.toFixed(0);
        this.distance.min = this.activeViewCamera.distanceMin.toFixed(1);
        this.distance.max = this.activeViewCamera.distanceMax.toFixed(1);
        this.zoom.min = this.activeViewCamera.zoomMin.toFixed(1);
        this.zoom.max = this.activeViewCamera.zoomMax.toFixed(1);
        this.displayPanel();
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.numXCells / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.numYCells / 2.0 + 0.5) * this.scale.z);
    }

    arrangeViewports(multipleViews) {
        this.fixedViewCamera.setViewport(multipleViews);
        this.firstPersonViewCamera.setViewport(multipleViews);
        this.thirdPersonViewCamera.setViewport(multipleViews);
        this.topViewCamera.setViewport(multipleViews);
    }

    pointerIsOverViewport(pointer, viewport) {
        return (
            pointer.x >= viewport.x &&
            pointer.x < viewport.x + viewport.width &&
            pointer.y >= viewport.y &&
            pointer.y < viewport.y + viewport.height);
    }

    getPointedViewport(pointer) {
        let viewport;

        // Check if the pointer is over the mini-map camera viewport
        if (this.miniMapCheckBox.checked) {
            viewport = this.miniMapCamera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return this.miniMapCamera.view;
            }
        }

        // Check if the pointer is over the remaining camera viewports
        let cameras;
        if (this.multipleViewsCheckBox.checked) {
            cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
        } else {
            cameras = [this.activeViewCamera];
        }

        for (const camera of cameras) {
            viewport = camera.getViewport();
            if (this.pointerIsOverViewport(pointer, viewport)) {
                return camera.view;
            }
        }

        // No camera viewport is being pointed
        return "none";
    }

    setViewMode(multipleViews) { // Single-view mode: false; multiple-views mode: true
        this.multipleViewsCheckBox.checked = multipleViews;
        this.arrangeViewports(this.multipleViewsCheckBox.checked);
    }

    setUserInterfaceVisibility(visible) {
        this.userInterfaceCheckBox.checked = visible;
        this.viewsPanel.style.visibility = visible ? "visible" : "hidden";
        this.subwindowsPanel.style.visibility = visible ? "visible" : "hidden";
        this.userInterface.setVisibility(visible);
    }

    setMiniMapVisibility(visible) { // Hidden: false; visible: true
        this.miniMapCheckBox.checked = visible;
    }

    setHelpVisibility(visible) { // Hidden: false; visible: true
        this.helpCheckBox.checked = visible;
        this.helpPanel.style.visibility = visible ? "visible" : "hidden";
    }

    setStatisticsVisibility(visible) { // Hidden: false; visible: true
        this.statisticsCheckBox.checked = visible;
        this.statistics.dom.style.visibility = visible ? "visible" : "hidden";
    }

    windowResize() {
        const widthSize = window.innerWidth - 80; // Tirar os 80px por causa do menu

        this.fixedViewCamera.updateWindowSize(widthSize, window.innerHeight);
        this.firstPersonViewCamera.updateWindowSize(widthSize, window.innerHeight);
        this.thirdPersonViewCamera.updateWindowSize(widthSize, window.innerHeight);
        this.topViewCamera.updateWindowSize(widthSize, window.innerHeight);
        this.miniMapCamera.updateWindowSize(widthSize, window.innerHeight);
        this.renderer.setSize(widthSize, window.innerHeight);
    }

    keyChange(event, state) {
        // Allow digit and arrow keys to be used when entering numbers
        if (["horizontal", "vertical", "distance", "zoom"].indexOf(event.target.id) < 0) {
            event.target.blur();
        }

        if (document.activeElement == document.body) {
            // Prevent the "Space" and "Arrow" keys from scrolling the document's content
            if (event.code == "Space" || event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowDown" || event.code == "ArrowUp") {
                event.preventDefault();
            }

            if (event.code == this.player.keyCodes.fixedView && state) { // Select fixed view
                this.setActiveViewCamera(this.fixedViewCamera);
            } else if (event.code == this.player.keyCodes.firstPersonView && state) { // Select first-person view
                this.setActiveViewCamera(this.firstPersonViewCamera);
            } else if (event.code == this.player.keyCodes.thirdPersonView && state) { // Select third-person view
                this.setActiveViewCamera(this.thirdPersonViewCamera);
            } else if (event.code == this.player.keyCodes.topView && state) { // Select top view
                this.setActiveViewCamera(this.topViewCamera);
            }

            if (event.code == this.player.keyCodes.viewMode && state) { // Single-view mode / multiple-views mode
                this.setViewMode(!this.multipleViewsCheckBox.checked);
            }

            if (event.code == this.player.keyCodes.userInterface && state) { // Display / hide user interface
                this.setUserInterfaceVisibility(!this.userInterfaceCheckBox.checked);
            }

            if (event.code == this.player.keyCodes.miniMap && state) { // Display / hide mini-map
                this.setMiniMapVisibility(!this.miniMapCheckBox.checked);
            }

            if (event.code == this.player.keyCodes.help && state) { // Display / hide help
                this.setHelpVisibility(!this.helpCheckBox.checked);
            }

            if (event.code == this.player.keyCodes.statistics && state) { // Display / hide statistics
                this.setStatisticsVisibility(!this.statisticsCheckBox.checked);
            }

            if (event.code == this.player.keyCodes.run) {
                this.player.keyStates.run = state;
            }

            if (event.code == this.player.keyCodes.left) {
                this.player.keyStates.left = state;
            } else if (event.code == this.player.keyCodes.right) {
                this.player.keyStates.right = state;
            }

            if (event.code == this.player.keyCodes.backward) {
                this.player.keyStates.backward = state;
            } else if (event.code == this.player.keyCodes.forward) {
                this.player.keyStates.forward = state;
            }

            if (event.code == this.player.keyCodes.dance) {
                this.player.keyStates.dance = state;
            } else if (event.code == this.player.keyCodes.opening) {
                this.player.keyStates.opening = state;
            } else if (event.code == this.player.keyCodes.clicking) {
                this.player.keyStates.clicking = state;
            } else if (event.code == this.player.keyCodes.wave) {
                this.player.keyStates.wave = state;
            }

            if (event.code == this.elevator.keyCodes.open) {
                this.elevator.keyStates.open = state;
            } else if (event.code == this.elevator.keyCodes.close) {
                this.elevator.keyStates.close = state;
            }

            this.doors.forEach((door) => {
                if (event.code == door.keyCodes.open) {
                    door.keyStates.open = state;
                } else if (event.code == door.keyCodes.close) {
                    door.keyStates.close = state;
                }
            })
        }
    }

    mouseDown(event) {
        if (event.buttons == 1 || event.buttons == 2) { // Primary or secondary button down
            // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
            this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);

            // Select the camera whose view is being pointed
            const cameraView = this.getPointedViewport(this.mousePosition);
            if (cameraView != "none") {
                if (cameraView == "mini-map") { // Mini-map camera selected
                    if (event.buttons == 1) { // Primary button down
                        this.dragMiniMap = true;
                    }
                } else { // One of the remaining cameras selected
                    const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
                    this.view.options.selectedIndex = cameraIndex;
                    this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex]);

                    if (event.buttons == 1) { // Primary button down
                        this.changeCameraDistance = true;
                    } else { // Secondary button down
                        this.changeCameraOrientation = true;
                    }
                }
            }
        }
    }

    mouseOver(event) {
        // Removendo instância anterior de FloatingText, se existir
        this.removePreviousFloatingText();

        const pointer = {
            x: event.clientX,
            y: event.clientY
        };

        const normalizedPointer = {
            x: (pointer.x / window.innerWidth) * 2 - 1,
            y: -(pointer.y / window.innerHeight) * 2 + 1
        };

        if (this.activeViewCamera) {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(normalizedPointer, this.activeViewCamera.object);

            if (this.doors && this.doors.length > 0) {
                const intersectDoors = this.doors
                    .filter(door => door && door.object)
                    .map(door => {
                        return {
                            doorObject: door.object,
                            doorData: door,
                        };
                    });

                const intersectElevators = {
                    elevatorObject: this.elevator.object,
                    elevatorData: this.elevator
                };

                const Objects = [];

                //Adicionar Portas ao Objects
                for (let obj of intersectDoors) {
                    Objects.push(obj.doorObject)
                }

                //Adicionar o elevador ao Objects
                Objects.push(this.elevator.object)

                const intersects = raycaster.intersectObjects(Objects);
                if (intersects.length > 0) {

                    let displayName;
                    let doorDirection;
                    for (let obj of intersectDoors) {
                        if (obj.doorObject.getObjectById(intersects[0].object.id)) {
                            displayName = obj.doorData.displayName;
                            doorDirection = obj.doorData.direction;
                        }
                    }

                    let elevatorPosition
                    let elevatorDirection
                    if (intersectElevators.elevatorObject.getObjectById(intersects[0].object.id)) {
                        displayName = intersectElevators.elevatorData.displayName;
                        elevatorPosition = intersectElevators.elevatorData.position;
                        elevatorDirection = intersectElevators.elevatorData.direction;
                    }

                    if (intersects[0].point) {

                        if (this.activeViewCamera === this.fixedViewCamera) {
                            const floatingTip = new FloatingText(displayName);
                            floatingTip.position.copy(intersects[0].point);
                            floatingTip.position.y = 2.5;
                            if (doorDirection === 0) {
                                floatingTip.rotation.y = Math.PI * 1.5;
                            }
                            // Caso seja elevador
                            if (displayName === "elevator") {
                                floatingTip.position.copy(elevatorPosition);
                                floatingTip.position.y = 2.5;
                                switch (elevatorDirection) {
                                    case 0:
                                        floatingTip.rotation.y = Math.PI * 1.5;
                                        break;
                                    case 90:
                                        floatingTip.rotation.y = (Math.PI * 1.5) * 4;
                                        break;
                                    case 180:
                                        floatingTip.rotation.y = (Math.PI * 1.5) * 3;
                                        break;

                                }
                            }
                            this.scene3D.add(floatingTip);
                            // Armazenando a nova instância de FloatingText para referência futura
                            this.currentFloatingText = floatingTip;
                        }

                        if (this.activeViewCamera === this.firstPersonViewCamera || this.activeViewCamera === this.thirdPersonViewCamera) {
                            const floatingTip = new FloatingText(displayName);
                            floatingTip.position.copy(intersects[0].point);
                            floatingTip.position.y = 2.5;
                            floatingTip.position.x += 0.5;
                            floatingTip.rotation.z = Math.PI * 1.5;
                            if (doorDirection === 0) {
                                floatingTip.rotation.y = Math.PI * 1.5;
                            }
                            //Caso seja elevador
                            if (displayName === "elevator") {
                                floatingTip.position.copy(elevatorPosition);
                                floatingTip.position.y = 2;

                                floatingTip.rotation.y = Math.PI * 1.5;
                                switch (elevatorDirection) {
                                    case 0:
                                        floatingTip.rotation.y = Math.PI * 1.5;
                                        floatingTip.position.z += 1.5;
                                        floatingTip.position.x -= 1;
                                        break;
                                    case 90:
                                        floatingTip.rotation.y = (Math.PI * 1.5) * 4;
                                        floatingTip.position.x += 1;
                                        break;
                                    case 180:
                                        floatingTip.rotation.y = (Math.PI * 1.5) * 3;
                                        floatingTip.position.z -= 1.5;
                                        floatingTip.position.x -= 1;
                                        break;

                                }
                            }
                            this.scene3D.add(floatingTip);
                            // Armazenando a nova instância de FloatingText para referência futura
                            this.currentFloatingText = floatingTip;
                        }
                    }
                }
            }
        }
    }

    // Método para remover a instância anterior de FloatingText
    removePreviousFloatingText() {
        if (this.currentFloatingText) {
            this.scene3D.remove(this.currentFloatingText);
            // Limpar referência para a instância removida
            this.currentFloatingText = null;
        }
    }

    mouseMove(event) {
        if (event.buttons == 1 || event.buttons == 2) { // Primary or secondary button down
            if (this.changeCameraDistance || this.changeCameraOrientation || this.dragMiniMap) {
                // Compute mouse movement and update mouse position
                const newMousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);
                const mouseIncrement = newMousePosition.clone().sub(this.mousePosition);
                this.mousePosition = newMousePosition;

                if (event.buttons == 1) { // Primary button down
                    if (this.changeCameraDistance) {
                        this.activeViewCamera.updateDistance(-0.05 * (mouseIncrement.x + mouseIncrement.y));
                        this.displayPanel();
                    } else if (this.dragMiniMap) {
                        const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
                        const width = this.miniMapCamera.viewport.width * windowMinSize;
                        const height = this.miniMapCamera.viewport.height * windowMinSize;
                        this.miniMapCamera.viewport.x += mouseIncrement.x / (window.innerWidth - width);
                        this.miniMapCamera.viewport.y += mouseIncrement.y / (window.innerHeight - height);
                    }
                } else { // Secondary button down
                    if (this.changeCameraOrientation) {
                        this.activeViewCamera.updateOrientation(mouseIncrement.multiply(new THREE.Vector2(-0.5, 0.5)));
                        this.displayPanel();
                    }
                }
            }
        }
    }

    mouseUp(event) {
        // Reset mouse move action
        this.dragMiniMap = false;
        this.changeCameraDistance = false;
        this.changeCameraOrientation = false;
    }

    mouseWheel(event) {
        // Prevent the mouse wheel from scrolling the document's content
        event.preventDefault();

        // Store current mouse position in window coordinates (mouse coordinate system: origin in the top-left corner; window coordinate system: origin in the bottom-left corner)
        this.mousePosition = new THREE.Vector2(event.clientX, window.innerHeight - event.clientY - 1);

        // Select the camera whose view is being pointed
        const cameraView = this.getPointedViewport(this.mousePosition);
        if (cameraView != "none" && cameraView != "mini-map") { // One of the remaining cameras selected
            const cameraIndex = ["fixed", "first-person", "third-person", "top"].indexOf(cameraView);
            this.view.options.selectedIndex = cameraIndex;
            const activeViewCamera = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][cameraIndex];
            activeViewCamera.updateZoom(-0.001 * event.deltaY);
            this.setActiveViewCamera(activeViewCamera);
        }
    }

    contextMenu(event) {
        // Prevent the context menu from appearing when the secondary mouse button is clicked
        event.preventDefault();
    }

    elementChange(event) {
        switch (event.target.id) {
            case "view":
                this.setActiveViewCamera([this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera][this.view.options.selectedIndex]);
                break;
            case "projection":
                this.activeViewCamera.setActiveProjection(["perspective", "orthographic"][this.projection.options.selectedIndex]);
                this.displayPanel();
                break;
            case "horizontal":
            case "vertical":
            case "distance":
            case "zoom":
                if (event.target.checkValidity()) {
                    switch (event.target.id) {
                        case "horizontal":
                        case "vertical":
                            this.activeViewCamera.setOrientation(new Orientation(this.horizontal.value, this.vertical.value));
                            break;
                        case "distance":
                            this.activeViewCamera.setDistance(this.distance.value);
                            break;
                        case "zoom":
                            this.activeViewCamera.setZoom(this.zoom.value);
                            break;
                    }
                }
                break;
            case "multiple-views":
                this.setViewMode(event.target.checked);
                break;
            case "user-interface":
                this.setUserInterfaceVisibility(event.target.checked);
                break;
            case "help":
                this.setHelpVisibility(event.target.checked);
                break;
            case "statistics":
                this.setStatisticsVisibility(event.target.checked);
                break;
        }
    }

    buttonClick(event) {
        switch (event.target.id) {
            case "reset":
                this.activeViewCamera.initialize();
                break;
            case "reset-all":
                this.fixedViewCamera.initialize();
                this.firstPersonViewCamera.initialize();
                this.thirdPersonViewCamera.initialize();
                this.topViewCamera.initialize();
                break;
        }
        this.displayPanel();
    }

    collision(position) {
        return this.maze.distanceToWestWall(position) < this.player.radius || this.maze.distanceToEastWall(position) < this.player.radius || this.maze.distanceToNorthWall(position) < this.player.radius || this.maze.distanceToSouthWall(position) < this.player.radius;
    }

    collisionWithElevator(position, elevatorPosition) {
        return this.maze.distanceToElevator(position, elevatorPosition) < this.player.radius;
    }

    collisionWithDoor(position, doorPosition) {
        return this.maze.distanceToDoor(position, doorPosition) < this.player.radius;
    }

    collisionWithPassageway(position, passageway) {
        return this.maze.closeToPassageway(position, passageway) < (this.player.radius * 2);
    }

    findCurrentPassageway() {
        let passageways = this.maze.passageways;
        for (let i = 0; i < passageways.length; i++) {
            if (this.collisionWithPassageway(this.player.position, passageways[i])) {
                return { destinationBuilding: passageways[i].destinationBuilding, destinationFloor: passageways[i].destinationFloor }
            }
        }

        return null;
    }

    pathAnimation(path) {
        let tweens = [];

        // Set up tweens for each cell path
        for (let i = 0; i < path.length - 1; i++) {
            let firstPosition = this.maze.cellToCartesian([path[i][0], path[i][1]]);
            let secondPosition = this.maze.cellToCartesian([path[i + 1][0], path[i + 1][1]]);
            tweens.push(new TWEEN.Tween(firstPosition)
                .to(secondPosition, 500)
                .onUpdate((position) => {
                    if (this.player) {
                        this.player.position.set(position.x, position.y, position.z);
                    }
                }
                ));
        }

        // Set up chaining for each tween
        for (var i = 0; i < tweens.length - 1; i++) {
            tweens[i].chain(tweens[i + 1]);
        }

        tweens[0].start();

        function animate() {
            requestAnimationFrame(animate);

            const tweensCompleted = tweens.every(tween => tween._isPlaying === false);
            if (tweensCompleted) {
                return;
            }

            TWEEN.update();
        }

        animate();
    }

    updateScene() {
        if (!this.gameRunning) {
            const allDoorsLoaded = this.doors && this.doors.length > 0 && this.doors.every((door) => door && door.loaded);

            if (this.maze && this.player && this.elevator && this.maze.loaded && this.player.loaded && allDoorsLoaded && this.elevator.loaded) { // If all resources have been loaded

                // Add the maze, the player and the lights to the scene
                this.scene3D.add(this.maze.object);
                this.scene3D.add(this.player.object);
                this.scene3D.add(this.lights.object);
                this.scene3D.add(this.elevator.object);

                // Create the clock
                this.clock = new THREE.Clock();

                // Create model animations (states, emotes and expressions)
                this.animations = new AnimationsPlayer(this.player.object, this.player.animations);
                this.animationsElevator = new AnimationsElevator(this.elevator.object, this.elevator.animations, this.maze.viaElevator);

                // Set the player's position and direction
                this.player.position = this.maze.initialPosition.clone();
                this.player.direction = this.maze.initialDirection;

                // Set the elevators's position and direction
                this.elevator.position = this.maze.elevatorPosition.clone();
                this.elevator.direction = this.maze.elevatorDirection;

                // Increase elevator size
                this.elevator.object.position.set(this.elevator.position.x - 0.5, this.elevator.position.y, this.elevator.position.z);

                for (let i = 0; i < this.doors.length; i++) {
                    this.doors[i].position = this.doorPositionList[i].clone();
                    this.doors[i].direction = THREE.MathUtils.degToRad(this.doorDirectionList[i]);
                    this.doors[i].animationsDoor = new AnimationsDoor(this.doors[i].object, this.doors[i].animations);
                }

                this.doors.forEach((door) => {
                    door.object.position.set(door.position.x, 0, door.position.z);
                });

                this.doors.forEach((door) => {
                    this.scene3D.add(door.object);

                });

                this.doors.forEach((door) => {
                    door.object.rotation.y = door.direction;

                });

                // Create the user interface
                this.userInterface = new UserInterface(this.scene3D, this.renderer, this.lights, this.fog, this.player.object, this.animations, this.elevator.object, this.animationsElevator, this.doors, this.animationsDoor);

                // Start the game
                this.gameRunning = true;
            }
        } else {

            // Update the model animations
            const deltaT = this.clock.getDelta();
            this.animations.update(deltaT);
            this.animationsElevator.update(deltaT);

            this.doors.forEach((door) => {
                door.animationsDoor.update(deltaT);
            });

            // Update the player
            if (!this.animations.actionInProgress) {
                let coveredDistance = this.player.walkingSpeed * deltaT;
                let directionIncrement = this.player.turningSpeed * deltaT;

                if (this.player.keyStates.run) {
                    coveredDistance *= this.player.runningFactor;
                    directionIncrement *= this.player.runningFactor;
                }

                const direction = THREE.MathUtils.degToRad(this.player.direction);

                if (!this.maze.pathAnimation) {
                    if (this.player.keyStates.left) {
                        this.player.direction += directionIncrement;
                    } else if (this.player.keyStates.right) {
                        this.player.direction -= directionIncrement;
                    }

                    if (this.player.keyStates.backward) {
                        const newPosition = new THREE.Vector3(-coveredDistance * Math.sin(direction), 0.0, -coveredDistance * Math.cos(direction)).add(this.player.position);
                        if (!this.collision(newPosition)) {
                            this.animations.fadeToAction(this.player.keyStates.run ? "Running" : "Walking", 0.2);
                            this.player.position = newPosition;
                        }

                        let passageways = this.maze.passageways;
                        for (let i = 0; i < passageways.length; i++) {
                            if (this.collisionWithPassageway(newPosition, passageways[i])) {
                                document.querySelector('.passageway-buttons').style.display = 'flex';
                                document.querySelector('.passageway-title').innerHTML = `Passageway to the floor number ${passageways[i].destinationFloor} of building ${passageways[i].destinationBuilding}`;
                            } else {
                                document.querySelector('.passageway-buttons').style.display = 'none';
                            }
                        }

                    } else if (this.player.keyStates.forward) {
                        const newPosition = new THREE.Vector3(coveredDistance * Math.sin(direction), 0.0, coveredDistance * Math.cos(direction)).add(this.player.position);
                        if (!this.collision(newPosition)) {
                            this.animations.fadeToAction(this.player.keyStates.run ? "Running" : "Walking", 0.2);
                            this.player.position = newPosition;
                        }

                        const elevatorButtonsDisplay = this.maze.insideElevator(this.player.position, this.elevator.position) ? 'flex' : 'none';
                        document.querySelector('.elevator-buttons').style.display = elevatorButtonsDisplay;

                        if (this.collisionWithElevator(newPosition, this.elevator.position) && (this.elevator.keyStates.open || this.elevator.keyStates.close)) {
                            this.animations.fadeToAction("Clicking", 0.2);
                            this.animationsElevator.fadeToAction(this.elevator.keyStates.open ? "Open" : "Close", 0.2);
                        }

                        for (let i = 0; i < this.doors.length; i++) {
                            if (this.collisionWithDoor(newPosition, this.doorPositionList[i]) && (this.doors[i].keyStates.open || this.doors[i].keyStates.close)) {
                                this.animations.fadeToAction("Opening", 0.2);
                                this.doors[i].animationsDoor.fadeToAction(this.doors[i].keyStates.open ? "Open" : "Close", 0.2);
                            }
                        }

                        let passageways = this.maze.passageways;
                        for (let i = 0; i < passageways.length; i++) {
                            if (this.collisionWithPassageway(newPosition, passageways[i])) {
                                document.querySelector('.passageway-buttons').style.display = 'flex';
                                document.querySelector('.passageway-title').innerHTML = `Passageway to the floor number ${passageways[i].destinationFloor} of building ${passageways[i].destinationBuilding}`;
                            } else {
                                document.querySelector('.passageway-buttons').style.display = 'none';
                            }
                        }

                    } else if (this.player.keyStates.dance) {
                        this.animations.fadeToAction("Dance", 0.2);
                    } else if (this.player.keyStates.opening) {
                        this.animations.fadeToAction("Opening", 0.2);
                    } else if (this.player.keyStates.clicking) {
                        this.animations.fadeToAction("Clicking", 0.2);
                    } else if (this.player.keyStates.wave) {
                        this.animations.fadeToAction("Wave", 0.2);
                    } else {
                        this.animations.fadeToAction("Idle", 0.2);
                    }
                }

                this.player.object.position.set(this.player.position.x, this.player.position.y, this.player.position.z);
                this.player.object.rotation.y = direction - this.player.initialDirection;

                const directionElevator = THREE.MathUtils.degToRad(this.maze.elevatorDirection);
                this.elevator.object.rotation.y = directionElevator;
            }

            //Update elevator
            if (!this.animationsElevator.actionInProgress) {
                if (document.querySelector('.elevator-buttons')) {
                    const elevatorButtonsDisplay = this.maze.insideElevator(this.player.position, this.elevator.position) ? 'flex' : 'none';
                    document.querySelector('.elevator-buttons').style.display = elevatorButtonsDisplay;
                }

                /*
                //Abrir elevador manualmente
                if (this.collisionWithElevator(this.player.position, this.elevator.position) && (this.elevator.keyStates.open || this.elevator.keyStates.close)) {
                    this.animations.fadeToAction("Clicking", 0.2);
                    this.animationsElevator.fadeToAction(this.elevator.keyStates.open ? "Open" : "Close", 0.2);
                }
                */

                //Abrir elevador automaticamente
                if (this.collisionWithElevator(this.player.position, this.elevator.position)) {
                    this.animationsElevator.fadeToAction("Open", 0.2);
                } else {
                    this.animationsElevator.fadeToAction("Close", 0.2);
                }
            }

            //Update doors
            if (!this.doors.some((door) => door.animationsDoor.actionInProgress)) {
                /*
                    //Abrir portas manualmente
                    for (let i = 0; i < this.doors.length; i++) {
                        if (this.collisionWithDoor(this.player.position, this.doorPositionList[i]) && (this.doors[i].keyStates.open || this.doors[i].keyStates.close)) {
                            this.animations.fadeToAction("Opening", 0.2);
                            this.doors[i].animationsDoor.fadeToAction(this.doors[i].keyStates.open ? "Open" : "Close", 0.2);
                        }
                    }
                */

                //Abrir portas automaticamente
                for (let i = 0; i < this.doors.length; i++) {
                    if (this.collisionWithDoor(this.player.position, this.doorPositionList[i])) {
                        this.doors[i].animationsDoor.fadeToAction("Open", 0.2);
                    } else {
                        this.doors[i].animationsDoor.fadeToAction("Close", 0.2);
                    }
                }
            }

            let passageways = this.maze.passageways;
            for (let i = 0; i < passageways.length; i++) {
                if (this.collisionWithPassageway(this.player.position, passageways[i]) && document.querySelector('.passageway-buttons')) {
                    document.querySelector('.passageway-buttons').style.display = 'flex';
                    document.querySelector('.passageway-title').innerHTML = `Passageway to the floor number ${passageways[i].destinationFloor} of building ${passageways[i].destinationBuilding}`;
                }
            }

            // Update first-person, third-person and top view cameras parameters (player direction and target)
            this.firstPersonViewCamera.playerDirection = this.player.direction;
            this.thirdPersonViewCamera.playerDirection = this.player.direction;
            this.topViewCamera.playerDirection = this.player.direction;
            const target = new THREE.Vector3(this.player.position.x, this.player.position.y + this.player.eyeHeight, this.player.position.z);
            this.firstPersonViewCamera.setTarget(target);
            this.thirdPersonViewCamera.setTarget(target);
            this.topViewCamera.setTarget(target);

            // Update statistics
            this.statistics.update();

            // Render primary viewport(s)
            this.renderer.clear();

            if (this.fog.enabled) {
                this.scene3D.fog = this.fog.object;
            } else {
                this.scene3D.fog = null;
            }

            let cameras;
            if (this.multipleViewsCheckBox.checked) {
                cameras = [this.fixedViewCamera, this.firstPersonViewCamera, this.thirdPersonViewCamera, this.topViewCamera];
            } else {
                cameras = [this.activeViewCamera];
            }

            for (const camera of cameras) {
                this.player.object.visible = (camera != this.firstPersonViewCamera);
                const viewport = camera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, camera.object);
                this.renderer.render(this.scene2D, this.camera2D);
                this.renderer.clearDepth();
            }

            // Render secondary viewport (mini-map)
            if (this.miniMapCheckBox.checked) {
                this.scene3D.fog = null;
                this.player.object.visible = true;
                this.elevator.object.visible = true;
                this.doors.forEach((door) => {
                    door.object.visible = true;
                });

                const viewport = this.miniMapCamera.getViewport();
                this.renderer.setViewport(viewport.x, viewport.y, viewport.width, viewport.height);
                this.renderer.render(this.scene3D, this.miniMapCamera.object);
                this.renderer.render(this.scene2D, this.camera2D);
            }
        }
    }
}
