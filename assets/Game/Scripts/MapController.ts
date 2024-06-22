import { _decorator, Component, Node } from 'cc';
import { Horse } from './Horse';
import { Place } from './Place';
import { DestinationEnd } from './DestinationEnd';
const { ccclass, property } = _decorator;

@ccclass('MapController')
export class MapController extends Component {
    @property({type: Horse})
    listHorse1: Horse[] = []

    @property({type: Horse})
    listHorse2: Horse[] = []

    @property({type: Horse})
    listHorse3: Horse[] = []

    @property({type: Horse})
    listHorse4: Horse[] = []

    @property({type: Node})
    startHorse1: Node[] = []

    @property({type: Node})
    startHorse2: Node[] = []

    @property({type: Node})
    startHorse3: Node[] = []

    @property({type: Node})
    startHorse4: Node[] = []

    @property({type: Place})
    listAllPos: Place[] = []

    @property({type: Place})
    finishHorse1: Place[] = []

    @property({type: Place})
    finishHorse2: Place[] = []

    @property({type: Place})
    finishHorse3: Place[] = []

    @property({type: Place})
    finishHorse4: Place[] = []

    @property({type: DestinationEnd})
    endAllHorse: DestinationEnd[] = []

    @property({type: Node})
    listPosPlayer: Node[] = []

    listAllHorse: Array<Horse[]> = new Array<Horse[]>();
    startAllHorse: Array<Node[]> = new Array<Node[]>();
    finishAllHorse: Array<Place[]> = new Array<Place[]>();

    protected start(): void {
        this.onInit();
    }

    onInit() {
        this.initListAllHorse()
        this.initStartAllHorse();
        this.resetPosHorse();
        this.initFinishAllHorse()
        this.deActiveAllCharacter()
    }

    initListAllHorse() {
        this.listAllHorse.push(this.listHorse1)
        this.listAllHorse.push(this.listHorse2)
        this.listAllHorse.push(this.listHorse3)
        this.listAllHorse.push(this.listHorse4)
    }

    initStartAllHorse() {
        this.startAllHorse.push(this.startHorse1)
        this.startAllHorse.push(this.startHorse2)
        this.startAllHorse.push(this.startHorse3)
        this.startAllHorse.push(this.startHorse4)
    }

    initFinishAllHorse() {
        this.finishAllHorse.push(this.finishHorse1)
        this.finishAllHorse.push(this.finishHorse2)
        this.finishAllHorse.push(this.finishHorse3)
        this.finishAllHorse.push(this.finishHorse4)
    }

    resetPosHorse() {
        for(var i = 0; i < this.listAllHorse.length; i++) {
            for(var j = 0; j < this.listAllHorse[i].length; j++) {
                this.listAllHorse[i][j].onInit(this.startAllHorse[i][j].getPosition());
            }
        }
    }

    showListHorse() {
        this.listAllHorse.forEach(listHorse => {
            listHorse.forEach(horse => {
                console.log(horse.name)
            })
        });
    }

    deActiveHorse(index: number) {
        this.listAllHorse[index].forEach(horse => {
            horse.onActive(false);
        })
    }

    activeCharacter(id : number) {
        this.listAllHorse[id].forEach(horse => {
            horse.node.active = true;
        })
    }

    deActiveAllCharacter() {
        console.log("DUDDHD")
        this.listAllHorse.forEach(listHorse => {
            listHorse.forEach(horse => {
                horse.node.active = false
            })
        })
    }

}


