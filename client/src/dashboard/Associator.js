
export function associateWithOffset(pioneers, chores, offset) {
    if(pioneers.length !== 0 ){
        return chores.map((chore, index) => {
            const pioneer = pioneers[(index + offset) % pioneers.length];
            return {pioneer: pioneer, chore: chore}
        })
    }
    return [];
}

export default function associate(pioneers, chores) {
    return associateWithOffset(pioneers, chores, 0);
}
