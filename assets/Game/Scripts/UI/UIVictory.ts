import { _decorator, Component, Label, Node } from 'cc';
import { UICanvas } from './UICanvas';
import { UIManager } from './UIManager';
import { UIGamePlay } from './UIGamePlay';
import { UISelectPlayer } from './UISelectPlayer';
import { PlayGame } from '../PlayGame';
const { ccclass, property } = _decorator;

@ccclass('UIVictory')
export class UIVictory extends UICanvas {
    @property(Label)
    notify : Label

    updateNotify(name: String) {
        this.notify.string = "Người chiến thắng là " + name;
    }

    backButton() {
        this.close(0);
        UIManager.Instance.closeUI(UIGamePlay, 0)
        UIManager.Instance.openUI(UISelectPlayer)
        PlayGame.Instance.destroyLevel();
    }
}


