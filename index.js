import { glob } from "fs/promises";
import { save, load, setAdapter } from "./storage.js";
import { cmds } from "./cmds.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { nodeAdapter } from "./adapters/node.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

setAdapter(nodeAdapter);

for await (const fname of glob(__dirname + "/modules/*/main.js")) {
    await import(fname);
}
await load(); // load persisted data
await cmds.dispatch(process.argv.slice(2));
