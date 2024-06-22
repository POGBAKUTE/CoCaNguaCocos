import { _decorator, Color, Component, instantiate, Node, Prefab } from 'cc';
import { UICanvas } from './UICanvas';
import { ItemChooseUI } from './ItemChooseUI';
import { PlayGame } from '../PlayGame';
import { UIManager } from './UIManager';
import { UIGamePlay } from './UIGamePlay';
const { ccclass, property } = _decorator;

@ccclass('UIChooseBot')
export class UIChooseBot extends UICanvas {
    @property(Node)
    parentItemChoose: Node = null;

    @property(Prefab)
    itemChoosePrefab: Prefab = null;

    public open(): void {
        super.open();
    }

    listItemChoose : Array<ItemChooseUI>;
    listColor: Color[] = [Color.BLUE, Color.YELLOW, Color.GREEN, Color.RED]

    onInit(amount: number): void {
        this.listItemChoose = new Array<ItemChooseUI>();
        for(var i = 0; i < amount; i++) {
            let itemChooseNode = instantiate(this.itemChoosePrefab)
            itemChooseNode.parent = this.parentItemChoose
            let itemChoose = itemChooseNode.getComponent(ItemChooseUI)
            if(i == 0) {
                itemChoose.defaultChoose(false)
                itemChoose.activeToggle(false)
            }
            else {
                itemChoose.defaultChoose(true)
            }
            itemChoose.setColor(this.listColor[i])
            itemChoose.setName(i+1)
            this.listItemChoose.push(itemChoose);
        }
    }

    SubmitButton() {
        this.close(0)
        UIManager.Instance.openUI(UIGamePlay)
        let listCheck : Array<boolean> = new Array<boolean>()
        let listName : Array<string> = new Array<string>()
        for(var itemChoose of this.listItemChoose) {
            listCheck.push(itemChoose.isCheck)
            listName.push(itemChoose.getName())
            itemChoose.node.destroy()
        }
        PlayGame.Instance.generateLevel(listCheck, listName)
        this.listItemChoose = new Array<ItemChooseUI>()
    }
}


