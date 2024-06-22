import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { MapController } from './MapController';
import { Character } from './Character';
import { eventTarget } from './GameManager';
import { Horse, HorseState } from './Horse';
import { Player } from './Player';
import { Bot } from './Bot';
import { UIManager } from './UI/UIManager';
import { UIVictory } from './UI/UIVictory';
const { ccclass, property } = _decorator;


@ccclass('PlayGame')
export class PlayGame extends Component {
    public static Instance: PlayGame;
    @property(Prefab)
    mapPrefab: Prefab

    @property(Prefab)
    playerPrefab: Prefab

    @property(Prefab)
    botPrefab: Prefab

    listCharacter : Character[]=[]
    map : MapController = null;

    countPlayer : number = 4

    private indexCurrentCharacter: number = 0;
    private stepCurrent: number = 0;



    protected onLoad(): void {
        if (PlayGame.Instance == null) {
            PlayGame.Instance = this;
        }
        else {
            this.destroy();
        }
        eventTarget.on("SelectHorse", this.onHandleSelectHorse, this)
        eventTarget.on("NextTurn", this.nextTurn, this)
        eventTarget.on("CompleteTurn", this.onCompleteTurn, this)
        eventTarget.on("MoveHorse", this.onMoveHorse, this)
        eventTarget.on("FinishHorse", this.onFinishHorse, this)
        this.indexCurrentCharacter = 0;
    }

    protected onDestroy(): void {
        eventTarget.off("SelectHorse", this.onHandleSelectHorse, this)
        eventTarget.off("NextTurn", this.nextTurn, this)
        eventTarget.off("CompleteTurn", this.onCompleteTurn, this)
        eventTarget.off("MoveHorse", this.onMoveHorse, this)
        eventTarget.off("FinishHorse", this.onFinishHorse, this)
    }

    onHandleSelectHorse(step: number, id: number) {
        
        // if(step === 6) {
        //     console.log("Cho di nguoi thu " + id)
        // }
        // else {
        //     console.log("Chua duoc nguoi thu " + id)
        // }
        // eventTarget.emit("CompleteTurn")
        console.log("So buoc: " + step)
        this.stepCurrent = step;
        let listActiveHorse = this.checkPermissionHorse(step);
        if(listActiveHorse.length === 0) {
            eventTarget.emit("CompleteTurn", step)
        }
        else if(listActiveHorse.length === 1 || this.checkCommonHorse(listActiveHorse)) {

            listActiveHorse[0].move(step);
        }
        else {
            listActiveHorse.forEach(horse => {
                horse.onActive(true);
            });
            this.listCharacter[id-1].onHandleController(listActiveHorse, this.stepCurrent)
        }
    }

    generateLevel(listCheck: Array<boolean>, listName : Array<string>) {
        this.generateMap()
        setTimeout(() => {

            this.generateCharacter(listCheck, listName)
        },5)
        this.onInit()
    }

    destroyLevel() {
        this.map.node.destroy();
        for(var character of this.listCharacter) {
            character.node.destroy();
        }
        this.listCharacter = new Array<Character>()
    }

    generateCharacter(listCheck: Array<boolean>, listName : Array<string>) {
        this.countPlayer = listCheck.length
        for(var i = 0; i < listCheck.length; i++) {
            if(listCheck[i]) {
                let playerNode = instantiate(this.playerPrefab)
                playerNode.parent = this.node.parent
                playerNode.setPosition(this.map.listPosPlayer[i].getPosition())
                let player = playerNode.getComponent(Character)
                player.setCharacter(i+1, listName[i]);
                this.listCharacter.push(player)
            }
            else {
                let botNode = instantiate(this.botPrefab)
                botNode.parent = this.node.parent
                botNode.setPosition(this.map.listPosPlayer[i].getPosition())
                let bot = botNode.getComponent(Character)
                bot.setCharacter(i+1, listName[i]);
                this.listCharacter.push(bot)
            }
            this.map.activeCharacter(i)
        }
        
    }

    generateMap() {
        let mapNode = instantiate(this.mapPrefab)
        mapNode.parent = this.node.parent
        mapNode.setSiblingIndex(0)
        this.map = mapNode.getComponent(MapController);
    }

    checkPermissionHorse(step: number) {
        let listActiveHorse : Array<Horse> = new Array<Horse>()
        this.map.listAllHorse[this.indexCurrentCharacter].forEach(horse => {
            if(horse.state === HorseState.RUN) {
                if(!this.map.listAllPos[(horse.stepHandle + step + horse.startPosInMap) % 52].checkFull()) {

                    listActiveHorse.push(horse)
                }
            }
            else if(horse.state === HorseState.FINISH) {
                if(horse.stepHandle + step <= 56) {
                    listActiveHorse.push(horse)
                }
            }
        });
        if(step === 6) {
            for(var horse of this.map.listAllHorse[this.indexCurrentCharacter]) {
                if(horse.state === HorseState.IDLE) {
                    listActiveHorse.push(horse)
                    break;
                }
            }
        }
        return listActiveHorse;
    }

    onMoveHorse(idHorse: number, idOwn: number) {
        this.map.deActiveHorse(this.indexCurrentCharacter)
        this.map.listAllHorse[idOwn - 1][idHorse].move(this.stepCurrent)
    }

    nextTurn(step: number) {
        if(step !== 6) {

            this.indexCurrentCharacter += 1
        }
        this.indexCurrentCharacter %= this.listCharacter.length;
        this.onHandleTurn()
    }

    onHandleTurn() {
        this.listCharacter[this.indexCurrentCharacter].onActive(true);
    }

    onCompleteTurn(step: number) {
        setTimeout(() => {
            this.listCharacter[this.indexCurrentCharacter].onActive(false);
            this.nextTurn(step);

        },800)
    }

    onInit() {
        this.listCharacter.forEach(character => {
            character.onActive(false)
        });
        this.onHandleTurn();
    }

    checkCommonHorse(listActiveHorse : Array<Horse>) {
        for(var i = 1; i < listActiveHorse.length; i++) {
            if(listActiveHorse[i].stepHandle != listActiveHorse[i-1].stepHandle) {
                return false;
            }
        }
        return true
    }

    onFinishHorse(idOwn : number) {
        console.log("IDOWN : " +  idOwn)
        let character : Character = this.listCharacter[idOwn]
        character.countHorseFinish += 1;
        if(character.countHorseFinish === 4) {
            console.log("Nguoi thu " + (idOwn + 1) + " win roi")
            UIManager.Instance.openUI(UIVictory)
            UIManager.Instance.getUI(UIVictory).updateNotify(character.nameCharacter.string)
        }
    }
}


