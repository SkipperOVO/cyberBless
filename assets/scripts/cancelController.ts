import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cancelController')
export class cancelController extends Component {

    @property({
        type: Node,
        tooltip: 'insenseStockPanel',
    })
    private insenseStockPanel : Node = null;

    @property({
        type: Node,
        tooltip: 'startIsseueInsenseButton',
    })
    private startIsseueInsenseButton : Node = null;


    @property({
        type: Node,
    })
    private optionPanel : Node = null;



    start() {
    }

    protected onLoad(): void {
    }

    update(deltaTime: number) {
        
    }

    onClick() {
        this.startIsseueInsenseButton.getComponent("startIssuseInsenseController").show()
        this.optionPanel.active = false
    }
}

