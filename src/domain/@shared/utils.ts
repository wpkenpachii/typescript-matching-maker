// TODO: change this way to get an uuid (by the official lib maybe)
export function uuid() {
    const random_between = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min)
    const hash = Array.from(Array(4).keys()).map(m => random_between(1111, 9999))
    return hash.join('-')
}