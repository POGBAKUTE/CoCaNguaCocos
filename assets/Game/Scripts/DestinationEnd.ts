import { _decorator, Component, Node, Vec3 } from 'cc';
import { Horse } from './Horse';
const { ccclass, property } = _decorator;

@ccclass('DestinationEnd')
export class DestinationEnd extends Component {
    listPos : Array<Vec3> = new Array<Vec3>()
    distance : number = 10
    start() {
        this.onInit()
    }

    onInit() {
        let pos = this.node.getPosition();
        this.listPos.push(new Vec3(pos.x - 2 * this.distance, pos.y, pos.z))
        this.listPos.push(new Vec3(pos.x - this.distance, pos.y, pos.z))
        this.listPos.push(new Vec3(pos.x + this.distance, pos.y, pos.z))
        this.listPos.push(new Vec3(pos.x + 2 * this.distance, pos.y, pos.z))
    }

    addHorse(horse : Horse) {
        horse.setScaleHorse(horse.getScaleHorseSquare())
        horse.setPos(this.listPos[horse.idHorse])
        
    }

    getPos() {
        return this.node.getPosition()
    }

    update(deltaTime: number) {
        
    }
}


