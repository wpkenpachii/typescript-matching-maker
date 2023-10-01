import { Heap } from "heap-js";
import { Order } from "./Order";

export class OrderBookService {
    bearish_book: Heap<Order>;
    bullish_book: Heap<Order>;

    constructor() {
        this.bearish_book = new Heap<Order>(function(orderA: Order, orderB: Order) {
            return (orderA.price as number) - (orderB.price as number);
        });

        this.bullish_book = new Heap<Order>(function(orderA: Order, orderB: Order) {
            return (orderA.price as number) - (orderB.price as number);
        });

        this.bearish_book.init([]);
        this.bullish_book.init([]);
    }

    placeLimitOrder(order: Order, side: 'BUY' | 'SELL') {
        if(side == 'BUY') {
            this.bullish_book.push(order)
        } else if (side == 'SELL') {
            this.bearish_book.push(order);
        }
    }

    placeMarketOrder(order: Order, side: 'BUY' | 'SELL') {
        const asks = this.getAsk()
        const bids = this.getBid()
        if (!asks.length || !bids.length) return
        if(side == 'BUY') {
            order.price = asks[0];
            this.bullish_book.push(order);
        } else if (side == 'SELL') {
            order.price = bids[0];
            this.bearish_book.push(order);
        }
    }

    updateOrder(order: Order, side: 'BUY' | 'SELL') {
        if(side == 'BUY') {
            for (const _order of this.bullish_book.iterator()) {
                if (order.orderId === _order.orderId) {
                    this.bullish_book.remove(_order);
                    this.bullish_book.push(order)
                }
            }
        } else if (side == 'SELL') {
            for (const _order of this.bearish_book.iterator()) {
                if (order.orderId === _order.orderId) {
                    this.bearish_book.remove(_order)
                    this.bullish_book.push(order)
                }
            }
        }
    }

    cancelOrder(order: Order) {
        if (order.orderType == "BUY_LIMIT" || order.orderType == 'BUY_MARKET') {
            for (const _order of this.bullish_book.iterator()) {
                if (order.orderId === _order.orderId) {
                    this.bullish_book.remove(_order);
                }
            }
        } else if (order.orderType == "SELL_LIMIT" || order.orderType == 'SELL_MARKET') {
            for (const _order of this.bearish_book.iterator()) {
                if (order.orderId === _order.orderId) {
                    this.bearish_book.remove(_order)
                }
            }
        }
    }

    removeOrder(order: Order) {
        if (order.orderType == "BUY_LIMIT" || order.orderType == 'BUY_MARKET') {
            for (const _order of this.bullish_book.iterator()) {
                if (order.orderId === _order.orderId) {
                    this.bullish_book.remove(_order);
                }
            }
        } else if (order.orderType == "SELL_LIMIT" || order.orderType == 'SELL_MARKET') {
            for (const _order of this.bearish_book.iterator()) {
                if (order.orderId === _order.orderId) {
                    this.bearish_book.remove(_order)
                }
            }
        }
    }

    getOrderBook(depth: number = 100): { asks: Order[], bids: Order[] } {
        return {
            asks: this.bearish_book.bottom(depth),
            bids: this.bullish_book.top(depth)
        }
    }

    getAsk() {
        return this.bearish_book.bottom(1).map((order: Order) => order.price as number) || []
    }

    getBid() {
        return this.bullish_book.top(1).map((order: Order) => order.price as number) || []
    }
}
