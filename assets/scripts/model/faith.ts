export class Faith {

    private name: string;

    private characterName: string;

    private id: number;


    constructor(id: number, name: string, characterName: string) {
        this.name = name;
        this.id = id;
        this.characterName = characterName;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getCharacterName(): string {
        return this.characterName;
    }

    setCharacterName(characterName: string): void {
        this.characterName = characterName;
    }

}