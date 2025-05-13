import { _decorator, CCBoolean, CCInteger, Component, Node, random, UITransform, Color, Mask, Size} from 'cc';
import { UserInfo } from './model/userInfo';
import { Insense } from './model/insense';
import { Sprite, SpriteFrame, resources } from 'cc';

const { ccclass, property } = _decorator;


/*
负责控制香燃烧时间，更新香燃烧的 UI
*/

@ccclass('burningController')
export class burningController extends Component {

    private _burning: boolean = false;

    @property({
        type: Node
    })
    private startIssueInsenseButtonNode: Node = null;

    private timeQuota: number = 60;

    private timeEplapsed: number = 0;

    private userInfoModel: UserInfo = null;

    private insense: Insense = null;


    start() {

    }

    // 单支香
    initStateSingle(insense: Insense) {
        this.setBurningTime(insense.getBurningTime());
        this.node.setScale(this.node.scale.y, 1, this.node.scale.z);
        this.timeEplapsed = 0;

        this.insense = insense
        this.node.removeAllChildren();


        for (let i = 0; i < insense.getNumberOfInsence(); i++) {
            resources.load(insense.getInsenseName() + "-" + i + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error('Failed to load sprite frame:', err);
                    // Provide a fallback or notify the user
                    return;
                }

                const spriteNode = new Node('BurningInsenseSprite-' + i);
                const sprite = spriteNode.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;
                sprite.sizeMode = Sprite.SizeMode.CUSTOM;

                // 获取父节点的尺寸
                // const parentTransform = this.node.getComponent(UITransform);
                // const parentSize = parentTransform.contentSize;
                // console.log("parentSize", parentSize);

                // // 获取香炉的尺寸，也就是当前节点的尺寸
                const burnerTransform = this.node.getComponent(UITransform);
                const burnerSize = burnerTransform.contentSize;
                console.log("burnerSize", burnerSize);

                // const burnerTransform = this.burnerNode.getComponent(UITransform);
                // const burnerPosition = this.burnerNode.position;
                // console.log("burnerPosition", burnerPosition);
                // // 获取香炉的尺寸
                // const burnerSize = burnerTransform.contentSize;
                // console.log("burnerSize", burnerSize);

                // 获取 spriteNode 香的尺寸
                const spriteTransform = spriteNode.getComponent(UITransform);
                const spriteSize = spriteTransform.contentSize;
                console.log("spriteSize: ", spriteSize);

                // 构造 Mask 遮罩节点
                const maskNode = new Node('MaskNode');
                const uiTransfrom = maskNode.addComponent(UITransform);
                const mask = maskNode.addComponent(Mask);


                const totalSpan = insense.getNumberOfInsence() * spriteSize.x + 20 * (insense.getNumberOfInsence() - 1);
                maskNode.setPosition(0 - totalSpan / 2 + i * (spriteSize.x + 20), burnerSize.y / 2 - 120, 0); // Set to the center

                // spriteNode.setPosition(0 - spriteSize.x / 2, burnerSize.y / 2 - 20, 0); // Set to the center

                console.log("spriteNode position", spriteNode.position);

                spriteNode.getComponent(UITransform).setAnchorPoint(0, 0);


                mask.node.getComponent(UITransform).setContentSize(spriteSize.x, spriteSize.y);
                mask.node.getComponent(UITransform).setAnchorPoint(0, 0);
                this.node.addChild(maskNode);
                mask.node.addChild(spriteNode);
            });
        }

    }


    // 多支香
    // initStateMulti(insenses: Insense[]) {
    //     this.insense = insenses;
    //     this.setBurningTime(insenses[0].getBurningTime());
    //     this.node.setScale(this.node.scale.y, 1, this.node.scale.z);
    //     this.timeEplapsed = 0;
    //     this.node.removeAllChildren();

    //     for (let i = 0; i < insenses.length; i++) {
    //         resources.load(insenses[i].getInsenseName() + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
    //             if (err) {
    //                 console.error('Failed to load sprite frame:', err);
    //                 // Provide a fallback or notify the user
    //                 return;
    //             }

    //             const spriteNode = new Node('BurningInsenseSprite');
    //             const sprite = spriteNode.addComponent(Sprite);
    //             sprite.spriteFrame = spriteFrame;

    //             // 获取父节点的尺寸
    //             const parentTransform = this.node.getComponent(UITransform);
    //             const parentSize = parentTransform.contentSize;
    //             console.log("parentSize", parentSize);

    //             // 获取香炉的尺寸，也就是当前节点的尺寸
    //             const burnerTransform = this.node.getComponent(UITransform);
    //             const burnerSize = burnerTransform.contentSize;
    //             console.log("burnerSize", burnerSize);

    //             // 获取 spriteNode 香的尺寸
    //             const spriteTransform = spriteNode.getComponent(UITransform);
    //             const spriteSize = spriteTransform.contentSize;

    //             spriteNode.setPosition(0 - spriteSize.x / 2, burnerSize.y / 2 - 20, 0); // Set to the center

    //             console.log("spriteNode position", spriteNode.position);

    //             this.node.addChild(spriteNode);
    //         });
    //     }
    //     // this.node.setScale(this.node.scale.x, 1, this.node.scale.z);
    //     // this.node.setPosition(this.node.position.x, this.node.position.y + 100, this.node.position.z);   

    // }

    // todo 添加香在燃烧时，定期增加用户的功德值. ui 应该要和业务逻辑分离吗？
    private _currentBurningIndex: number = -1;
    private _burnCyclesRemaining: number = 0;
    private _currentBurnRate: number = 1;

    // 香必须要在规定的时间内燃烧结束。
    
    update(deltaTime: number) {
        if (!this._burning) {
            return;
        }
        // if (this.timeEplapsed >= this.timeQuota) {
        //     this.stopBurn();
        //     return
        // }

        const insenseMasks = [];
        for (let i = 0; i < this.node.children.length; i++) {
            // 过滤掉同一层级的香的燃烧头部节点, 只处理 Mask 节点
            if (this.node.children[i].name.includes("RedRect")) {
                continue;
            }
            const mask = this.node.children[i];
            insenseMasks.push(mask);

            const idx = parseInt(mask.children[0].name.split('-').pop());
            // Add a red rectangle at the top of each insenseNode
            let redRectNode = this.node.getChildByName("RedRect-"+idx);
            if (!redRectNode) {
                const size = mask.getComponent(UITransform).contentSize;
                redRectNode = new Node("RedRect-"+idx);
                const redRectTransform = redRectNode.addComponent(UITransform);
                console.log("mask size", size);

                const redSprite = redRectNode.addComponent(Sprite);
                // redSprite.color = new Color(255, Math.random() * 100, Math.random() * 100); // Random red shades
                // 设置 sizeMode 为 CUSTOM
                redSprite.sizeMode = Sprite.SizeMode.CUSTOM;

                // Assign a default SpriteFrame to make the redRectNode visible
                const maskPosition = mask.getPosition();
                resources.load('BurningIncenseHead/spriteFrame', SpriteFrame, (err, spriteFrame) => {
                    if (!err) {
                        redSprite.spriteFrame = spriteFrame;
                        redSprite.sizeMode = Sprite.SizeMode.CUSTOM;

                        // 确保在设置 spriteFrame 后重新触发尺寸更新
                        redRectTransform.setContentSize(size.width, size.height / 16);
                        redRectTransform.setAnchorPoint(0, 0);
                        redRectNode.setPosition(maskPosition.x, size.height + maskPosition.y-15, maskPosition.z);
                        console.log("redRectNode position", redRectNode.position);  
                    } else {
                        console.error('Failed to load default sprite frame:', err);
                    }
                });
                // redRectNode.setPosition(maskPosition.x, size.height + maskPosition.y, maskPosition.z);
                
                redRectTransform.setContentSize(size.width, size.height / 16);
                this.node.addChild(redRectNode);
            }
            // Update the RedRect color to a random deep red color
            // const deepRedColor = new Color(255, Math.random()*100, Math.random()*100);
            // redRectNode.getComponent(Sprite).color = deepRedColor;
        }

        // if (this._burnCyclesRemaining <= 0) {
        //     // Randomly select a new insenseNode and burn rate
        //     this._currentBurningIndex = Math.floor(Math.random() * insenseNodes.length);
        //     this._currentBurnRate = (Math.random() + 0.5) * 0.8; // Random burn rate between 0.5 and 1.0
        //     this._burnCyclesRemaining = Math.floor(Math.random() * 50) + 1; // Random cycles between 1 and 5
        // }

        // this._currentBurnRate = 1
        // const insenseNode = insenseNodes[this._currentBurningIndex];
        // this.timeEplapsed += deltaTime * this._currentBurnRate; // Apply burn rate to elapsed time

        // if (this.timeEplapsed <= this.timeQuota) {
        //     const progress = this.timeEplapsed / this.timeQuota;
        //     insenseNode.setScale(insenseNode.scale.x, 1 - progress, insenseNode.scale.z);
        // } else {
        //     insenseNode.setScale(insenseNode.scale.x, 0, insenseNode.scale.z);
        // }

        // this._burnCyclesRemaining--;

        this.timeEplapsed += deltaTime; 

        // const redRectNode = insenseMasks[0].children[0].getChildByName("RedRect");
        // 检查所有香总体燃烧进度是否超过 75%，如果超过那么就不再添加随机燃烧速率波动
        let totalCurHeight = 0;
        for (let i = 0; i < insenseMasks.length; i++) {
            const node = insenseMasks[i];
            totalCurHeight += node.getComponent(UITransform).contentSize.height 
        }
        let totalProgress = totalCurHeight / (3 * insenseMasks[0].children[0].getComponent(UITransform).contentSize.height);
        // console.log("totalProgress", totalProgress);
        if (totalProgress > 0.75) {
            this._currentBurnRate = 1;
        } else {
            this._currentBurnRate = (Math.random() + 0.5) * 0.8; // Random burn rate between 0.5 and 1.0
        }

        //  for test
        // this._currentBurnRate = 1;

        // 根据当前已经燃烧过的时间和剩余的时间，计算所有香能够在燃烧时间内完成燃烧应该有的总体速率
        const remainingTime = this.timeQuota - this.timeEplapsed;
        
        // 计算剩余没有燃尽的香当前能够完成燃尽应该有的总体速率
        const totalBurnRate = (totalCurHeight / remainingTime) * deltaTime;
        // console.log("totalBurnRate", totalBurnRate);

        // 随机挑选一根香燃烧, 且香的 height 大于 0
        let insenseMask: Node = null;
        const tmpInsenseNodes = insenseMasks.filter(node => node.getComponent(UITransform).contentSize.height > 0);
        while (!insenseMask && tmpInsenseNodes.length > 0) {
            const rIdx = Math.floor(Math.random() * tmpInsenseNodes.length);
            const cand = tmpInsenseNodes[rIdx];
            if (cand.getComponent(UITransform).contentSize.height > 0) {
                insenseMask = cand;
            } else {
                tmpInsenseNodes.splice(rIdx, 1);
            }
        }

        if (insenseMask) {
            let maskNewHeight = insenseMask.getComponent(UITransform).contentSize.height - totalBurnRate ;
            // 只在第一次循环时，增加 mask 一个 burn head 的初始高度
            // if (remainingTime == this.timeQuota - deltaTime) {
            //     console.log("add redRect height");
            //     maskNewHeight +=  redRectNode.getComponent(UITransform).contentSize.height + 20
            // }
            const oldWidth = insenseMask.getComponent(UITransform).contentSize.width;
            if (this.timeEplapsed <= this.timeQuota || maskNewHeight > 0) {
                insenseMask.getComponent(UITransform).setContentSize(new Size(oldWidth, maskNewHeight));
            } else {
                insenseMask.getComponent(UITransform).setContentSize(new Size(oldWidth, 0));
            }
            const maskIndex = parseInt(insenseMask.children[0].name.split('-').pop());
            const red = this.node.getChildByName("RedRect-" + maskIndex);
            if (red) {
                // const redRectTransform = red.getComponent(UITransform);
                red.setPosition(red.position.x, insenseMask.getPosition().y + maskNewHeight-5, red.position.z);
            } else {
                console.log("redRectNode not found");
            }

        }
        
        if (totalProgress <= 0) {
            this.stopBurn();
            this.insense = null;
            this.node.removeAllChildren();
            this.startIssueInsenseButtonNode.getComponent("startIssuseInsenseController").show();
        }
    }

    startBurn() {
        // this.initStateSingle(new Insense("incense-001", 10, "intelligence", 15, 0));
        this._burning = true;
        console.log("start burning");
    }

    stopBurn() {
        console.log("timeEplased:", this.timeEplapsed)
        this._burning = false;
        // switch(this.insense.getScoreType()) {
        //     case 'Intelligence':
        //         this.userInfoModel.setIntelligence(this.userInfoModel.getIntelligence() + this.insense.getScore());
        //         break;
        //     case 'Emotion':
        //         this.userInfoModel.setEmotion(this.userInfoModel.getEmotion() + this.insense.getScore());
        //         break;
        //     case 'Health':
        //         this.userInfoModel.setHealth(this.userInfoModel.getHealth() + this.insense.getScore());
        //         break;
        //     case 'Rich':
        //         this.userInfoModel.setRich(this.userInfoModel.getRich() + this.insense.getScore());
        //         break;
        //     default:
        //         break;
        // }
        // this.userInfoModel.setTotalScore(this.userInfoModel.getTotalScore() + this.insense.getScore());
    }

    setBurningTime(time: number) {
        this.timeQuota = time;
    }


    setUserInfoModel(userInfo: UserInfo) {
        this.userInfoModel = userInfo;
    }

    getUserInfoModel(): UserInfo {
        return this.userInfoModel;
    }

    setInsenseModel(insense: Insense) {
        // if (this.insense.length >= 3) {
        //     return 
        // }

        // let found = false
        // for (let i = 0; i < this.insense.length; i++) {
        //     if (this.insense[i].getInsenseId() === insense.getInsenseId()) {
        //         this.insense[i] = insense;
        //         found = true;
        //     }
        // }
        // if (!found) {
        //     this.insense.push(insense);
        // }
        this.initStateSingle(insense);
    }

    getInsenseModel(): Insense {
        return this.insense;
    }

    isBurning(): boolean {
        return this._burning;
    }

    getBurnTime(): number {
        return this.timeQuota;
    }

}

