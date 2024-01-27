import * as THREE from "three";

export default class AnimationsElevator {

    constructor(object, animations) {
        this.states = ["Open", "Open_Close", "Close", "Idle_Open", "Idle_Close"];

        this.mixer = new THREE.AnimationMixer(object);
        this.actionInProgress = false;

        this.actions = {};
        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
        }

        this.activeName = "Idle_Close";
        this.actions[this.activeName].play();
    }

    fadeToAction(name, duration) {
        if (this.activeName !== name) {
            const currentAction = this.actions[this.activeName];
            const newAction = this.actions[name];

            if (currentAction !== undefined) {
                currentAction.fadeOut(duration);
            }

            newAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play();

            newAction.clampWhenFinished = true;
            newAction.loop = THREE.LoopOnce;

            this.activeName = name;
        }
    }

    update(deltaT) {
        if (this.mixer) {
            this.mixer.update(deltaT);
        }
    }
}