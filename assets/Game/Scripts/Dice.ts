import { _decorator, Button, Component, Node } from 'cc';
import { eventTarget } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Dice')
export class Dice extends Component {
    onActive(active: boolean) {
        this.node.active = active;
    }
}


