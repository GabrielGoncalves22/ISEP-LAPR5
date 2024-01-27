import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters) {
        this.onLoad = function (description) {
            // Store the maze's map and size
            this.map = description.floor.map;
            this.size = description.floor.size;

            // Store the player's initial position and direction
            let numXCells = Math.floor(Math.random() * description.floor.size.numXCells);
            let numYCells = Math.floor(Math.random() * description.floor.size.numYCells);
            this.initialPosition = this.cellToCartesian([numYCells, numXCells]);
            this.initialDirection = 180.00;

            this.doorDirection = description.floor.doorDirection;

            // Store the maze's exit location
            //this.exitLocation = this.cellToCartesian(description.floor.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: "./textures/groundTexture1.jpg", size: description.floor.size });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: "./textures/wallTexture1.jpg" });

            // Store the elevator's initial position and direction
            this.elevatorPosition = this.cellToCartesian([description.floor.elevator.yStartCell, description.floor.elevator.xStartCell]);

            switch (description.floor.elevator.cellOrientation) {
                case "north":
                    this.elevatorDirection = 0;
                    break;
                case "west":
                    this.elevatorDirection = 90;
                    break;
                case "south":
                    this.elevatorDirection = 180;
                    break;
            }

            // Build the maze
            let wallObject;
            for (let i = 0; i <= description.floor.size.numXCells; i++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                for (let j = 0; j <= description.floor.size.numYCells; j++) { // In order to represent the southmost walls, the map height is one row greater than the actual maze height
                    /*
                     * description.floor.map[][] | North wall | West wall
                     * --------------------+------------+-----------
                     *          0          |     No     |     No
                     *          1          |     No     |    Yes
                     *          2          |    Yes     |     No
                     *          3          |    Yes     |    Yes
                     */
                    if (description.floor.map[j][i] == 2 || description.floor.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.scale.set(1.0, 4.0, 1.0);
                        wallObject.position.set(i - description.floor.size.numXCells / 2.0 + 0.5, 2, j - description.floor.size.numYCells / 2.0);
                        this.object.add(wallObject);
                    }
                    if (description.floor.map[j][i] == 1 || description.floor.map[j][i] == 3) {
                        wallObject = this.wall.object.clone();
                        wallObject.scale.set(1.0, 4.0, 1.0);
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.floor.size.numXCells / 2.0, 2, j - description.floor.size.numYCells / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
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

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.size.numXCells / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.size.numYCells / 2.0 + 0.5) * this.scale.z);
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.size.numYCells / 2.0), Math.floor(position.x / this.scale.x + this.size.numXCells / 2.0)];
    }

    distanceToWestWall(position) {
        const indexes = this.cartesianToCell(position);

        if (this.map[indexes[0]][indexes[1]] == 1 || this.map[indexes[0]][indexes[1]] == 3) {
            return position.x - this.cellToCartesian(indexes).x + this.scale.x / 2.0;
        }

        return Infinity;
    }

    distanceToEastWall(position) {
        const indexes = this.cartesianToCell(position);
        indexes[1]++;

        if (this.map[indexes[0]][indexes[1]] == 1 || this.map[indexes[0]][indexes[1]] == 3) {
            return this.cellToCartesian(indexes).x - this.scale.x / 2.0 - position.x;
        }

        return Infinity;
    }

    distanceToNorthWall(position) {
        const indexes = this.cartesianToCell(position);

        if (this.map[indexes[0]][indexes[1]] == 2 || this.map[indexes[0]][indexes[1]] == 3) {
            return position.z - this.cellToCartesian(indexes).z + this.scale.z / 2.0;
        }

        return Infinity;
    }

    distanceToSouthWall(position) {
        const indexes = this.cartesianToCell(position);
        indexes[0]++;

        if (this.map[indexes[0]][indexes[1]] == 2 || this.map[indexes[0]][indexes[1]] == 3) {
            return this.cellToCartesian(indexes).z - this.scale.z / 2.0 - position.z;
        }

        return Infinity;
    }

    distanceToElevator(position, elevatorPosition) {
        const indexes = this.cartesianToCell(position);
        const elevatorIndexes = this.cartesianToCell(elevatorPosition);
        const margin = 2;

        if (Math.abs(indexes[0] - elevatorIndexes[0]) <= margin && Math.abs(indexes[1] - elevatorIndexes[1]) <= margin) {
            return position.x - 2 - this.cellToCartesian(indexes).x + this.scale.x / 2.0;
        }

        return Infinity;
    }

    distanceToDoor(position, doorsPosition) {
        const indexes = this.cartesianToCell(position);
        const doorsIndexes = this.cartesianToCell(doorsPosition);
        const margin = 1;

        if (Math.abs(indexes[0] - doorsIndexes[0]) <= margin && Math.abs(indexes[1] - doorsIndexes[1]) <= margin) {
            return position.x - 2 - this.cellToCartesian(indexes).x + this.scale.x / 2.0;
        }

        return Infinity;
    }
}