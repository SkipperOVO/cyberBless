import { _decorator, Component, Node, UITransform, Label } from 'cc';
import { UserInfo } from './model/userInfo';
const { ccclass, property } = _decorator;

@ccclass('staticsController')
export class staticsController extends Component {

    @property({
        type: Node,
    })
    private totalScoreValue: Node = null;

    @property({
        type: Node,
    })
    private ScoreIntelligenceValue: Node = null;
    
    @property({
        type: Node,
    })
    private ScoreRichValue: Node = null;

    @property({
        type: Node,
    })
    private ScoreHealthValue: Node = null;

    @property({
        type: Node,
    })
    private ScoreEmotionValue: Node = null;


    start() {

    }

    private userInfoModel : UserInfo = null;

    protected onLoad(): void {
        // const canvas = this.node.parent; // Assuming the parent is the Canvas
        // if (canvas) {
        //     const canvasWidth = canvas.getComponent(UITransform)?.contentSize.width || 0;
        //     const canvasHeight = canvas.getComponent(UITransform)?.contentSize.height || 0;
        //     const nodeWidth = this.node.getComponent(UITransform)?.width || 0;

        //     this.node.setPosition(
        //         canvasWidth * 0.50, // Position at the right quarter minus half the node's width
        //         canvasHeight / 2 - 50,             // 20 units from the top
        //         0
        //     );
        // }
    }


    update(deltaTime: number) {
        if (!this.userInfoModel) {
            return;
        }
        if (this.totalScoreValue) {
            this.totalScoreValue.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getTotalScore().toString();
        }
        if (this.ScoreIntelligenceValue) {
            this.ScoreIntelligenceValue.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getIntelligence().toString();
        }
        if (this.ScoreRichValue) {
            this.ScoreRichValue.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getRich().toString();
        }
        if (this.ScoreHealthValue) {
            this.ScoreHealthValue.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getHealth().toString();
        }
        if (this.ScoreEmotionValue) {
            this.ScoreEmotionValue.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getEmotion().toString();
        }

    }

    setUserInfoModel(userInfo: UserInfo) {
        this.userInfoModel = userInfo;
    }   

    getUserInfoModel(): UserInfo {
        return this.userInfoModel;
    }

}
