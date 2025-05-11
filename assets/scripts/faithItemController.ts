import { _decorator, Component, Node, Sprite, SpriteFrame, resources, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('faithItemController')
export class faithItemController extends Component {

    @property({
        type: Node,
        tooltip: 'character node',
    })
    private characterNode: Node = null;

    private faithModel: any = null;

    start() {

    }

    update(deltaTime: number) {

    }

    updateUIState() {
        const faithSpriteComponent = this.getComponent(Sprite);
        console.log("faithItemController updateUIState, faithSpriteFrame", faithSpriteComponent);
        if (faithSpriteComponent) {
            resources.load(this.faithModel.getName() + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                faithSpriteComponent.spriteFrame = spriteFrame;
            });
        }

        const faithNameNode = this.node.getChildByName("name");
        if (faithNameNode) {
            const labelComponent = faithNameNode.getComponent(Label);
            if (labelComponent) {
                labelComponent.string = this.faithModel.getCharacterName();
            }
        }
    }

    onclick() {
        console.log("faithItemController clicked, faithModel", this.faithModel);
        this.node.getParent().getComponent("faithStockController").setCharacterModel(this.faithModel);
    }

    setFaithModel(faith: any) {
        this.faithModel = faith;
        console.log("faithItemController setFaithModel, faithModel", this.faithModel);
        this.updateUIState();
    }
}

