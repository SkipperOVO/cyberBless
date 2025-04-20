import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { InsenseRepository } from './repository/insenseRepo';
import { Insense } from './model/insense';
const { ccclass, property } = _decorator;

@ccclass('insenseStockController')
export class insenseStockController extends Component {

    @property({
        type: Prefab,
        tooltip: '香料预制体',
    })
    private insenseItemPrefab: Prefab = null;

    @property({
        type: Node,
    })
    private insenseBurningNode: Node = null;

    private insenseRepo : InsenseRepository = new InsenseRepository();

    start() {
        // this.node.removeAllChildren();
        // 从数据库拉取所有的 insense
        const insenses = this.getAllInsenseFromDB();
        for (let i = 0; i < insenses.length; i++) {
            const ins = instantiate(this.insenseItemPrefab);
            //todo ins.position = new Vec3(0, i * 500, 0);
            //todo 根据数据库中的 insense 设置 UI prefab 
            ins.getComponent("insenseItemController").setInsenseModel(insenses[i]);
            ins.getComponent("insenseItemController").setBurningInsenseNode(this.insenseBurningNode);
            this.node.addChild(ins);
        }
    }

    protected onLoad(): void {

    }


    update(deltaTime: number) {
        
    }

    getAllInsenseFromDB(): Insense[] {
        // 从数据库中拉取所有的 insense
        // todo
        return this.insenseRepo?.getAll();
    }
}

