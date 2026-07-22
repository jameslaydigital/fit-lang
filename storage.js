import { writeFile, readFile } from "fs/promises";

export async function save() {
    await writeFile("./data.json", JSON.stringify(data, null, 4), "utf8");
    await writeFile("./stack.json", JSON.stringify(stack, null, 4), "utf8");
}

export async function load() {
    const dataJson = await readFile("./data.json", "utf8");
    const stackJson = await readFile("./stack.json", "utf8");
    Object.assign(data, JSON.parse(dataJson));
    Object.assign(stack, JSON.parse(stackJson));
}

export const data = {};
export const stack = [];
