import { _decorator, Component, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { UIManager } from './UIManager';
import { UIGamePlay } from './UIGamePlay';
import { UISelectPlayer } from './UISelectPlayer';
import { Place } from '../Place';
import { PlayGame } from '../PlayGame';
const { ccclass, property } = _decorator;

@ccclass('UISetting')
export class UISetting extends UICanvas {
    backButton() {
        this.close(0);
        UIManager.Instance.closeUI(UIGamePlay, 0)
        UIManager.Instance.openUI(UISelectPlayer)
        PlayGame.Instance.destroyLevel();
    }
}


