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

    @property({ type: Enum(HorseState) })
    state: HorseState = HorseState.IDLE

    @property(CCInteger)
    idHorse: number | null = 0;

    @property(CCInteger)
    startPosInMap: number;

    stepHandle: number = -1;
    private tweenCurrent: any
    private scaleHorseStart: number = 0.8
    private scaleHorseSquare: number = 0.5
    private scaleCurrent: Vec3
    private isAttack: boolean = false;
    private speedStateRun: number = 0.3
    private speedStateIdle: number = 0.5
    private speedStateBack: number = 0.1


    protected start(): void {
        this.onActive(false)
        this.node.on(Button.EventType.CLICK, this.selectHorse, this)
    }

    onInit(pos: Vec3) {
        //Khoi tao vi tri ban dau cua ngua
        this.setPos(pos)
        this.setScaleHorse(this.scaleHorseStart)
    }

    setIsAttack(active: boolean) {
        this.isAttack = active
    }

    setPos(pos: Vec3) {
        //dat kich thuoc cho ngua
        this.node.setPosition(pos);
    }

    onActive(active: boolean) {
        //active khi co the bam de di chuyen
        this.getComponent(Button).interactable = active
        if (active) {
            this.bubleHorse()
        }
        else {

            this.stopBubleHorse()
        }
    }

    selectHorse() {
        //Khi duoc chon se phat ra su kien de PlayGame thuc hien di chuyen 
        eventTarget.emit("MoveHorse", this.idHorse, this.own)
    }

    move(step: number) {
        //Di chuyen ngua theo State
        switch (this.state) {
            case HorseState.IDLE:
                //Neu dang trong chuong thi chuyen thanh RUN
                this.state = HorseState.RUN
                this.moveIdleState(step)
                break;
            case HorseState.RUN:
                //Neu dang Run
                this.moveRunState(step)
                break;
            case HorseState.FINISH:
                //Neu dang Finish
                this.moveFinishState(step, false, step)
                break;
        }
    }

    moveIdleState(step: number) {
        //Set vi tri thanh o xuat phat ban dau
        this.stepHandle += 1
        let posTmp = (this.stepHandle + this.startPosInMap) % 52
        let t = tween(this.node);
        t.to(this.speedStateIdle, { position: PlayGame.Instance.map.listAllPos[posTmp].getPos() });
        t.call(() => {
            PlayGame.Instance.map.listAllPos[posTmp].addHorse(this)
            eventTarget.emit("CompleteTurn", step)
        });
        t.start()
    }

    moveRunState(step: number) {
        //Set vi tri tu do hien tai toi STEP o tiep theo
        let posTmp = (this.stepHandle + this.startPosInMap) % 52
        PlayGame.Instance.map.listAllPos[posTmp].removeHorse(this)
        let checkComplete : Boolean = true
        let t = tween(this.node);
        let index = 0;
        for (var i = 1; i <= step; i++) {
            if (this.state === HorseState.RUN) {

                this.stepHandle += 1
                if (this.stepHandle + 1 === 51) {
                    this.state = HorseState.FINISH;
                    if(i < step) {
                        checkComplete = false
                    }
                }
                posTmp = (this.stepHandle + this.startPosInMap) % 52
                t = t.to(this.speedStateRun, { position: PlayGame.Instance.map.listAllPos[posTmp].getPos() });
            }
        }
        if(checkComplete) {

            t.call(() => {
                //Khi toi dich thi o thuc hien dat ngua vao
                PlayGame.Instance.map.listAllPos[posTmp].addHorse(this)
                if (this.isAttack) {
                    eventTarget.emit("CompleteTurn", 6)
                    this.setIsAttack(false)
                }
                else {
                    eventTarget.emit("CompleteTurn", step)
    
                }
            });
        }
        else {
            t.call(() => {
                this.moveFinishState(step - index, true, step)
            });
        }

        t.start();
    }

    moveFinishState(step: number, checkDo: boolean, stepPermmiss) {
        console.log("OKE VE DICH THOI NAO")
        //Set vi tri tu do hien tai toi STEP o tiep theo
        let posTmp = this.stepHandle - 51
        if(!checkDo) {
            PlayGame.Instance.map.finishAllHorse[this.own - 1][posTmp].removeHorse(this)

        }

        let t = tween(this.node);
        for (var i = 1; i <= step; i++) {
            this.stepHandle += 1
            posTmp = this.stepHandle - 51
            t = t.to(this.speedStateRun, { position: PlayGame.Instance.map.finishAllHorse[this.own - 1][posTmp].getPos() });
        }
        t.call(() => {
            //Khi toi dich thi o thuc hien dat ngua vao
            PlayGame.Instance.map.finishAllHorse[this.own - 1][posTmp].addHorse(this)
            eventTarget.emit("CompleteTurn", stepPermmiss)
        });

        t.start();
    }

    moveStart() {
        //Ve vi tri ban dau
        this.state = HorseState.IDLE
        let t = tween(this.node);
        let listPosRun = PlayGame.Instance.map.listAllPos
        for (var i = this.stepHandle - 1; i >= 0; i--) {
            this.stepHandle -= 1
            let posTmp = (this.stepHandle + this.startPosInMap) % 52
            t = t.to(this.speedStateBack, { position: PlayGame.Instance.map.listAllPos[posTmp].getPos() });
        }
        t = t.to(this.speedStateIdle, { position: PlayGame.Instance.map.startAllHorse[this.own - 1][this.idHorse].getPosition() });
        t.start()
        this.stepHandle -= 1
    }

    bubleHorse() {
        this.scaleCurrent = this.node.getScale();
        this.tweenCurrent = tween(this.node)
            .to(0.5, { scale: new Vec3(this.scaleCurrent.x * 1.1, this.scaleCurrent.y * 1.1, this.scaleCurrent.z * 1.1) })
            .to(0.5, { scale: new Vec3(this.scaleCurrent.x * 0.9, this.scaleCurrent.y * 0.9, this.scaleCurrent.z * 0.9) })
            .union()
            .repeatForever()
            .start();
    }

    stopBubleHorse() {
        if (this.tweenCurrent != null) {
            this.tweenCurrent.stop();
            this.setScaleHorse(this.scaleCurrent.x)
        }
    }

    setScaleHorse(amount: number) {
        this.node.scale = new Vec3(amount, amount, amount)
    }

    getScaleHorseStart() {
        return this.scaleHorseStart
    }

    getScaleHorseSquare() {
        return this.scaleHorseSquare
    }

    getScaleCurrent() {
        return this.scaleCurrent
    }
}


