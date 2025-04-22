import { _decorator, CCBoolean, CCInteger, Component, Node, UITransform } from 'cc';
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
    private startIssueInsenseButtonNode : Node = null;

    private timeQuota: number = 60;

    private timeEplapsed: number = 0;

    private userInfoModel: UserInfo = null;

    private insense : Insense[] = [];


    start() {
       
    }

    // 单支香
    initStateSingle(insense: Insense) {
            this.setBurningTime(insense.getBurningTime());
            this.node.setScale(this.node.scale.y, 1, this.node.scale.z);
            this.timeEplapsed = 0;

            this.insense = []
            this.node.removeAllChildren();

            resources.load(insense.getInsenseName() + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error('Failed to load sprite frame:', err);
                    // Provide a fallback or notify the user
                    return;
                }

                const spriteNode = new Node('BurningInsenseSprite');
                const sprite = spriteNode.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;

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

                spriteNode.setPosition(0-spriteSize.x/2, burnerSize.y/2 - 20, 0); // Set to the center

                console.log("spriteNode position", spriteNode.position);

                spriteNode.getComponent(UITransform).setAnchorPoint(0, 0); 
                this.node.addChild(spriteNode);
            });
        
    }


    // 多支香
    initStateMulti(insenses: Insense[]) {
        this.insense = insenses;
        this.setBurningTime(insenses[0].getBurningTime());
        this.node.setScale(this.node.scale.y, 1, this.node.scale.z);
        this.timeEplapsed = 0;
        this.node.removeAllChildren();

        for (let i = 0; i < insenses.length; i++) {
            resources.load(insenses[i].getInsenseName() + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error('Failed to load sprite frame:', err);
                    // Provide a fallback or notify the user
                    return;
                }

                const spriteNode = new Node('BurningInsenseSprite');
                const sprite = spriteNode.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;

                // 获取父节点的尺寸
                const parentTransform = this.node.getComponent(UITransform);
                const parentSize = parentTransform.contentSize;
                console.log("parentSize", parentSize);

                // 获取香炉的尺寸，也就是当前节点的尺寸
                const burnerTransform = this.node.getComponent(UITransform);
                const burnerSize = burnerTransform.contentSize;
                console.log("burnerSize", burnerSize);

                // 获取 spriteNode 香的尺寸
                const spriteTransform = spriteNode.getComponent(UITransform);
                const spriteSize = spriteTransform.contentSize;

                spriteNode.setPosition(0-spriteSize.x/2, burnerSize.y/2 - 20, 0); // Set to the center

                console.log("spriteNode position", spriteNode.position);

                this.node.addChild(spriteNode);
            });
        }
        // this.node.setScale(this.node.scale.x, 1, this.node.scale.z);
        // this.node.setPosition(this.node.position.x, this.node.position.y + 100, this.node.position.z);   

    }

    // todo 添加香在燃烧时，定期增加用户的功德值. ui 应该要和业务逻辑分离吗？
    update(deltaTime: number) {
        if (!this._burning) {
            return;
        }
        
        const insenseNode = this.node.getChildByName("BurningInsenseSprite");

        this.timeEplapsed += deltaTime;
        if (this.timeEplapsed <= this.timeQuota) {
            const progress = this.timeEplapsed / this.timeQuota;
            insenseNode.setScale(insenseNode.scale.x, 1 - progress, insenseNode.scale.z);
            // this.node.setScale(this.node.scale.x, 1 - progress, this.node.scale.z);
        } else {
            insenseNode.setScale(insenseNode.scale.x, 0, insenseNode.scale.z);
            // this.node.setScale(this.node.scale.x, 0, this.node.scale.z);    
        }

        // this.node.setPosition(this.node.position.x + deltaTime * 50, this.node.position.y);
        // const scaleY = this.node.scale.y - deltaTime * 0.1;
        // const newY = this.node.scale.y - (deltaTime * 0.5); // Adjust position to keep the bottom anchored
        // this.node.setScale(this.node.scale.x, Math.max(newY, 0), this.node.scale.z);
        // this.node.setPosition(this.node.position.x, newY, this.node.position.z);

        if (insenseNode.scale.y <= 0) {
            this.stopBurn();
            this.insense = [];
            this.node.removeAllChildren();
            this.startIssueInsenseButtonNode.getComponent("startIssuseInsenseController").show()
        }
    }

    startBurn() {
        // this.initStateSingle(new Insense("incense-001", 10, "intelligence", 15, 0));
        this._burning = true;
        console.log("start burning");
    }

    stopBurn() {
        this._burning = false;
        console.log("stop burning");
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

    getInsenseModel(): Insense[] {
        return this.insense;
    }
}

