import { writeFile, readFile } from "fs/promises";

export async function save() {
    await writeFile("./data.json", JSON.stringify(data, null, 4), "utf8");
    await writeFile("./drafts.json", JSON.stringify(drafts, null, 4), "utf8");
}

export async function load() {
    const dataJson = await readFile("./data.json", "utf8");
    const draftsJson = await readFile("./drafts.json", "utf8");
    Object.assign(data, JSON.parse(dataJson));
    Object.assign(drafts, JSON.parse(draftsJson));
}

export const data = {};
export const drafts = {};
