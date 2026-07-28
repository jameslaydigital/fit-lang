import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { print } from "../../io.js";

cmds.register("stack list", async function() {
    print(stack);
});

cmds.register("stack pop", async function() {
    const result = stack.pop();
    print("popped ", result);
    await save();
});
