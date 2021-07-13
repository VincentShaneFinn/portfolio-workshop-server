import { addOne } from "../workshop";

describe("addOne", () => {
    it("given a number, should add one", () => {
        let val = 1;

        let actual = addOne(val);

        expect(actual).toBe(2);
    })

    it("given a string, should add the string one", () => {
        let val = "string ";

        let actual = addOne(val);

        expect(actual).toBe("string one");
    })
})
