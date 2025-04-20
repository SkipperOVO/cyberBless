import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('confirmController')
export class confirmController extends Component {

    @property({
        type: Node,
    })
    private insenseStockPanel : Node = null;

    @property({
        type: Node,
    })
    private startBurnButtonNode : Node = null;


    start() {
    }

    protected onLoad(): void {
        this.node.active = false
    }

    update(deltaTime: number) {
        
    }

    onClick() {
        this.node.parent.active = false
        this.insenseStockPanel.active = false
        this.startBurnButtonNode.getComponent("StartBurnController").showStartBurnButton()
    }
}

