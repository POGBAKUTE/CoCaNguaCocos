import { _decorator, Component, Label, Node, Toggle } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemChooseUI')
export class ItemChooseUI extends Component {
    @property(Label)
    labelName: Label

    @property(Toggle)
    bot: Toggle

    @property(Toggle)
    player: Toggle

    isCheck : boolean = false

    onCheckToggle(): void {
        this.isCheck = !this.isCheck
        console.log(this.isCheck)
    }

    defaultChoose(active: boolean) {
        this.isCheck = !active
        this.bot.isChecked = active
        this.player.isChecked = !active
    }

    activeToggle(active : boolean) {
        this.bot.interactable = active
        this.player.interactable = active
    }

    setName(index : number) {
        this.labelName.string = "Người chơi " + index
    }
}


