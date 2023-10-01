import { Worker } from "worker_threads";
import { Order } from "./domain/Order";
import { OrderBookService } from "./domain/OrderBookService"
import { Trade } from "./domain/Trade"

// Matching Maker Worker
const MatchingMaker = new Worker("./src/matching-maker.worker.ts");

export type WorkerEvent = {
    event: string;
    data: any;
}

// Create Order Instance
const MyOrderBook = new OrderBookService();
// const MyT_T = new TimesAndTrades();
const trades: Trade[] = [];

MatchingMaker.on("message", (payload: WorkerEvent) => {
    switch(payload.event) {
        case "place_order":
            // console.log('Order Book received a place order', payload)
            if (!payload.data) break;
            const order: Order = payload.data
            if(!order) return;
            // MARKET ORDER
            if (order?.orderType.match(/MARKET/)) {
                // BUY ORDERS
                if (order.orderType.match(/BUY/)) {
                    const side = 'BUY';
                    MyOrderBook.placeMarketOrder(order, side);
                    const asks = MyOrderBook.getOrderBook().asks
                    for (let index = 0; index < asks.length; index++) {
                        const _order = asks[index];
                        if (order.lotSize > _order.lotSize) {
                            order.lotSize -= _order.lotSize;
                            MyOrderBook.updateOrder(order, side)
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else if (order.lotSize == _order.lotSize) {
                            MyOrderBook.removeOrder(order);
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else {
                            _order.lotSize -= order.lotSize;
                            MyOrderBook.updateOrder(_order, side);
                            MyOrderBook.removeOrder(order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        }
                    }

                // SELL ORDERS
                } else if (order.orderType.match(/SELL/)) {
                    const side = 'SELL';
                    MyOrderBook.placeMarketOrder(order, side);
                    const bids = MyOrderBook.getOrderBook().bids
                    for (let index = 0; index < bids.length; index++) {
                        const _order = bids[index];
                        console.log(`[${side} ${order.orderId}] ${order.price}  <> ${_order.price} [${_order.orderId} ${_order.orderType}]`)
                        if (order.lotSize > _order.lotSize) {
                            order.lotSize -= _order.lotSize;
                            MyOrderBook.updateOrder(order, side)
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else if (order.lotSize == _order.lotSize) {
                            MyOrderBook.removeOrder(order);
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else {
                            _order.lotSize -= order.lotSize;
                            MyOrderBook.updateOrder(_order, side);
                            MyOrderBook.removeOrder(order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        }
                    }

                }

            // LIMIT ORDERS
            } else if (order?.orderType.match(/LIMIT/)) {

                // BUY ORDERS
                if (order.orderType.match(/BUY/)) {
                    const side = 'BUY';
                    MyOrderBook.placeLimitOrder(order, side);
                    const asks = MyOrderBook.getOrderBook().asks
                    for (let index = 0; index < asks.length; index++) {
                        const _order = asks[index];
                        console.log(`[${order.orderId} ${side}] ${order.price}  < ${order.lotSize} | ${order.lotSize} > ${_order.price} [${_order.orderType.replace(/(\_MARKET|\_LIMIT)/gi, '')} ${_order.orderId}]`)
                        if (order.price != _order.price) continue;
                        if (order.lotSize > _order.lotSize) {
                            // console.log(`[${order.orderId} ${side}] ${order.price}  < ${order.lotSize} | ${order.lotSize} > ${_order.price} [${_order.orderType.replace(/(\_MARKET|\_LIMIT)/gi, '')} ${_order.orderId}]`)
                            order.lotSize -= _order.lotSize;
                            MyOrderBook.updateOrder(order, side)
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else if (order.lotSize == _order.lotSize) {
                            MyOrderBook.removeOrder(order);
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else {
                            _order.lotSize -= order.lotSize;
                            MyOrderBook.updateOrder(_order, side);
                            MyOrderBook.removeOrder(order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        }
                    }

                // SELL ORDERS
                } else if (order.orderType.match(/SELL/)) {
                    const side = 'SELL';
                    MyOrderBook.placeLimitOrder(order, side);
                    const bids = MyOrderBook.getOrderBook().bids
                    for (let index = 0; index < bids.length; index++) {
                        const _order = bids[index];
                        if (order.price != _order.price) continue;
                        if (order.lotSize > _order.lotSize) {
                            order.lotSize -= _order.lotSize;
                            MyOrderBook.updateOrder(order, side)
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else if (order.lotSize == _order.lotSize) {
                            MyOrderBook.removeOrder(order);
                            MyOrderBook.removeOrder(_order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        } else {
                            _order.lotSize -= order.lotSize;
                            MyOrderBook.updateOrder(_order, side);
                            MyOrderBook.removeOrder(order);
                            const trade = new Trade(order, _order, order.price)
                            trades.push(trade);
                            
                        }
                    }
                }
            }
            break;
    }
})