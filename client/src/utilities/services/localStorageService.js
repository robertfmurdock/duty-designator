export const loadStuff = (key) => {
    try {
        const serializedState = localStorage.getItem(key);
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (err) {
        console.error('state parse error',err);
        return undefined;
    }
};

export const saveStuff = (stuff, key) => {
    try {
        const serializedState = JSON.stringify(stuff);
        localStorage.setItem(key, serializedState);
    } catch (err) {
        console.log(err)
    }
};