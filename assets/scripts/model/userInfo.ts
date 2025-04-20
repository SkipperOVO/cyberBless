export class UserInfo {
    intelligence: number;
    rich: number;
    health: number;
    emotion: number;
    totalScore: number;

    owenedInsense: string[];
    owenedBurner: string[];
    owenedBackground: string[];

    constructor(intelligence: number, rich: number, health: number, emotion: number, totalScore: number) {
        this.intelligence = intelligence;
        this.rich = rich;
        this.health = health;
        this.emotion = emotion;
        this.totalScore = totalScore
    }

    private calculateTotalScore(): number {
        return this.intelligence + this.rich + this.health + this.emotion;
    }

    getIntelligence(): number {
        return this.intelligence;
    }

    setIntelligence(value: number): void {
        this.intelligence = value;
        this.totalScore = this.calculateTotalScore();
    }

    getRich(): number {
        return this.rich;
    }

    setRich(value: number): void {
        this.rich = value;
        this.totalScore = this.calculateTotalScore();
    }

    getHealth(): number {
        return this.health;
    }

    setHealth(value: number): void {
        this.health = value;
        this.totalScore = this.calculateTotalScore();
    }

    getEmotion(): number {
        return this.emotion;
    }

    setEmotion(value: number): void {
        this.emotion = value;
        this.totalScore = this.calculateTotalScore();
    }

    getTotalScore(): number {
        return this.totalScore;
    }
}