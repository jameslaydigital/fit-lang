import { writeFile, readFile } from "fs/promises";

export const nodeAdapter = {
    async read(key) {
        return await readFile("./" + key, "utf8");
    },
    async write(key, data) {
        await writeFile("./" + key, data, "utf8");
    },
};
