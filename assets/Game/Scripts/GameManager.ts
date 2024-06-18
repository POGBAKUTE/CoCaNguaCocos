import { _decorator, Component, Node, EventTarget } from 'cc';
const { ccclass, property } = _decorator;

export const eventTarget = new EventTarget();

@ccclass('GameManager')
export class GameManager extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


