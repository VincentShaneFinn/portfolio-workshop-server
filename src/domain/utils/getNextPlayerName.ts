export class GetNextPlayerName {
    index: number = 1;

    call(): string {
        return `Player ${this.index++}`;
    }

}