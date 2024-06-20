import { _decorator, Component, Enum, Node, Vec3 } from 'cc';
import { Horse } from './Horse';
const { ccclass, property } = _decorator;

export enum PlaceType {
    NORMAL = 0,
    SAFE = 1
}
@ccclass('Place')

export class Place extends Component {
    @property({ type: Enum(PlaceType) })
    type: PlaceType = PlaceType.NORMAL;

    horseCurrent: Horse = null;

    listPos: Array<Vec3> = new Array<Vec3>()
    listHorse: Array<Horse> = new Array<Horse>()

    distance: number = 10

    protected start(): void {
        let pos = this.node.getPosition();
        //Them cac diem trong o khi nhieu ngua
        this.listPos.push(new Vec3(pos.x - this.distance, pos.y + this.distance, pos.z))
        this.listPos.push(new Vec3(pos.x + this.distance, pos.y + this.distance, pos.z))
        this.listPos.push(new Vec3(pos.x - this.distance, pos.y - this.distance, pos.z))
        this.listPos.push(new Vec3(pos.x + this.distance, pos.y - this.distance, pos.z))
    }

    getPos() {
        //tra ve vi tri o
        return this.node.getPosition();
    }

    addHorse(horse: Horse) {
        //them ngua
        if (this.listHorse.length > 0) {
            //check neu co ngua trong o thi kiem tra co phai chung chu khong
            if (this.listHorse[0].own !== horse.own) {

                this.checkOwn(horse)
            }
            else {
                this.listHorse.push(horse)
                //neu nhieu hon 1 ngua thi phai xep lai vi tri
                if (this.listHorse.length > 1) {

                    this.setPosListHorse();
                }
            }
        }
        else {

            this.listHorse.push(horse)
        }

    }

    removeHorse(horse: Horse) {
        //xoa ngua neu ngua roi khoi vi tri o
        const index = this.listHorse.indexOf(horse);
        console.log("INDEX REMOVE: " + index)
        if (index !== -1) {
            //Neu co ngua do trong list thi xoa
            this.listHorse.splice(index, 1);
        }
        //tra lai kich thuoc cua ngua
        horse.setScaleHorse(horse.getScaleHorseStart())
        if (this.listHorse.length == 1) {
            //neu con 1 ngua thi xep lai vi tri o giua o
            this.listHorse[0].setScaleHorse(this.listHorse[0].getScaleHorseStart())
            this.listHorse[0].setPos(this.getPos())
        }
    }

    setPosListHorse() {
        //Dat lai vi tri ngua trong list
        for (var i = 0; i < this.listHorse.length; i++) {
            this.listHorse[i].setPos(this.listPos[i])
            this.listHorse[i].setScaleHorse(this.listHorse[i].getScaleHorseSquare())
        }
    }

    checkOwn(horseNew: Horse) {
        // let horseCheck : Horse = null;
        // let index : number = 0;
        // for(var i = 0; i < this.listHorse.length; i++) {
        //     if(this.listHorse[i].own !=horseNew.own) {
        //         horseCheck = this.listHorse[i];
        //         index = i;
        //         break;
        //     }
        // }
        // if(horseCheck != null && this.type === PlaceType.NORMAL) {
        //     //Neu co ngua khac chu thi ngua do ve vach xuat phat
        //     console.log("Ngua bi da la " + horseCheck.name)
        //     this.removeHorse(horseCheck)
        //     horseCheck.moveStart();
        //     //Chu cua ngua tan cong duoc di tiep luot nua
        //     horseNew.setIsAttack(true) 
        // }

        if (this.type === PlaceType.NORMAL) {
            //Neu co ngua khac chu thi ngua do ve vach xuat phat
            horseNew.setIsAttack(true)
            let time = 0
            let index = this.listHorse.length;
            while(index > 0) {
                let horse = this.listHorse[0];
                this.removeHorse(horse)
                setTimeout(() => {
                    horse.moveStart();
                }, time)
                time += 200
                index--
            }
            //Chu cua ngua tan cong duoc di tiep luot nua
        }
        this.listHorse.push(horseNew);
        if (this.listHorse.length > 1) {

            this.setPosListHorse();
        }
            
    }
}


