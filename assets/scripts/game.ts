import { _decorator, CCInteger, Component, Node } from 'cc';
import { UserInfo } from './model/userInfo';
const { ccclass, property } = _decorator;

@ccclass('game')
export class game extends Component {

    @property({ 
        type: Node,
        tooltip: '燃烧控制器',
     })
     private insenseUINode: Node = null;


     @property({
        type: Node,
        tooltip: '用户功德统计信息 Node',
    })
    private staticGroupNode: Node = null;

    private userInfoModel: UserInfo = null; // 香的模型名称

    start() {
        console.log("game start");
        this.userInfoModel = this.getInitializedUserInfoModel();
        this.staticGroupNode.getComponent("staticsController").setUserInfoModel(this.userInfoModel);
        this.insenseUINode.getComponent("burningController").setUserInfoModel(this.userInfoModel);
    }

    protected onLoad(): void {
    }


    update(deltaTime: number) {
        
    }

    onStartBurn() {
        this.insenseUINode.getComponent("burningController").startBurn();  
    }

    getInitializedUserInfoModel(): UserInfo {
        return new UserInfo(10, 0, 0, 0, 10);
    }
}

