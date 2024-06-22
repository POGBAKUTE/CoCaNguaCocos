import { _decorator, Component, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { UIManager } from './UIManager';
import { UIChooseBot } from './UIChooseBot';
import { ItemChooseUI } from './ItemChooseUI';
const { ccclass, property } = _decorator;

@ccclass('UISelectPlayer')
export class UISelectPlayer extends UICanvas {
    
    onHandleSelect(dt : number, customData : string): void {
        this.close(0)
        UIManager.Instance.openUI(UIChooseBot)
        UIManager.Instance.getUI(UIChooseBot).onInit(parseInt(customData))
    }

    
}


