import { Order } from "./Order";

interface TradeType {
    price: number;
    activeOrder: Order;
    passiveOrder: Order;
    timestamp: number;
}
export class Trade implements TradeType {
    activeOrder: Order;
    passiveOrder: Order;
    price: number;
    timestamp: number;
    constructor(activeOrder: Order, passiveOrder: Order, price: number) {
        this.activeOrder = activeOrder;
        this.passiveOrder = passiveOrder;
        this.price = price;
        this.timestamp = new Date().getTime()
    }
}
