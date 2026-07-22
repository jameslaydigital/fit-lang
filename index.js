import { glob } from "fs/promises";
import { save, load } from "./storage.js";
import { cmds } from "./cmds.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// okay, we're gonna take a different, simpler approach to making this language grammar.
// We're going to have a registration thing, where commands are basically normalized and attempted against a hashmap.
// It's a CISC ISA with a stack AND registers. Some stacks are specialized for specific object types.
// Lfg!

for await (const fname of glob(__dirname + "/modules/*/main.js")) {
    await import(fname);
}
await load(); // load persisted data
await cmds.dispatch(process.argv.slice(2));
