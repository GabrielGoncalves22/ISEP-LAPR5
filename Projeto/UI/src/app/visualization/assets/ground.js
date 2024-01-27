import * as THREE from "three";

/*
 * parameters = {
 *  textureUrl: String,
 *  size: Vector2
 * }
 */

export default class Ground {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }

        // Create a texture
        const texture = new THREE.TextureLoader().load("./app/visualization/assets/textures/groundTexture1.jpg",
            (texture) => {
                console.log('Texture loaded successfully:', texture);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('Error loading texture:', error);
            }
        );

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(this.size.numXCells, this.size.numYCells);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Create a ground plane that receives shadows but does not cast them
        const geometry = new THREE.PlaneGeometry(this.size.numXCells, this.size.numYCells);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: texture });

        this.object = new THREE.Mesh(geometry, material);
        this.object.rotateX(-Math.PI / 2.0);
        this.object.castShadow = false;
        this.object.receiveShadow = true;
    }
}