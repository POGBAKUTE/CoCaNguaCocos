import { _decorator, Component, Node } from 'cc';
import { Horse } from './Horse';
import { Place } from './Place';
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

    listAllHorse: Array<Horse[]> = new Array<Horse[]>();
    startAllHorse: Array<Node[]> = new Array<Node[]>();

    protected start(): void {
        this.onInit();
    }

    onInit() {
        this.initListAllHorse()
        this.initStartAllHorse();
        this.resetPosHorse();
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

    resetPosHorse() {
        for(var i = 0; i < this.listAllHorse.length; i++) {
            for(var j = 0; j < this.listAllHorse[i].length; j++) {
                this.listAllHorse[i][j].setPos(this.startAllHorse[i][j].getPosition());
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

}


