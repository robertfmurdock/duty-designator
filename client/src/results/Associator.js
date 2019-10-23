export default function associate(pioneers, chores) {
    return pioneers.map((pioneer, index) => {
        const chore = chores[index];
        return {pioneer, chore}
    })
}