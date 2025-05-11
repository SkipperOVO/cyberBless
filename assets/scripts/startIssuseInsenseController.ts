import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('startIssuseInsenseController')
export class startIssuseInsenseController extends Component {

    @property({
        type: Node,
    })
    private insenseStockPanel: Node = null;

    @property({
        type: Node,
    })
    private faithStockPanel: Node = null;

    @property({
        type: Node,
    })
    private backgroundStockPanel: Node = null;



    @property({
        type: Node
    })
    private optionPanel: Node = null;
 

    start() {

    }

    update(deltaTime: number) {
        
    }

    onClick() {
        console.log("startIssuseInsenseController onClick");
        this.optionPanel.active = true
        this.node.active = false;  // 隐藏按钮的父节点(带着按钮的背景和按钮一起隐藏)
    }

    show() {
        this.node.active = true
    }

    hide() {
        this.node.active = false
    }
}

