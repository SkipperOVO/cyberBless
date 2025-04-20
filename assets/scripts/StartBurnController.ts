import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/*

负责启动香的燃烧

*/
@ccclass('StartBurnController')
export class StartBurnController extends Component {

    @property({
        type: Node,
        tooltip: '燃烧控制器',
    })
    private insenseUINode: Node = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    protected onLoad(): void {
        this.hideStartBurnButton()
    }

    onClick() {
        this.insenseUINode.getComponent("burningController").startBurn();
        this.hideStartBurnButton();
    }

    hideStartBurnButton() {
        this.node.parent.active    = false; // 隐藏按钮的父节点(带着按钮的背景和按钮一起隐藏)
    }

    showStartBurnButton() {
        this.node.parent.active = true; // 显示按钮的父节点
    }
}

