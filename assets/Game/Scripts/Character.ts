import { _decorator, CCInteger, Component, EditBox, EventKeyboard, input, Input, KeyCode, Label, Node, Sprite } from 'cc';
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
    
    @property(EditBox)
    editBox: EditBox

    private isClick: boolean = true;

    onHandleAfterDice() {
        if(this.isClick) {
            let step = this.randomNumber()
            this.setIsClick(false);
            eventTarget.emit("SelectHorse", step, this.idCharacter)
        }
    }

    devDice() {
        let step = parseInt(this.editBox.string)
        this.editBox.string = ""
        this.setIsClick(false);
        eventTarget.emit("SelectHorse", step, this.idCharacter)
    }

    setIsClick(active: boolean) {
        this.isClick = active
    }

    randomNumber() {
        return Math.floor(Math.random() * 6) + 1;
    }

    onActive(active: boolean) {
        this.setIsClick(active)
        this.dice.onActive(active);
        this.editBox.node.active = active
        if(active) {
            this.editBox.setFocus()
        }
    }
}


