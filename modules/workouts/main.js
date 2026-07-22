import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";

data.workouts = data.workouts ?? {};

cmds.register("workout", function() {
    console.log("workout - a series of exercises");
    console.log("-------------------------------");
    console.log("options:");
    const routes = cmds.getRoutes("workout ");
    for (const route of routes) {
        console.log("\t%s", route);
    }
});

cmds.register("workout list", async function() {
    console.log("workouts:");
    if (data.workouts.length === 0) {
        console.log("no workouts. Add one with `workout create`");
        return;
    }
    for (const workout of data.workouts) {
        console.log("\t- %s", JSON.stringify(workout));
    }
});

cmds.register("workout create", async function([name]) {
    if (typeof name !== "string" || name === "") {
        console.error("error: name required");
        console.log("usage: workout create <name>");
        return;
    }

    data.workouts.push({
        type: "workout",
        id: Math.random(36).toString().split(".").pop(),
        name: name,
        plan: null,
    });

    await save();
    console.log("workout '%s' created", name);
});

cmds.register("workout remove", async function([name]) {
    if (typeof name !== "string" || name === "") {
        console.error("error: name required");
        console.log("usage: workout remove <name>");
        return;
    }
    const length = data.workouts.length;
    data.workouts = data.workouts.filter(w => w.name !== name);
    await save();
    const diff = length - data.workouts.length;
    if (diff === 0) {
        console.log("no workouts removed");
    } else {
        console.log("%d workout(s) removed", diff);
    }
});

cmds.register("workout read", async function([name]) {
    if (typeof name !== "string" || name === "") {
        console.error("error: name required");
        console.log("usage: workout read <name>");
        return;
    }

    const workout = data.workouts.find(w => w.name === name);
    if (!workout) {
        console.log("no workout found by name '%s'", name);
        return;
    }
    console.log("%s", JSON.stringify(workout, null, 4));
});

cmds.register("workout rename", async function([oldName, newName]) {
    if (typeof oldName !== "string" || oldName === "") {
        console.error("error: old name required");
        console.log("usage: workout rename <old-name> <new-name>");
        return;
    }
    if (typeof newName !== "string" || newName === "") {
        console.error("error: new name required");
        console.log("usage: workout rename <old-name> <new-name>");
        return;
    }
    
    const workout = data.workouts.find(w => w.name === oldName);
    if (!workout) {
        console.error("error: workout '%s' does not exist", oldName);
        return;
    }
    
    workout.name = newName;
    await save();
    console.log("workout '%s' renamed to '%s'", oldName, newName);
});

cmds.register("plan add workout", async function([workoutId]) {
    if (!workoutId) {
        console.error("plan add workout: missing workout id");
        console.log("usage:\n\tplan add workout <workout-id>");
        return;
    }

    // at this point, the plan should exist somewhere, right?
});
