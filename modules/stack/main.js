import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";

cmds.register("stack list", async function() {
    console.log(stack);
});

cmds.register("stack pop", async function() {
    const result = stack.pop();
    console.log("popped ", result);
    await save();
});
