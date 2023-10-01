import { uuid } from "./@shared/utils";

export class Asset {
    id: string;
    ticker: string;
    shares: number = 0;
    
    constructor(ticker: string) {
        this.id = uuid();
        this.ticker = ticker;
    }

    addShares(amount: number) {
        this.shares += amount;
    }

    removeShares(amount: number) {
        this.shares -= amount;
    }
}