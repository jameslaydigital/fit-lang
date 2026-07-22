import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";

data.plans = data.plans ?? [];

// plan CRUD
cmds.register("plan", async function() {
    const routes = cmds.getRoutes("plan ");
    console.log("plan - workout plans");
    console.log("--------------------");
    console.log("options:");
    for (const route of routes) {
        console.log("\t%s", route);
    }
});

cmds.register("stack push plan", async function([id]) {
    if (typeof id !== "string") {
        console.error("cannot push plan without plan id");
        console.log("usage: stack push plan <id>");
        return;
    }

    const plan = data.plans.find(p => p.id === id);
    if (plan) {
        stack.push(plan);
        await save();
    }
});

cmds.register("plan unchoose", async function() {
    if (plan === null) {
        console.log("no selected plan, no action taken");
        console.log("usage: plan unchoose");
        return;
    }
    console.log("plan '%s' no longer chosen", plan.name);
    plan = null;
});

cmds.register("plan list", async function() {
    console.log("plans:");
    if (data.plans.length === 0) {
        console.log("\tNo plans. Add one with `plan create <name>`");
        return;
    }
    for (const plan of data.plans) {
        console.log("\t- %s", JSON.stringify(plan));
    }
});

cmds.register("plan create", async function([name]) {
    if (typeof name !== "string") {
        console.error("could not create new plan - no name specified");
        console.log("usage: plan create <plan_name>");
        return;
    }
    if (name === "") {
        console.error("plan name is empty");
        console.log("usage: plan create <plan_name>");
        return;
    }
    data.plans.push({
        type: "plan",
        id: Math.random(36).toString().split(".").pop(),
        name: name,
    });
    save();
    console.log("created new plan '%s'", name);
});

cmds.register("plan rename", async function([id, newname]) {
    const usage = "usage:\n\tfit plan rename <id> <newname>";
    if (!id) {
        console.log("fit plan rename: missing id");
        console.log(usage);
        return;
    }
    if (!newname) {
        console.log("fit plan rename: missing a name");
        console.log(usage);
        return;
    }

    const plan = data.plans.find(p => p.id === id);
    if (!plan) {
        console.log("no plan found by name '%s'", oldname);
        return;
    }
    plan.name = newname;
    await save();
    console.log("plan '%s' renamed to '%s'", oldname, newname);
});

