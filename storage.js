let adapter;

export function setAdapter(impl) {
    adapter = impl;
}

export async function save() {
    await adapter.write("data.json", JSON.stringify(data, null, 4));
    await adapter.write("stack.json", JSON.stringify(stack, null, 4));
}

export async function load() {
    try {
        const dataJson = await adapter.read("data.json");
        Object.assign(data, JSON.parse(dataJson));
    } catch {}
    try {
        const stackJson = await adapter.read("stack.json");
        Object.assign(stack, JSON.parse(stackJson));
    } catch {}
}

export const data = {};
export const stack = [];
