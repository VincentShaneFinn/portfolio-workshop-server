import { GetNextPlayerName } from "../getNextPlayerName";

describe("getNextPlayerName", () => {
    type NewType = GetNextPlayerName;

    let getNextPlayerName: NewType;

    beforeEach(() => {
        getNextPlayerName = new GetNextPlayerName();
    })

    test("first call returns Player 1", () => {
        let playerName = getNextPlayerName.call();

        expect(playerName).toBe("Player 1");
    })

    test("second call returns Player 2", () => {
        getNextPlayerName.call();
        let playerName = getNextPlayerName.call();

        expect(playerName).toBe("Player 2");
    })
})
