import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('optionButtonController')
export class optionButtonController extends Component {

    @property({
        type: Node,
        tooltip: 'Option panel',
    })
    private optionPanel: Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    onClick() {
        this.optionPanel.active = !this.optionPanel.active; 
    }

}

