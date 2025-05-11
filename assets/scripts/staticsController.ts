import { _decorator, Component, Node, UITransform, Label } from 'cc';
import { UserInfo } from './model/userInfo';
const { ccclass, property } = _decorator;

@ccclass('staticsController')
export class staticsController extends Component {

    @property({
        type: Node,
        tooltip: '燃香状态',
    })
    private burningInsenseNode: Node;

    @property({
        type: Node,
    })
    private totalScoreNode: Node;

    @property({
        type: Node,
    })
    private scoreIntelligenceNode: Node;

    @property({
        type: Node,
    })
    private scoreRichNode: Node;

    @property({
        type: Node,
    })
    private scoreHealthNode: Node;

    @property({
        type: Node,
    })
    private scoreEmotionNode: Node;

    private deltaIntelliLabel: Node = null;

    private deltaRichLabel: Node = null;

    private deltaHealthLabel: Node = null;

    private deltaEmotionLabel: Node = null;

    private updatePeriod: number = 0;

    private timePassed: number = 0;

    private timePassedPartial: number = 0;

    private labelFloatingPassedTime: number = 0;

    private labelFaloatingTimeQuota: number = 1;

    private leftScoreToAdd: number = -1;

    private incenseType: string = "";


    start() {

        this.deltaEmotionLabel = this.scoreEmotionNode.getChildByName("DeltaScoreLabel");
        this.deltaHealthLabel = this.scoreHealthNode.getChildByName("DeltaScoreLabel");
        this.deltaRichLabel = this.scoreRichNode.getChildByName("DeltaScoreLabel");
        this.deltaIntelliLabel = this.scoreIntelligenceNode.getChildByName("DeltaScoreLabel");

        this.deltaEmotionLabel.active = false;
        this.deltaHealthLabel.active = false;
        this.deltaIntelliLabel.active = false;
        this.deltaRichLabel.active = false;
    }

    private userInfoModel: UserInfo = null;

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

        if (this.labelFloatingPassedTime > 0) {
            this.labelFloatingPassedTime += deltaTime
        }

        if (this.checkIsBurning()) {
            // 更新对应的跳动状态 UI
            const insense = this.burningInsenseNode.getComponent("burningController").getInsenseModel();
            let burnTime = 0; // 获取燃烧时间
            let meritValue = 0; // 获取燃香增加的功德值
            if (insense) {
                burnTime = insense.getBurningTime(); // 获取燃烧时间
                this.incenseType = insense.getScoreType(); // 获取香的类型
                meritValue = insense.getScore(); // 获取燃香增加的功德值

            }

            if (this.leftScoreToAdd < 0) {
                this.leftScoreToAdd = meritValue;
            }

            this.timePassedPartial += deltaTime;
            this.timePassed += deltaTime;

            let scorePartial = 1
            // 计算个周期分数变动值
            if (meritValue <= burnTime) {
                scorePartial = 1
                this.updatePeriod = burnTime / meritValue;
            } else {
                if (meritValue % burnTime == 0) {
                    scorePartial = (meritValue / burnTime)
                } else {
                    scorePartial = ((meritValue - meritValue % burnTime) / burnTime)
                }
                this.updatePeriod = 1
            }

            // const scorePartial = ((meritValue - meritValue % burnTime) / burnTime)

            // console.log("this.timePassedPartial", this.timePassedPartial, "this.updatePeriod", this.updatePeriod, "this.timePassed", this.timePassed, "burnTime", burnTime, "scorePartial", scorePartial)

            if (this.timePassedPartial >= this.updatePeriod && this.timePassed <= burnTime) {
                this.labelFloatingPassedTime += deltaTime;
                this.timePassedPartial = 0;
                console.log("insense type:", this.incenseType, "socrePartial", scorePartial, "updatePeriod", this.updatePeriod)
                this.leftScoreToAdd -= scorePartial;
                // 根据香的类型更新对应的分数 UI
                switch (this.incenseType) {
                    case 'Intelligence':
                        this.userInfoModel.setIntelligence(this.userInfoModel.getIntelligence() + scorePartial);
                        this.deltaIntelliLabel.getComponent(Label).string = this.getRandomIntelliBuff() + " +" + scorePartial.toString();
                        this.deltaIntelliLabel.active = true;
                        // async this.userInfoModel.save()
                        break;
                    case 'Rich':
                        this.userInfoModel.setRich(this.userInfoModel.getRich() + scorePartial);
                        this.deltaRichLabel.getComponent(Label).string = this.getRandomRichBuff() + " +" + scorePartial.toString();
                        this.deltaRichLabel.active = true;
                        break;
                    case 'Health':
                        this.userInfoModel.setHealth(this.userInfoModel.getHealth() + scorePartial);
                        this.deltaHealthLabel.getComponent(Label).string = this.getRandomHealthBuff() + "+" + scorePartial.toString();
                        this.deltaHealthLabel.active = true;
                        break;
                    case 'Emotion':
                        this.userInfoModel.setEmotion(this.userInfoModel.getEmotion() + scorePartial);
                        this.deltaEmotionLabel.getComponent(Label).string = this.getRandomEmotionBuff() + "+" + scorePartial.toString();
                        this.deltaEmotionLabel.active = true;
                        break;

                    default:
                        break;
                }
            } else {
                if (this.labelFloatingPassedTime >= this.labelFaloatingTimeQuota) {
                    this.deltaIntelliLabel.active = false;
                    this.deltaRichLabel.active = false;
                    this.deltaHealthLabel.active = false;
                    this.deltaEmotionLabel.active = false;
                    this.labelFloatingPassedTime = 0;
                }
            }


        } else {
            this.timePassed = 0;
            this.updatePeriod = 0;
            this.timePassedPartial = 0;
            this.complementScore()
            this.leftScoreToAdd = -1;

        }

        // 更新当前各个分区的总 score
        this.updateTotalStatisticsUI();

        // if (this.leftScoreToAdd > 0) {
        //     const mod = this.leftScoreToAdd
        //     switch (incenseType) {
        //         case 'Intelligence':
        //             this.userInfoModel.setIntelligence(this.userInfoModel.getIntelligence() + mod);
        //             this.deltaIntelliLabel.getComponent(Label).string = this.getRandomIntelliBuff() + " +" + mod.toString();
        //             this.deltaIntelliLabel.active = true;
        //             // async this.userInfoModel.save()
        //             break;
        //         case 'Rich':
        //             this.userInfoModel.setRich(this.userInfoModel.getRich() + mod);
        //             this.deltaRichLabel.getComponent(Label).string = this.getRandomRichBuff() + " +" + mod.toString();
        //             this.deltaRichLabel.active = true;
        //             break;
        //         case 'Health':
        //             this.userInfoModel.setHealth(this.userInfoModel.getHealth() + mod);
        //             this.deltaHealthLabel.getComponent(Label).string = this.getRandomHealthBuff() + "+" + mod.toString();
        //             this.deltaHealthLabel.active = true;
        //             break;
        //         case 'Emotion':
        //             this.userInfoModel.setEmotion(this.userInfoModel.getEmotion() + mod);
        //             this.deltaEmotionLabel.getComponent(Label).string = this.getRandomEmotionBuff() + "+" + mod.toString();
        //             this.deltaEmotionLabel.active = true;
        //             break;

        //         default:
        //             break;
        //     }
        // }



    }

    setUserInfoModel(userInfo: UserInfo) {
        this.userInfoModel = userInfo;
    }

    getUserInfoModel(): UserInfo {
        return this.userInfoModel;
    }

    checkIsBurning(): boolean {
        if (this.burningInsenseNode) {
            if (this.burningInsenseNode.getComponent("burningController").isBurning()) {
                return true;
            }
        }
        return false;
    }

    complementScore() {
        if (this.leftScoreToAdd <= 0) {
            return;
        }
        console.log("begin to complement ", this.incenseType, " score:", this.leftScoreToAdd)
        const left = this.leftScoreToAdd
        switch (this.incenseType) {
            case 'Intelligence':
                this.userInfoModel.setIntelligence(this.userInfoModel.getIntelligence() + left);
                this.deltaIntelliLabel.getComponent(Label).string = this.getRandomIntelliBuff() + " +" + left.toString();
                this.deltaIntelliLabel.active = true;
                // async this.userInfoModel.save()
                break;
            case 'Rich':
                this.userInfoModel.setRich(this.userInfoModel.getRich() + left);
                this.deltaRichLabel.getComponent(Label).string = this.getRandomRichBuff() + " +" + left.toString();
                this.deltaRichLabel.active = true;
                break;
            case 'Health':
                this.userInfoModel.setHealth(this.userInfoModel.getHealth() + left);
                this.deltaHealthLabel.getComponent(Label).string = this.getRandomHealthBuff() + "+" + left.toString();
                this.deltaHealthLabel.active = true;
                break;
            case 'Emotion':
                this.userInfoModel.setEmotion(this.userInfoModel.getEmotion() + left);
                this.deltaEmotionLabel.getComponent(Label).string = this.getRandomEmotionBuff() + "+" + left.toString();
                this.deltaEmotionLabel.active = true;
                break;

            default:
                break;
        }
        this.updateTotalStatisticsUI();
    }

    updateTotalStatisticsUI() {
        // 更新当前各个分区的总 score
        if (this.totalScoreNode) {
            this.totalScoreNode.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getTotalScore().toString();
        }
        if (this.scoreIntelligenceNode) {
            this.scoreIntelligenceNode.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getIntelligence().toString();
        }
        if (this.scoreRichNode) {
            this.scoreRichNode.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getRich().toString();
        }
        if (this.scoreHealthNode) {
            this.scoreHealthNode.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getHealth().toString();
        }
        if (this.scoreEmotionNode) {
            this.scoreEmotionNode.getChildByName("ScoreValue").getComponent(Label).string
                = this.userInfoModel.getEmotion().toString();
        }
    }

    getRandomIntelliBuff() {
        const buffs = ["智商", "分数", "才华", "天赋", "灵感"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

    getRandomRichBuff() {
        const buffs = ["财富", "人民币", "资产", "收入", "财产"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

    getRandomHealthBuff() {
        const buffs = ["健康", "体力", "精力", "活力", "耐力", "寿命"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

    getRandomEmotionBuff() {
        const buffs = ["情感", "心情", "快乐", "幸福", "爱情", "情人", "顺利"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

}
