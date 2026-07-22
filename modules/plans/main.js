import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";

data.plans = data.plans ?? [];
data.plan = data.plan ?? null;

// plan CRUD
cmds.register("plan", async function() {
    console.log("plan - workout plans");
    if (data.plan === null) {
        console.log("no plan selected.");
    } else {
        console.log("selected plan: (%s) '%s'", data.plan.id, data.plan.name);
    }
    console.log("--------------------");
    console.log("options:");
    cmds.displayRoutes("plan ");
});

cmds.register("plan choose", async function([id]) {
    if (typeof id !== "string") {
        console.error("cannot choose plan without plan id");
        console.log("usage: plan choose <id>");
        return;
    }

    const plan = data.plans.find(p => p.id === id);
    if (plan) {
        data.plan = plan;
        await save();
        console.log("plan %s chosen", id);
    } else {
        console.log("plan id not found: ", id);
    }
});

cmds.register("plan unchoose", async function() {
    if (!data.plan) {
        console.log("no plan selected");
        return;
    }
    const plan = data.plan;
    data.plan = null;
    await save();
    console.log("plan '%s' unselected", plan.id);
});

cmds.register("plan list", async function() {
    console.log("plans:");
    if (data.plans.length === 0) {
        console.log("\tNo plans. Add one with `plan create <name>`");
        return;
    }
    for (const plan of data.plans) {
        console.log("\t- %s: %s", plan.id, plan.name);
    }
});

cmds.register("plan list ids", async function() {
    for (const plan of data.plans) {
        console.log(plan.id);
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
    const plan = {
        type: "plan",
        id: Math.random().toString(36).split(".").pop(),
        name: name,
    };
    data.plans.push(plan);
    data.plan = plan;
    save();
    console.log("created new plan '%s'", name);
    console.log("plan %s selected", plan.id);
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

cmds.register("plan remove", async function([id]) {
    if (!id) {
        console.log("fit plan remove: missing id");
        console.log("usage:\n\tfit plan remove <id>");
        return;
    }

    const length = data.plans.length;
    data.plans = data.plans.filter(p => p.id !== id);
    const diff = length - data.plans.length;
    await save();
    if (diff === 0) {
        console.log("no plans removed");
    } else {
        console.log("%d plan(s) removed", diff);
    }
});

