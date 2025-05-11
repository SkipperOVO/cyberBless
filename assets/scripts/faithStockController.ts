import { _decorator, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { FaithRepo } from './repository/faithRepo';
import { Faith } from './model/faith';

const { ccclass, property } = _decorator;

@ccclass('faithStockController')
export class faithStockController extends Component {

    @property({
        type: Prefab,
        tooltip: 'faith item prefab',
    })
    private faithItemPrefab: Prefab = null;

    @property({
        type: Node,
        tooltip: 'character node',
    })
    private characterNode: Node = null;

    private faithRepo : FaithRepo = new FaithRepo();

    start() {
        // 从数据库拉取所有的 faith
        const faithes = this.getAllFaithFromDB();
        for (let i = faithes.length-1; i >= 0; i--) {
            const faith = instantiate(this.faithItemPrefab);
            //todo ins.position = new Vec3(0, i * 500, 0);
            //todo 根据数据库中的 faith 设置 UI prefab 
            faith.getComponent("faithItemController").setFaithModel(faithes[i]);
            this.node.insertChild(faith, 0);
        }
    }

    protected onLoad(): void {

    }


    update(deltaTime: number) {
        
    }

    getAllFaithFromDB(): Faith[] {
        // 从数据库中拉取所有的 insense
        // todo
        return this.faithRepo?.getAll();
    }

    setCharacterModel(character: Faith) {
        this.characterNode.getComponent("characterController").setCharacterModel(character);
        console.log("faithStockController setCharacterModel, character", character);
    }
}

