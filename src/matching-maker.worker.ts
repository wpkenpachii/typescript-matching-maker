import { parentPort } from "worker_threads";
import { WorkerEvent } from "./main";
import { Account } from "./domain/Account";
import { Asset } from "./domain/Asset";
import { Order } from "./domain/Order";

/*
TODO: Remove this code when unecessary. This is just to generate random orders to test part of the complete flow.
*/

const shuffle = ([...arr]) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const random_between = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)

// Create a Coin
const MyAsset = new Asset('WPCOIN')

// Create an Account
const MyAccount = new Account();
MyAccount.updateAssetQty(MyAsset, 100); // Adding some shares in my wallet


setTimeout(async () => {
    const bearishOrders = Array.from(Array(100).keys()).map((m): Order => {
        return new Order(MyAccount, MyAsset, random_between(10, 1000), 'SELL_LIMIT', random_between(50, 100));
    })

    const bullishORders = Array.from(Array(100).keys()).map((m): Order => {
        return new Order(MyAccount, MyAsset, random_between(10, 1000), 'BUY_LIMIT', random_between(50, 100));
    })

    const orders = shuffle([...bearishOrders, ...bullishORders]);

    for (const order of orders) {
        const event: WorkerEvent = {
            event: "place_order",
            data: order
        }
        parentPort?.postMessage(event)
        await delay(1000)
    }
    console.log('Waiting 5 seconds')
}, 3000)
