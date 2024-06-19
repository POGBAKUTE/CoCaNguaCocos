import { _decorator, Component, Enum, Node, Vec3 } from 'cc';
import { Horse } from './Horse';
const { ccclass, property } = _decorator;

export enum PlaceType {
    NORMAL = 0,
    SAFE = 1
}
@ccclass('Place')

export class Place extends Component {
    @property({type: Enum(PlaceType)})
    type: PlaceType = PlaceType.NORMAL;

    horseCurrent: Horse = null;

    listPos: Array<Vec3> = new Array<Vec3>()
    listHorse: Array<Horse> = new Array<Horse>()

    distance: number = 10

    protected start(): void {
        let pos = this.node.getPosition();
        this.listPos.push(new Vec3(pos.x - this.distance, pos.y + this.distance, pos.z))
        this.listPos.push(new Vec3(pos.x + this.distance, pos.y + this.distance, pos.z))
        this.listPos.push(new Vec3(pos.x - this.distance, pos.y - this.distance, pos.z))
        this.listPos.push(new Vec3(pos.x + this.distance, pos.y - this.distance, pos.z))
    }

    getPos() {
        return this.node.getPosition();
    }

    addHorse(horse : Horse) {
        if(this.listHorse.length > 0) {
            this.checkOwn(horse)
        }
        this.listHorse.push(horse)
        if(this.listHorse.length> 1) {

            this.setPosListHorse();
        }
    }

    removeHorse(horse: Horse) {
        const index = this.listHorse.indexOf(horse);
        console.log("INDEX REMOVE: " + index)
        if (index !== -1) {
            this.listHorse.splice(index, 1);
        }
        horse.setScaleHorse(1)
    }

    setPosListHorse() {
        for(var i = 0 ; i < this.listHorse.length; i++) {
            this.listHorse[i].setPos(this.listPos[i])
            this.listHorse[i].setScaleHorse(0.5)
        }
    }

    checkOwn(horseNew : Horse) {
        let horseCheck : Horse = null;
        let index : number = 0;
        for(var i = 0; i < this.listHorse.length; i++) {
            if(this.listHorse[i].own !=horseNew.own) {
                horseCheck = this.listHorse[i];
                index = i;
                break;
            }
        }
        if(horseCheck != null) {
            horseCheck.moveStart();
            this.listHorse.slice(index, 1)
        }
    }
}


