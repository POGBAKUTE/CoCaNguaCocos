import { _decorator, Button, CCInteger, Component, Enum, Node, tween, Vec3 } from 'cc';
import { eventTarget } from './GameManager';
import { Place } from './Place';
import { PlayGame } from './PlayGame';
const { ccclass, property } = _decorator;

export enum HorseState {
    IDLE = 0,
    RUN = 1,
    FINISH = 2,
    WIN = 3
}

@ccclass('Horse')
export class Horse extends Component {
    @property(CCInteger)
    own: number;

    @property({type: Enum(HorseState)})
    state: HorseState = HorseState.IDLE

    @property(CCInteger)
    idHorse: number|null = 0;

    @property(CCInteger)
    startPosInMap: number;

    stepHandle: number = 0;
    private tweenCurrent: any

    protected start(): void {
        this.onActive(false)
        this.node.on(Button.EventType.CLICK, this.selectHorse, this)
    }

    setPos(pos: Vec3) {
        this.node.setPosition(pos);
    }

    onActive(active: boolean) {
        this.getComponent(Button).interactable = active
        if(active) {
            this.bubleHorse()
        }
        else {

            this.stopBubleHorse()
        }
    }

    selectHorse() {
        eventTarget.emit("MoveHorse", this.idHorse, this.own)
    }

    move(step: number, listPosRun: Array<Place>) {
        switch(this.state) {
            case HorseState.IDLE :
                this.state = HorseState.RUN
                this.moveIdleState(step, listPosRun)
                break;
            case HorseState.RUN :
                this.moveRunState(step, listPosRun)
                break;
        }
        console.log("Trang thai ngua so " + this.idHorse + " cua nguoi choi " + this.own + " la " + HorseState[this.state])
    }
    
    moveIdleState(step: number, listPosRun: Array<Place>) {
        let posTmp = (this.stepHandle + this.startPosInMap) % 52
        let t = tween(this.node);
        console.log("POSTMP "  + posTmp)
        t.to(0.5, { position:  listPosRun[posTmp].getPos()});
        t.call(() => {
            listPosRun[posTmp].addHorse(this)
            eventTarget.emit("CompleteTurn", step)
        });
        t.start()
    }

    moveRunState(step : number, listPosRun: Array<Place>) {
        let posTmp = (this.stepHandle + this.startPosInMap) % 52
        listPosRun[posTmp].removeHorse(this)

        let t = tween(this.node);
        for(var i = 1; i <= step; i++) {
            this.stepHandle += 1
            posTmp = (this.stepHandle + this.startPosInMap) % 52
            console.log("POSTMP "  + posTmp)
            t = t.to(0.5, { position:  listPosRun[posTmp].getPos()});
        }
        t.call(() => {
            listPosRun[posTmp].addHorse(this)
            eventTarget.emit("CompleteTurn", step)
        });

        t.start();
    }

    moveStart() {
        let t = tween(this.node);
        for(var i = this.stepHandle - 1; i >= 0; i++) {
            this.stepHandle -= 1
            let posTmp = (this.stepHandle + this.startPosInMap) % 52
            t = t.to(0.5, { position:  PlayGame.Instance.map.listAllPos[posTmp].getPos()});
        }
        t = t.to(0.5, { position:  PlayGame.Instance.map.startAllHorse[this.own - 1][this.idHorse].getPosition()});
    }

    bubleHorse() {
        this.tweenCurrent = tween(this.node)
            .to(0.5, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.5, { scale: new Vec3(0.8, 0.8, 0.8) })
            .union()
            .repeatForever()
            .start();
    }

    stopBubleHorse() {
        if(this.tweenCurrent != null) {
            this.tweenCurrent.stop();
        }
    }

    setScaleHorse(amount: number) {
        this.node.scale = new Vec3(amount, amount, amount)
    }
}


