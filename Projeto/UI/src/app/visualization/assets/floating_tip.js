import * as THREE from "three";

export class FloatingText extends THREE.Object3D{
  constructor(text) {
    super();
    this.text = text;
    this.object;
    this.createTextPlanes();
    this.modifyObject();
  }

  createTextPlanes() {
    // Front-facing text
    const frontText = this.createTextPlane(this.text);

    // Back-facing text
    const backText = this.createTextPlane(this.text);
    backText.rotation.y = Math.PI; // Rotate the text to face the opposite direction

    let group = new THREE.Group;

    group.add(frontText);
    group.add(backText);

    this.add(group);
    this.object=group;

  }

  createTextPlane(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = 220;
    const height = 80;
    const borderWidth = 10; // Largura da borda
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText(text, width / 2, height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
    const geometry = new THREE.PlaneGeometry(width / 50, height / 50);
    const floating_tip= new THREE.Mesh(geometry, material);

    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const borderGeometry = new THREE.PlaneGeometry(width / 50 + borderWidth / 25, height / 50 + borderWidth / 25);
    const border = new THREE.Mesh(borderGeometry, borderMaterial);
    border.position.z=-0.01;

    let group= new THREE.Group;
    group.add(border);
    group.add(floating_tip);


    return group
  }

  modifyObject() {
    // Aplica uma rotação de 90 graus
    this.object.rotation.x =  Math.PI * 1.5;
    this.object.rotation.z = Math.PI / 2;

    // Reduz o tamanho pela metade
    this.object.scale.set(0.5, 0.5, 0.5);
  }
}
