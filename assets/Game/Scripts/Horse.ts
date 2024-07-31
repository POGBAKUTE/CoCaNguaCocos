import { _decorator, bezier, Button, CCInteger, Component, easing, Enum, Node, tween, v3, Vec3 } from 'cc';
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


    private highJumpIdleState: number = 100
    private highJumpIdleRun: number = 20

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

    calculateQuadraticBezierPoint(t, p0, p1, p2) {
        const x =
            (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y =
            (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        return new Vec3(x, y, 0);
    }

    moveIdleState(step: number) {
        //Set vi tri thanh o xuat phat ban dau
        this.stepHandle += 1
        let posTmp = (this.stepHandle + this.startPosInMap) % 52
        let startPos = this.node.getPosition();
        let endPos = PlayGame.Instance.map.listAllPos[posTmp].getPos()
        let middlePosX = (startPos.x + endPos.x) / 2
        let middlePosY = (startPos.y + endPos.y) / 2
        let controlPos = new Vec3(middlePosX + this.highJumpIdleState, middlePosY + this.highJumpIdleState)
        let t = tween(this.node);
        t.to(this.speedStateIdle, {}, {
            onUpdate: (target: Node, ratio) => {
                let pos = this.calculateQuadraticBezierPoint(
                    ratio,
                    startPos,
                    controlPos,
                    endPos
                );
                target.setPosition(pos.x, pos.y, pos.z);
            },
            easing: easing.cubicOut
        })
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
        let checkComplete: Boolean = true
        let t = tween(this.node);
        let index = 0;
        for (var i = 1; i <= step; i++) {
            if (this.state === HorseState.RUN) {

                this.stepHandle += 1
                if (this.stepHandle + 1 === 51) {
                    this.state = HorseState.FINISH;
                    if (i < step) {
                        checkComplete = false
                        index = i
                    }
                }
                posTmp = (this.stepHandle + this.startPosInMap) % 52
                let startPos = PlayGame.Instance.map.listAllPos[(this.stepHandle - 1 + this.startPosInMap) % 52].getPos()
                let endPos = PlayGame.Instance.map.listAllPos[posTmp].getPos()
                let middlePosX = (startPos.x + endPos.x) / 2
                let middlePosY = (startPos.y + endPos.y) / 2
                let controlPos
                if ((5 <= posTmp && posTmp <= 10) || (13 <= posTmp && posTmp <= 17) ||
                    (24 <= posTmp && posTmp <= 25) || (32 <= posTmp && posTmp <= 36) || (39 <= posTmp && posTmp <= 43) || (50 <= posTmp && posTmp <= 51)) {
                    controlPos = new Vec3(middlePosX, middlePosY + this.highJumpIdleRun)
                }
                else {

                    controlPos = new Vec3(middlePosX - this.highJumpIdleRun, middlePosY)
                }
                t = t.to(this.speedStateRun, {}, {
                    onUpdate: (target: Node, ratio) => {
                        let pos = this.calculateQuadraticBezierPoint(
                            ratio,
                            startPos,
                            controlPos,
                            endPos
                        );
                        target.setPosition(pos.x, pos.y, pos.z);
                        let scale = (-0.4 * ratio * ratio + 0.4 * ratio + 1) * this.scaleHorseStart
                        console.log(scale)
                        target.setScale(new Vec3(scale, scale, scale))
                    },
                    easing: easing.cubicOut
                });
            }
        }
        if (checkComplete) {

            t.call(() => {
                //Khi toi dich thi o thuc hien dat ngua vao
                PlayGame.Instance.map.listAllPos[posTmp].addHorse(this)
                if (this.isAttack) {

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
        //Set vi tri tu do hien tai toi STEP o tiep theo
        let posTmp = this.stepHandle - 51
        if (!checkDo) {
            if (this.stepHandle === 50) {
                PlayGame.Instance.map.listAllPos[(this.stepHandle + this.startPosInMap) % 52].removeHorse(this)

            }
            else {
                PlayGame.Instance.map.finishAllHorse[this.own - 1][posTmp].removeHorse(this)
            }

        }

        let t = tween(this.node);
        for (var i = 1; i <= step; i++) {
            this.stepHandle += 1
            posTmp = this.stepHandle - 51
            let startPos
            if(posTmp !== 0) {
                startPos = PlayGame.Instance.map.finishAllHorse[this.own - 1][posTmp - 1].getPos()
            }
            else {
                startPos = PlayGame.Instance.map.listAllPos[(50 + this.startPosInMap) % 52].getPos()
            }
            let endPos
            if(posTmp != 5) {
                endPos = PlayGame.Instance.map.finishAllHorse[this.own - 1][posTmp].getPos()
            }
            else {
                this.state = HorseState.WIN
                endPos = PlayGame.Instance.map.endAllHorse[this.own - 1].getPos()
            }
            let middlePosX = (startPos.x + endPos.x) / 2
            let middlePosY = (startPos.y + endPos.y) / 2
            let controlPos
            if (this.own === 2 || this.own === 4) {
                controlPos = new Vec3(middlePosX, middlePosY + this.highJumpIdleRun)
            }
            else {

                controlPos = new Vec3(middlePosX - this.highJumpIdleRun, middlePosY)
            }
            t = t.to(this.speedStateRun, {}, {
                onUpdate: (target: Node, ratio) => {
                    let pos = this.calculateQuadraticBezierPoint(
                        ratio,
                        startPos,
                        controlPos,
                        endPos
                    );
                    target.setPosition(pos.x, pos.y, pos.z);
                    let scale = (-0.4 * ratio * ratio + 0.4 * ratio + 1) * this.scaleHorseStart
                    console.log(scale)
                    target.setScale(new Vec3(scale, scale, scale))
                },
                easing: easing.cubicOut
            });  
        }
        t.call(() => {
            if (this.state === HorseState.FINISH) {
                PlayGame.Instance.map.finishAllHorse[this.own - 1][posTmp].addHorse(this)
                eventTarget.emit("CompleteTurn", stepPermmiss)

            }
            else if (this.state === HorseState.WIN) {
                PlayGame.Instance.map.endAllHorse[this.own - 1].addHorse(this)
                eventTarget.emit("CompleteTurn", 6)
                eventTarget.emit("FinishHorse", (this.own - 1))
            }
            //Khi toi dich thi o thuc hien dat ngua vao
        });

        t.start();
    }

    moveStart(checkComplete: boolean) {
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
        if (checkComplete) {
            t.call(() => {
                eventTarget.emit("CompleteTurn", 6)
            });
        }
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
        this.scaleCurrent = this.node.scale
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


