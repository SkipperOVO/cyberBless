export class Insense {
    private insenseName: string = "";
    private burningTime: number = 10;
    private scoreType: string = "";
    private score: number = 0;
    private insenseId: number = 0;

    constructor(insenseName: string, burningTime: number, scoreType: string, score: number, insenseId: number) {
        this.insenseName = insenseName;
        this.burningTime = burningTime;
        this.scoreType = scoreType;
        this.score = score;
        this.insenseId = insenseId;
    }

    // Getter and Setter for insenseName
    public getInsenseName(): string {
        return this.insenseName;
    }

    public setInsenseName(name: string): void {
        this.insenseName = name;
    }

    // Getter and Setter for burningTime
    public getBurningTime(): number {
        return this.burningTime;
    }

    public setBurningTime(time: number): void {
        this.burningTime = time;
    }

    // Getter and Setter for scoreType
    public getScoreType(): string {
        return this.scoreType;
    }

    public setScoreType(type: string): void {
        this.scoreType = type;
    }

    // Getter and Setter for score
    public getScore(): number {
        return this.score;
    }

    public setScore(score: number): void {
        this.score = score;
    }

    public getInsenseId(): number {
        return this.insenseId;
    }

    public setInsenseId(id: number): void {
        this.insenseId = id;
    }
}