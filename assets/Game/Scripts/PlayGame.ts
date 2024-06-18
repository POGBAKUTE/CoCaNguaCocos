import { _decorator, Component, Node } from 'cc';
import { MapController } from './MapController';
import { Character } from './Character';
import { eventTarget } from './GameManager';
const { ccclass, property } = _decorator;


@ccclass('PlayGame')
export class PlayGame extends Component {
    
    @property(MapController)
    map: MapController

    @property({type: Character})
    listCharacter : Character[]=[]

    private indexCurrentCharacter: number = 0;



    protected onLoad(): void {
        eventTarget.on("MoveHorse", this.onHandleMoveHorse, this)
        eventTarget.on("NextTurn", this.nextTurn, this)
        this.indexCurrentCharacter = 0;
        
    }

    onHandleMoveHorse(step: number) {
        if(step === 6) {
            console.log("Cho di")
        }
        else {
            console.log("Chua duoc")
        }
    }

    nextTurn() {
        this.indexCurrentCharacter += 1
        this.indexCurrentCharacter %= this.listCharacter.length;
        this.onHandleTurn()
    }

    onHandleTurn() {

    }
}


