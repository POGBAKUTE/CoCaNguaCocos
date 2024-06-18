import { _decorator, CCInteger, Component, Enum, Node, Vec3 } from 'cc';
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

    setPos(pos: Vec3) {
        this.node.setPosition(pos);
    }
}


