
module net.protovos {

	export function build(name: string, data: any = null): any {
	}


    export const TableVO_NAME: string = "TableVO";

    export const RetainInfoVO_NAME: string = "RetainInfoVO";

    export const PlayerVO_NAME: string = "PlayerVO";

    export const CardVO_NAME: string = "CardVO";

    export const GameBigWinRecordVO_NAME: string = "GameBigWinRecordVO";

    export const BigWordBoardRecordVO_NAME: string = "BigWordBoardRecordVO";

    export const BigWordBoardBigWinRecordVO_NAME: string = "BigWordBoardBigWinRecordVO";

    export const CardRecordVO_NAME: string = "CardRecordVO";

    export const BiBeiRecordVO_NAME: string = "BiBeiRecordVO";

    export const RoomVO_NAME: string = "RoomVO";

    export const UserVO_NAME: string = "UserVO";



    export function carteTableVO(): TableVO {
        //return Message.lokkup(TableVO_NAME);
        return <any>null;
    }

    export function carteRetainInfoVO(): RetainInfoVO {
        //return Message.lokkup(RetainInfoVO_NAME);
        return <any>null;
    }

    export function cartePlayerVO(): PlayerVO {
        //return Message.lokkup(PlayerVO_NAME);
        return <any>null;
    }

    export function carteCardVO(): CardVO {
        //return Message.lokkup(CardVO_NAME);
        return <any>null;
    }

    export function carteGameBigWinRecordVO(): GameBigWinRecordVO {
        //return Message.lokkup(GameBigWinRecordVO_NAME);
        return <any>null;
    }

    export function carteBigWordBoardRecordVO(): BigWordBoardRecordVO {
        //return Message.lokkup(BigWordBoardRecordVO_NAME);
        return <any>null;
    }

    export function carteBigWordBoardBigWinRecordVO(): BigWordBoardBigWinRecordVO {
        //return Message.lokkup(BigWordBoardBigWinRecordVO_NAME);
        return <any>null;
    }

    export function carteCardRecordVO(): CardRecordVO {
        //return Message.lokkup(CardRecordVO_NAME);
        return <any>null;
    }

    export function carteBiBeiRecordVO(): BiBeiRecordVO {
        //return Message.lokkup(BiBeiRecordVO_NAME);
        return <any>null;
    }

    export function carteRoomVO(): RoomVO {
        //return Message.lokkup(RoomVO_NAME);
        return <any>null;
    }

    export function carteUserVO(): UserVO {
        //return Message.lokkup(UserVO_NAME);
        return <any>null;
    }



    export interface TableVO {
        
        /** 桌子的ID */
        tableId: number;

        /** 桌子状态   */
        tableStatus: number;

        /**  玩家信息 */
        playerVO: PlayerVO;

        /**  留桌信息 */
        retainInfoVO: RetainInfoVO;

    }

    export interface RetainInfoVO {
        
        /** 账号 */
        userId: string;

        /** 名字 */
        userName: string;

        /** 结束时间 */
        endTime: number;

        /**  是否掉线 */
        isOutline: number;

        /**  游戏id */
        gameId: number;

        /**  房间类型 */
        roomType: number;

        /**   桌子Id */
        tableId: number;

    }

    export interface PlayerVO {
        
        /**  账号 */
        userId: string;

        /**  名字 */
        userName: string;

        /**  头像id */
        headerUri: string;

        /**  带入 */
        credit: number;

        /** free 1坐下 2 举手 3开始游戏 */
        gameStatus: number;

        /**  是否掉线 */
        isOutline: number;

        /**  当前房间类型 */
        currRoomType: number;

    }

    export interface CardVO {
        
        /**  类型 */
        type: number;

        /**  值 */
        num: number;

        /**  保留标志 0: 无保留标志,1:有保留标志 */
        held: number;

    }

    export interface GameBigWinRecordVO {
        
        /**  账号 */
        userId: string;

        /**  名字 */
        userName: string;

        /**  头像id */
        headerUri: string;

        /**  游戏id */
        gameId: number;

        /**  房间类型 */
        roomType: number;

        /**  桌子Id */
        tableId: number;

        /**  胜利牌型 */
        winStyle: number;

        /**  胜利获得金币  */
        winPoints: number;

    }

    export interface BigWordBoardRecordVO {
        
        /**  卡牌记录 */
        cardRecordVO: CardRecordVO;

        /**  大胜记录 */
        bigWinRecordVO: BigWordBoardBigWinRecordVO;

    }

    export interface BigWordBoardBigWinRecordVO {
        
        /**  五梅个数 */
        fiveKindsNum: number;

        /**  同花大顺个数 */
        bigTierceNum: number;

        /**  同花顺个数 */
        tierceNum: number;

        /**  四梅个数 */
        fourKindsNum: number;

    }

    export interface CardRecordVO {
        
        /**  第一排 */
        fCardVOs: CardVO;

        /**  第二排 */
        sCardVOs: CardVO;

        /**  带入 */
        crdit: number;

        /**  押注 */
        bet: number;

        /**   赢 */
        wins: number;

        /**  比倍记录  */
        biBeiRecordVOs: BiBeiRecordVO;

    }

    export interface BiBeiRecordVO {
        
        /**  1:半比，2：比倍，3：双比 */
        type: number;

        /**  押注倍率 */
        bet: number;

        /**  1:大，2：小 */
        guess: number;

        /** 开牌大小 */
        openNum: number;

    }

    export interface RoomVO {
        
        /**  房间类型 */
        type: number;

        /**  押注 */
        bet: number;

        /**  需要金币(预留) */
        needPoints: number;

        /**  需要钻石 */
        needJade: number;

    }

    export interface UserVO {
        
        /**  */
        userId: string;

        /**  */
        userName: string;

        /** 财富 */
        points: number;

        /** vip等级 */
        vip: number;

        /** vip 经验值 */
        vipPoint: number;

        /**  等级 */
        level: number;

        /**  经验值 */
        levelPoint: number;

        /**  开始玩的时间 */
        startTime: number;

        /**  最大赢的钱 */
        maxWinPoint: number;

        /** 获利次数 */
        winTimes: number;

        /** 完成时间 */
        userDayActiveTime: number;

        /** 玉  */
        jabe: number;

        /** 活跃领取的倍率 */
        activeRate: number;

        /** 用户的对应我们的ID */
        id: number;

        /** faceBookID */
        facebookId: string;

        /** 新手类弄Id */
        newPlayerType: number;

        /** name */
        name: string;

        /** 编辑名字次数 */
        editNameNum: number;

    }


}
