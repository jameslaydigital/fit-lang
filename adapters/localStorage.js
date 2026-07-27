const PREFIX = "fit-lang:";

export const localStorageAdapter = {
    read(key) {
        const val = localStorage.getItem(PREFIX + key);
        if (val === null) throw new Error(`Key not found: ${key}`);
        return val;
    },
    write(key, data) {
        localStorage.setItem(PREFIX + key, data);
    },
};
