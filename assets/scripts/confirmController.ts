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
        // 需要添加检查是选定了香才可以执行后续逻辑
        if (this.startBurnButtonNode.getComponent("StartBurnController").checkHasInsenseReady()) {
            this.optionPanel.active = false
            this.startBurnButtonNode.getComponent("StartBurnController").showStartBurnButton()
        } else {
            // TODO 需要增加一个弹窗提示
            console.log("没有香可以点燃");
        }
    }
}

