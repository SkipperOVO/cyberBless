import { _decorator, Component, Node, Label, SpriteFrame, Sprite, resources } from 'cc';
import { Insense } from './model/insense';
const { ccclass, property } = _decorator;

@ccclass('insenseItemController')
export class insenseItemController extends Component {

    // prefab 好像无法通过 cocos2d 的编辑器直接设置绑定，因此通过代码来间接绑定
    @property({
        type: Node,
        tooltip: '香的模型',
    })
    private burningInsenseNode : Node = null;


    start() {

    }
    
    private insenseModel: Insense = null;

    update(deltaTime: number) {

    }

    updateUIState() {
        // const nameNodeLabel = this.node.getChildByName("insenseName");
        // if (nameNodeLabel) {
        //     const labelComponent = nameNodeLabel.getComponent("Label");
        //     if (labelComponent) {
        //         labelComponent.string = this.insenseName;
        //     }
        // }
        const insenseNameNode = this.node.getChildByName("insenseName");
        const insenseBurnTimeLabelNode = this.node.getChildByName("insenseBurnTimeLabel");
        const insenseBurnTimeNode = this.node.getChildByName("insenseBurnTime");
        const insenseEffectLabelNode = this.node.getChildByName("insenseEffectLabel");
        const insenseScoreNode = this.node.getChildByName("insenseScore");
        const insenseSpriteFrameNode = this.node.getChildByName("spriteFrame")

        if (insenseNameNode) {
            const labelComponent = insenseNameNode.getComponent(Label);
            if (labelComponent) {
                labelComponent.string = this.insenseModel.getInsenseName();
            }
        }
        if (insenseBurnTimeLabelNode) {
            const labelComponent = insenseBurnTimeLabelNode.getComponent(Label);
            if (labelComponent) {
                labelComponent.string = "燃烧时长：";
            }
        }
        if (insenseBurnTimeNode) {
            const labelComponent = insenseBurnTimeNode.getComponent(Label);
            if (labelComponent) {
                labelComponent.string = this.insenseModel.getBurningTime() + "秒";
            }
        }
        if (insenseEffectLabelNode) {
            const labelComponent = insenseEffectLabelNode.getComponent(Label);
            if (labelComponent) {
                labelComponent.string = this.insenseModel.getScoreType();
            }
        }
        if (insenseScoreNode) {
            const labelComponent = insenseScoreNode.getComponent(Label);
            if (labelComponent) {
                labelComponent.string = this.insenseModel.getScore() + "";
            }
        }
        if (insenseSpriteFrameNode) {
            const spriteComponent = insenseSpriteFrameNode.getComponent(Sprite);
            if (spriteComponent) {
                resources.load(this.insenseModel.getInsenseName() + "-min" + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        console.error('Failed to load sprite frame:', err);
                        // Provide a fallback or notify the user
                        return;
                    }
                    spriteComponent.spriteFrame = spriteFrame;
                });
            }
        }
        // const insenseScoreNode = this.node.getChildByName("insenseScore");
    }


    protected onLoad(): void {
        
    }


    onClick() {
        console.log("insense clicked----------------------------------");
        //todo 校验权限是否通过，用户是否拥有此香型
        this.burningInsenseNode.getComponent("burningController").setInsenseModel(this.insenseModel);   
    }

    setInsenseModel(model: Insense) {
        this.insenseModel = model;
        this.updateUIState();
    }

    getInsenseModel(): Insense {
        return this.insenseModel;
    }

    setBurningInsenseNode(node: Node) {
        this.burningInsenseNode = node;
    }

}

