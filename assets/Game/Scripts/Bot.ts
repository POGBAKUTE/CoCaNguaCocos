import { _decorator, Component, Node } from 'cc';
import { Character } from './Character';
import { Horse, HorseState } from './Horse';
import { PlayGame } from './PlayGame';
import { PlaceType } from './Place';
const { ccclass, property } = _decorator;

@ccclass('Bot')
export class Bot extends Character {
    onHandleClick(): void {
        this.onHandleAfterDice();
    }

    onHandleController(listActiveHorse: Array<Horse>, step: number): void {
        let horseChoose: Horse = null;
        let horseCheckIdle: Horse = listActiveHorse[listActiveHorse.length - 1]
        if (horseCheckIdle.state === HorseState.IDLE) {
            if (!this.getRamdomTrueFalse()) {
                horseCheckIdle.selectHorse();
                return;
            }
        }
        let mapHorse: Map<Horse, number> = new Map();
        console.log(listActiveHorse.length + " CHIEU DAI")
        for (var horse of listActiveHorse) {
            let amount: number = 0;
            let countPosStep = this.checkPosStep(horse, step)
            let countPosPreHorse = this.checkPosPreHorse(horse, step)
            let countPosNextHorse = this.checkPosNextHorse(horse, step)
            amount += 100 * countPosStep
            amount += 10 * countPosPreHorse
            amount += -10 * countPosNextHorse
            if (this.checkSafe(horse, step)) {
                amount += 20;
            }
            mapHorse.set(horse, amount)
            console.log(horse.name + " co diem la: " + amount)
        }
        let min = -1000;
        for (var [key, value] of mapHorse) {
            if (value > min) {
                min = value
                horseChoose = key
            }
            else if(value === min) {
                if(value >= 0) {
                    if(horseChoose.stepHandle < key.stepHandle) {
                        horseChoose = key
                    }
                }
                else {
                    if(horseChoose.stepHandle > key.stepHandle) {
                        horseChoose = key
                    }
                }
            }
        }
        horseChoose.selectHorse()
    }

    getRamdomTrueFalse() {
        let random = Math.random();
        return random > 0.5;
    }

    checkPosStep(horse: Horse, step: number) {
        let posTmp = (horse.stepHandle + horse.startPosInMap + step) % 52;
        return PlayGame.Instance.map.listAllPos[posTmp].getCountHorseDifferentNORMAL(horse.own)
    }

    checkPosPreHorse(horse: Horse, step: number) {
        let count = 0;
        if (PlayGame.Instance.map.listAllPos[(horse.stepHandle + horse.startPosInMap) % 52].type !== PlaceType.SAFE) {

            for (var i = 0; i <= 6; i++) {
                let posTmp = (horse.stepHandle + horse.startPosInMap - i)
                if (posTmp < 0) {
                    posTmp += 52;
                }
                posTmp %= 52
                count += PlayGame.Instance.map.listAllPos[posTmp].getCountHorseDifferentAll(horse.own)
            }
        }
        return count
    }

    checkPosNextHorse(horse: Horse, step: number) {
        let count = 0;
        for (var i = 1; i < step; i++) {
            let posTmp = (horse.stepHandle + horse.startPosInMap + i) % 52;
            count += PlayGame.Instance.map.listAllPos[posTmp].getCountHorseDifferentAll(horse.own)
        }
        return count
    }

    checkSafe(horse: Horse, step: number) {
        let posTmp = (horse.stepHandle + horse.startPosInMap + step) % 52;
        return PlayGame.Instance.map.listAllPos[posTmp].type === PlaceType.SAFE
    }
}


