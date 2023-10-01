import { uuid } from "./@shared/utils";
import { Asset } from "./Asset";

export class Account {
    id: string;
    wallet: Map<string, number> = new Map<string, number>();
    constructor() {
        this.id = uuid();
    }

    updateAssetQty(asset: Asset, amount: number) {
        if (this.wallet.has(asset.id)) {
            const current_amount = this.wallet.get(asset.id) as number;
            this.wallet.set(asset.id, current_amount + amount);
        } else {
            this.wallet.set(asset.id, amount);
        }
    }
}