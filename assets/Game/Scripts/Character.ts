import { _decorator, CCInteger, Component, Label, Node, Sprite } from 'cc';
import { Dice } from './Dice';
import { eventTarget } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Character extends Component {
    @property(Sprite)
    avatar: Sprite

    @property(Label)
    nameCharacter: Label

    @property(Dice)
    dice: Dice

    @property(CCInteger)
    idCharacter: number

    protected start(): void {
        eventTarget.on("ClickDice", this.onHandleAfterDice, this)
    }

    onHandleAfterDice(step: number) {
        eventTarget.emit("MoveHorse", step)
    }
}


