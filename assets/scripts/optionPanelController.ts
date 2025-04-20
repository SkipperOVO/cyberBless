import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('optionPanelScrollController')
export class optionPanelScrollController extends Component {
    start() {
        this.node.active = false;
    }

    update(deltaTime: number) {
        
    }

    active() {
        this.node.active = true;
    }

    deactive() {
        this.node.active = false;
    }
}

