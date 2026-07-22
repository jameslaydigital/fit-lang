import { glob } from "fs/promises";
import { save, load } from "./storage.js";
import { cmds } from "./cmds.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

for await (const fname of glob(__dirname + "/modules/*/main.js")) {
    await import(fname);
}
await load(); // load persisted data
await cmds.dispatch(process.argv.slice(2));
