import { _decorator, Component, Node, Sprite, SpriteFrame, Label, resources } from 'cc';
import { Faith } from './model/faith';
const { ccclass, property } = _decorator;

@ccclass('characterController')
export class characterController extends Component {

    @property({
        type: Node,
        tooltip: 'character node',
    })
    private characterNode: Node = null;

    private characterModel: any = null;

    start() {

    }

    update(deltaTime: number) {
        
    }

    updateUIState() {
        const characterSpriteComponent = this.getComponent(Sprite);
        console.log("characterController updateUIState, characterSpriteFrame", characterSpriteComponent);
        if (characterSpriteComponent) {
            resources.load(this.characterModel.getName() + "/spriteFrame", SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                characterSpriteComponent.spriteFrame = spriteFrame;
            });
        }

        // const characterNameNode = this.node.getChildByName("name");
        // if (characterNameNode) {
        //     const labelComponent = characterNameNode.getComponent(Label);
        //     if (labelComponent) {
        //         labelComponent.string = this.characterModel.getCharacterName();
        //     }
        // }

    }

    setCharacterModel(character: Faith) {
        this.characterModel = character;
        this.updateUIState();   
    }
}

