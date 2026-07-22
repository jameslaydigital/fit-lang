import { data, drafts } from "../../storage.js";
import { cmds } from "../../cmds.js";

data.plans = data.plans ?? [];
drafts.plan = drafts.plans ?? [];

class Plan {
    constructor(name) {
        if (typeof name !== "string") {
            throw new Error("plan name must be a string");
        }
        if (name === "") {
            throw new Error("plan name is empty");
        }
        this.name = name;
    }
}

// plan CRUD
cmds.register("plan", async function() {
    console.log("plan - workout plans");
    console.log("--------------------");
    console.log("options:");
    console.log("\tplan list");
    console.log("\tplan rename");
    console.log("\tplan draft list");
    console.log("\tplan draft create");
    console.log("\tplan draft pop");
    console.log("\tplan draft commit");
});

cmds.register("plan list", async function() {
    console.log(data.plans);
});
cmds.register("plan draft list", async function(name) {
    console.log(drafts.plans);
});

cmds.register("plan draft create", async function([name]) {
    drafts.plans.push(new Plan(name));
    save();
    console.log(drafts.plans);
});
cmds.register("plan draft pop", async function() {
    console.log(drafts.plans.pop());
    save();
});
cmds.register("plan draft commit", async function() {
    const draft = drafts.plans.pop();
    data.plans.push(draft);
    await save();
    console.log("plan '%s' committed to database", draft.name);
});
cmds.register("plan rename", async function([oldname, newname]) {
    if (!oldname || !newname) {
        console.log("fit plan rename: missing a name");
        console.log("usage:");
        console.log("\tfit plan rename <oldname> <newname>");
        return;
    }

    const plan = data.plans.find(p => p.name === oldname);
    if (!plan) {
        console.log("no plan found by name '%s'", oldname);
        return;
    }
    plan.name = newname;
    await save();
    console.log("plan '%s' renamed to '%s'", oldname, newname);
});
