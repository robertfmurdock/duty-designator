import associate from "./Associator";

describe('associator', () => {
    it('when given two empty arrays gives empty array', () => {
        const associatedArray = associate([], [])
        expect(associatedArray).toEqual([])
    })

    it('when given one pioneer and one chore gives one pair in an array', () => {
        const associatedArray = associate(["1"], ["a"])
        expect(associatedArray).toEqual([{pioneer: "1", chore: "a"}])
    })

    it('when given two pioneers and two chores gives two pairs in an array', () => {
        const pioneers = ["Natalie", "Riley"];
        const chores = ["sweepin", "raslin"];

        const associatedArray = associate(pioneers, chores)

        const expectedPairs = [
            {pioneer: "Natalie", chore: "sweepin"},
            {pioneer: "Riley", chore: "raslin"}
        ];
        expect(associatedArray).toEqual(expectedPairs)
    })

    it('when given two pioneers and three chores gives one pioneer assigned to two tasks', () => {
        const pioneers = ["Natalie", "Riley"];
        const chores = ["sweepin", "raslin", "sleepin"];

        const associatedArray = associate(pioneers, chores)

        const expectedPairs = [
            {pioneer: "Natalie", chore: "sweepin"},
            {pioneer: "Riley", chore: "raslin"},
            {pioneer: "Natalie", chore: "sleepin"}
        ];
        expect(associatedArray).toEqual(expectedPairs)
    })

    it('when given three pioneers and one chore gives one pair', () => {
        const pioneers = ["Joe Joe Shabadoo", "Natalie", "Riley"];
        const chores = ["dazzlin"];

        const associatedArray = associate(pioneers, chores)

        const expectedPairs = [
            {pioneer: "Joe Joe Shabadoo", chore: "dazzlin"}
        ];
        expect(associatedArray).toEqual(expectedPairs)
    })
})