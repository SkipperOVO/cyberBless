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

    @property({
        type: CCBoolean,
        tooltip: '是否燃烧',
    })
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

    initState(insense: Insense) {
        for (let i = 0; i < this.insense.length; i++) {
            const ins = this.insense[i];
            this.setBurningTime(ins.getBurningTime());
            this.node.setScale(this.node.scale.y, 1, this.node.scale.z);
            this.timeEplapsed = 0;

            resources.load(insense.getInsenseName() + '/spriteFrame', SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error('Failed to load sprite frame:', err);
                    // Provide a fallback or notify the user
                    return;
                }

                const spriteNode = new Node('BurningInsenseSprite');
                const sprite = spriteNode.addComponent(Sprite);
                sprite.spriteFrame = spriteFrame;

                spriteNode.setPosition(20*(i+1), 0, 0); // Set to the center
                spriteNode.getComponent(UITransform).setAnchorPoint(0, 0); // Set size to 100x100
                this.node.addChild(spriteNode);
            });
        }
        
    }

    // todo 添加香在燃烧时，定期增加用户的功德值. ui 应该要和业务逻辑分离吗？
    update(deltaTime: number) {
        if (!this._burning) {
            return;
        }

        this.timeEplapsed += deltaTime;
        if (this.timeEplapsed <= this.timeQuota) {
            const progress = this.timeEplapsed / this.timeQuota;
            this.node.setScale(this.node.scale.x, 1 - progress, this.node.scale.z);
        } else {
            this.node.setScale(this.node.scale.x, 0, this.node.scale.z);    
        }

        // this.node.setPosition(this.node.position.x + deltaTime * 50, this.node.position.y);
        // const scaleY = this.node.scale.y - deltaTime * 0.1;
        // const newY = this.node.scale.y - (deltaTime * 0.5); // Adjust position to keep the bottom anchored
        // this.node.setScale(this.node.scale.x, Math.max(newY, 0), this.node.scale.z);
        // this.node.setPosition(this.node.position.x, newY, this.node.position.z);

        if (this.node.scale.y <= 0) {
            this.stopBurn();
            this.startIssueInsenseButtonNode.getComponent("startIssuseInsenseController").show()
        }
    }

    startBurn() {
        this.initState(new Insense("incense-001", 60, "intelligence", 15, 0));
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
        if (this.insense.length >= 3) {
            return 
        }

        let found = false
        for (let i = 0; i < this.insense.length; i++) {
            if (this.insense[i].getInsenseId() === insense.getInsenseId()) {
                this.insense[i] = insense;
                found = true;
            }
        }
        if (!found) {
            this.insense.push(insense);
        }
        this.initState(insense);
    }

    getInsenseModel(): Insense[] {
        return this.insense;
    }
}

