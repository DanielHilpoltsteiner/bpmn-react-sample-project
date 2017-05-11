export class Link {
    constructor(public readonly href: string, public readonly text?: string, public readonly rel?: string,) {
        this.text = text || href;
        this.rel = rel || "none";
    }
}