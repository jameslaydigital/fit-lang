import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { list, choose, check, currentPlan } from "../../helpers.js";

data.plans = data.plans ?? [];
data.planId = data.planId ?? null;

// plan CRUD
cmds.register("plan status", async function() {
    const plan = currentPlan();
    if (plan === null) {
        console.log("no plan selected.");
    } else {
        console.log("selected plan: (%s) '%s'", plan.id, plan.name);
    }
});

cmds.register("plan list", async function() {
    return list("plans");
});

cmds.register("plan choose", async function([id]) {
    await choose("planId", "plans", id);
});

cmds.register("plan unchoose", async function() {
    if (!data.planId) {
        console.log("no plan selected");
        return;
    }
    const plan = currentPlan();
    data.planId = null;
    await save();
    console.log("plan '%s' unselected", plan.id);
});


cmds.register("plan list ids", async function() {
    for (const plan of data.plans) {
        console.log(plan.id);
    }
});


cmds.register("plan create", async function([name]) {
    check(() => name);
    const plan = {
        type: "plan",
        id: Math.random().toString(36).split(".").pop(),
        name: name,
    };
    data.plans.push(plan);
    data.planId = plan.id;
    save();
    console.log("created new plan '%s'", name);
    console.log("plan %s selected", plan.id);
});

cmds.register("plan rename", async function([id, newname]) {
    check(() => id);
    check(() => newname);
    const plan = data.plans.find(p => p.id === id);
    if (!plan) {
        console.log("no plan found by id '%s'", id);
        return;
    }
    const oldname = plan.name;
    plan.name = newname;
    await save();
    console.log("plan '%s' renamed to '%s'", oldname, newname);
});

cmds.register("plan remove", async function([id]) {
    check(() => id);
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

