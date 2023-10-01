import { uuid } from "./@shared/utils";
import { Account } from "./Account";
import { Asset } from "./Asset";

type LimitOrder = 'BUY_LIMIT' |'SELL_LIMIT';
type MarketOrder = 'BUY_MARKET' | 'SELL_MARKET';

type OrderType = {
    orderId: string;
    account: Account;
    asset: Asset;
    lotSize: number;
    orderType: LimitOrder | MarketOrder;
} & (OrderLimit | OrderMarket);

interface OrderLimit {
    orderId: string;
    account: Account;
    asset: Asset;
    lotSize: number;

    price: number | undefined;
}
interface OrderMarket {
    orderId: string;
    account: Account;
    asset: Asset;
    lotSize: number;
}

export class Order implements OrderLimit, OrderMarket {
    account: Account;
    asset: Asset;
    lotSize: number;
    orderId: string;
    orderType: LimitOrder | MarketOrder = 'BUY_LIMIT';
    price: number;

    constructor(account: Account, asset: Asset, lotSize: number, orderType: LimitOrder | MarketOrder, price: number) {
        this.account    = account;
        this.asset      = asset;
        this.lotSize    = lotSize;
        this.orderType  = orderType;
        this.orderId    = uuid();
        this.price      = price;
    }
}