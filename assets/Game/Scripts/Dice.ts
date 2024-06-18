import { _decorator, Button, Component, Node } from 'cc';
import { eventTarget } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Dice')
export class Dice extends Component {

    protected start(): void {
        this.node.on(Button.EventType.CLICK, this.onClickDice, this);
    }
    randomNumber() {
        return Math.floor(Math.random() * 6) + 1;
    }

    onClickDice() {
        let random = this.randomNumber()
        eventTarget.emit("ClickDice", random);
    }
}


