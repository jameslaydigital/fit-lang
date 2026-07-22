import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";

data.plans = data.plans ?? [];

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
    static fromObject(obj) {
        if (typeof obj !== "object" || obj === null) {
            throw new Error(
                "Plan::fromObject expects something other than " +
                JSON.stringify(obj)
            );
        }
        if (typeof obj.name !== "string") {
            throw new Error("cannot construct plan because it's missing a name!");
        }
        return new Plan(obj.name);
    }
}

// plan CRUD
cmds.register("plan", async function() {
    console.log("plan - workout plans");
    console.log("--------------------");
    console.log("options:");
    console.log("\tplan list");
    console.log("\tplan rename");
});

cmds.register("stack push plan", async function([plan_name]) {
    if (typeof plan_name !== "string") {
        console.error("cannot push plan without plan name");
        console.log("usage: stack push plan <plan_name>");
        return;
    }

    const plan = data.plans.find(p => p.name === plan_name);
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
    console.log(data.plans);
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
    data.plans.push(new Plan(name));
    save();
    console.log("created new plan '%s'", name);
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

