import { glob } from "fs/promises";
import { save, load, setAdapter } from "./storage.js";
import { cmds } from "./cmds.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { nodeAdapter } from "./adapters/node.js";
import { setOutput } from "./io.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

setAdapter(nodeAdapter);
setOutput({
    print: console.log,
    error: console.error,
    exit: process.exit,
});

for await (const fname of glob(__dirname + "/modules/*/main.js")) {
    await import(fname);
}
await load();
await cmds.dispatch(process.argv.slice(2));
