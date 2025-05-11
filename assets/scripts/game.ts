import { _decorator, CCInteger, Component, Node } from 'cc';
import { UserInfo } from './model/userInfo';
import "miniprogram-api-typings";

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
    // if (wx) {
    //   wx.showShareMenu({
    //     menus: ['shareAppMessage', 'shareTimeline'],
    //   });

    //   wx.getSetting({
    //     success(res) {
    //       if (res.authSetting['scope.userInfo'] === true) {
    //         wx.getUserInfo({
    //           success: (res) => {
    //             // 已经授权，直接获取用户信息
    //             console.log("用户信息", res)
    //           },
    //         });
    //       } else {
    //         const button = wx.createUserInfoButton({
    //           type: "image",
    //           style: {
    //             left: 100,
    //             top: 100,
    //             width: 100,
    //             height: 100,
    //             backgroundColor: "rgba(255, 255, 255, 0.5)",
    //           },
    //         });
    //         button.onTap((res) => {
    //           if (res.errMsg.indexOf(':ok') > -1 && !!res.rawData) {
    //             // 获取用户信息
    //             console.log("用户信息", res)
    //           }
    //         });
    //       }
    //     },
    //   });


    // }


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
    return new UserInfo(0, 0, 0, 0, 0);
  }

}

