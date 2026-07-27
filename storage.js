let adapter;

export function setAdapter(impl) {
    adapter = impl;
}

export async function save() {
    await adapter.write("data.json", JSON.stringify(data, null, 4));
    await adapter.write("stack.json", JSON.stringify(stack, null, 4));
}

export async function load() {
    const dataJson = await adapter.read("data.json");
    const stackJson = await adapter.read("stack.json");
    Object.assign(data, JSON.parse(dataJson));
    Object.assign(stack, JSON.parse(stackJson));
}

export const data = {};
export const stack = [];
