export default function associate(pioneers, chores) {
    return chores.map((chore, index) => {
        const pioneer = pioneers[index % pioneers.length];
        return {pioneer: pioneer, chore: chore}
    })
}