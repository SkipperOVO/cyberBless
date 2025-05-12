import { _decorator, Component, Node, UITransform, Label, Color, tween, Vec3 } from 'cc';
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

    private deltaTotalScoreLabel: Node = null;

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
        this.deltaTotalScoreLabel = this.totalScoreNode.getChildByName("DeltaScoreLabel");

        this.deltaEmotionLabel.active = false;
        this.deltaHealthLabel.active = false;
        this.deltaIntelliLabel.active = false;
        this.deltaRichLabel.active = false;
        this.deltaTotalScoreLabel.active = false;
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
                        // this.deltaIntelliLabel.getComponent(Label).string = this.getRandomIntelliBuff() + " +" + scorePartial.toString();
                        // this.deltaIntelliLabel.active = true;
                        this.addFloatingLabel(this.scoreIntelligenceNode, this.getRandomIntelliBuff() + " +" + scorePartial.toString(), this.deltaIntelliLabel, this.timePassedPartial);
                        // async this.userInfoModel.save()
                        break;
                    case 'Rich':
                        this.userInfoModel.setRich(this.userInfoModel.getRich() + scorePartial);
                        // this.deltaRichLabel.getComponent(Label).string = this.getRandomRichBuff() + " +" + scorePartial.toString();
                        // this.deltaRichLabel.active = true;
                        this.addFloatingLabel(this.scoreRichNode, this.getRandomRichBuff() + " +" + scorePartial.toString(), this.deltaRichLabel, this.timePassedPartial);
                        break;
                    case 'Health':
                        this.userInfoModel.setHealth(this.userInfoModel.getHealth() + scorePartial);
                        // this.deltaHealthLabel.getComponent(Label).string = this.getRandomHealthBuff() + "+" + scorePartial.toString();
                        // this.deltaHealthLabel.active = true;
                        this.addFloatingLabel(this.scoreHealthNode, this.getRandomHealthBuff() + " +" + scorePartial.toString(), this.deltaHealthLabel, this.timePassedPartial);
                        break;
                    case 'Emotion':
                        this.userInfoModel.setEmotion(this.userInfoModel.getEmotion() + scorePartial);
                        // this.deltaEmotionLabel.getComponent(Label).string = this.getRandomEmotionBuff() + "+" + scorePartial.toString();
                        // this.deltaEmotionLabel.active = true;
                        this.addFloatingLabel(this.scoreEmotionNode, this.getRandomEmotionBuff() + " +" + scorePartial.toString(), this.deltaEmotionLabel, this.timePassedPartial);
                        break;

                    default:
                        break;
                }
                // 无论哪种香更新，都要更新总分数的 UI
                this.userInfoModel.setTotalScore(this.userInfoModel.getTotalScore() + scorePartial);
                // this.deltaTotalScoreLabel.getComponent(Label).string = "功德" + "+" + scorePartial.toString();
                this.addFloatingLabel(this.totalScoreNode, "功德" + "+" + scorePartial.toString(), this.deltaTotalScoreLabel, this.timePassedPartial);
                // this.deltaTotalScoreLabel.active = true;

            } else {
                if (this.labelFloatingPassedTime >= this.labelFaloatingTimeQuota) {
                    // this.deltaIntelliLabel.active = false;
                    // this.deltaRichLabel.active = false;
                    // this.deltaHealthLabel.active = false;
                    // this.deltaEmotionLabel.active = false;
                    // this.deltaTotalScoreLabel.active = false;
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

    addFloatingLabel(father: Node, label: string, deltaLabelNode: Node, duration: number = 1) {
        const labelNode = new Node();
        const labelComponent = labelNode.addComponent(Label);
        labelComponent.string = label;

        if (!father || !father.isValid) {
            console.error("Parent node is invalid or null.");
            return;
        }

        father.addChild(labelNode);

        const pos = deltaLabelNode.getPosition();
        labelNode.setPosition(pos);
        const deltaLabelUITransform = deltaLabelNode.getComponent(UITransform);
        const labelUITransform = labelNode.getComponent(UITransform);
        if (deltaLabelUITransform && labelUITransform) {
            labelUITransform.width = deltaLabelUITransform.width;
            labelUITransform.height = deltaLabelUITransform.height;
        }

        const deltaLabelComponent = deltaLabelNode.getComponent(Label);
        if (deltaLabelComponent) {
            labelComponent.fontSize = deltaLabelComponent.fontSize;
            labelComponent.lineHeight = deltaLabelComponent.lineHeight;
            labelComponent.color = deltaLabelComponent.color;
            labelComponent.isBold = deltaLabelComponent.isBold;
        }
        tween(labelNode)
            .parallel(
                tween().to(1.25, { position: new Vec3(pos.x, pos.y + 120, pos.z) }),
                // tween().to(1, { color: new Color(255, 255, 255, 0) }) // 变透明
            )
            .call(() => {
                tween(labelNode).stop();
                father.removeChild(labelNode); // 动作完成后销毁
                labelNode.destroy(); // 动作完成后销毁
            })
            .start();
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
                // this.deltaIntelliLabel.getComponent(Label).string = this.getRandomIntelliBuff() + " +" + left.toString();
                // this.deltaIntelliLabel.active = true;
                // async this.userInfoModel.save()
                break;
            case 'Rich':
                this.userInfoModel.setRich(this.userInfoModel.getRich() + left);
                // this.deltaRichLabel.getComponent(Label).string = this.getRandomRichBuff() + " +" + left.toString();
                // this.deltaRichLabel.active = true;
                break;
            case 'Health':
                this.userInfoModel.setHealth(this.userInfoModel.getHealth() + left);
                // this.deltaHealthLabel.getComponent(Label).string = this.getRandomHealthBuff() + "+" + left.toString();
                // this.deltaHealthLabel.active = true;
                break;
            case 'Emotion':
                this.userInfoModel.setEmotion(this.userInfoModel.getEmotion() + left);
                // this.deltaEmotionLabel.getComponent(Label).string = this.getRandomEmotionBuff() + "+" + left.toString();
                // this.deltaEmotionLabel.active = true;
                break;
            case 'score':
                this.userInfoModel.setTotalScore(this.userInfoModel.getTotalScore() + left);
                // this.deltaTotalScoreLabel.getComponent(Label).string = "功德" + "+" + left.toString();
                // this.deltaTotalScoreLabel.active = true;
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
        const buffs = ["智商", "分数", "才华", "天赋", "灵感", "满分", "录取", "上岸", "高分拿下", "面试通过", "笔试通过",  "论文", "证书", "六级通过", "四级通过", "考研成功", "学业有成", "学业顺利", "学业进步", "学业提升", "学业成功", "学业顺利"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

    getRandomRichBuff() {
        const buffs = ["股票大涨", "收入翻倍", "高薪工作", "offer", "财富自由", "小目标","涨薪", "升职", "暴富","财富", "人民币", "资产", "收入", "财产", "房子", "豪车", "存款", "钞票", "美元", "英镑", "欧元", "日元", "港币", "台币"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

    getRandomHealthBuff() {
        const buffs = ["健康", "体力", "精力", "活力", "耐力", "寿命", "浑身舒畅", "指标正常", "体检通过", "长寿", "长命百岁", "吃得香", "睡得好", "身体棒", "引体向上", "俯卧撑", "仰卧起坐", "长生不老", "清醒", "强壮", "精神", "精神焕发", "精力充沛", "精力旺盛", "精力十足", "精力充沛", "精力充沛", "精力充沛"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

    getRandomEmotionBuff() {
        const buffs = ["拒绝内耗", "躺平", "工作轻松", "offer",  "一夜暴富", "平步青云", "颜值爆表", "神操作", "带飞","愉快", "好心情", "快乐", "幸福", "爱情", "情人", "顺利", "放松", "轻松", "美好", "平和", "平静", "一切顺利", "心情愉快", "心情舒畅", "心情美好", "心情美丽"];
        return buffs[Math.floor(Math.random() * buffs.length)];
    }

}
