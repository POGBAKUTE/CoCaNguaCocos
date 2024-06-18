import { _decorator, Component, Enum, Node } from 'cc';
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
}


