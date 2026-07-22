import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";

data.workouts = data.workouts ?? {};

cmds.register("workout", function() {
    console.log("workout - a series of exercises");
    console.log("-------------------------------");
    console.log("options:");
    cmds.displayRoutes("workout ");
});

cmds.register("workout list ids", async function() {
    for (const workout of data.workouts) {
        console.log("%s", workout.id);
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
        order: 0,
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

    if (typeof data.plan === "undefined" || data.plan === null) {
        console.error("no selected plan - choose one with `plan choose <id>`");
        return;
    }

    const workout = data.workouts.find(w => w.id === workoutId);
    if (!workout) {
        console.error("no workout found by id '%s'", workoutId);
        return;
    }

    const planWorkouts = data.workouts.filter(w => w.plan === data.plan.id);
    workout.order = planWorkouts.length;
    workout.plan = data.plan.id;
    await save();
    console.log(
        "workout '%s' added to plan '%s'",
        workout.name,
        data.plan.name
    );
});

cmds.register("plan workout reorder", async function([workoutId, newPosition]) {
    if (!workoutId) {
        console.error("plan workout reorder: no workout id specified");
        cmds.usage("plan workout reorder");
        return;
    }

    const pos = parseInt(newPosition, 10);
    if (isNaN(pos) || pos < 0) {
        console.error("plan workout reorder: invalid position");
        cmds.usage("plan workout reorder");
        return;
    }

    const target = data.workouts.find(w => w.id === workoutId);
    if (!target) {
        console.error("plan workout reorder: no workout found by id '%s'", workoutId);
        return;
    }

    if (!data.plan) {
        console.error("plan workout reorder: no selected plan");
        return;
    }

    const planWorkouts = data.workouts.filter(w => w.plan === data.plan.id);
    const oldOrder = target.order;

    if (pos > oldOrder) {
        for (const workout of planWorkouts) {
            if (workout.order > oldOrder && workout.order <= pos) {
                workout.order--;
            }
        }
    } else if (pos < oldOrder) {
        for (const workout of planWorkouts) {
            if (workout.order >= pos && workout.order < oldOrder) {
                workout.order++;
            }
        }
    }

    target.order = pos;

    planWorkouts.sort((a, b) => a.order - b.order);
    for (let i = 0; i < planWorkouts.length; i++) {
        planWorkouts[i].order = i;
    }

    await save();
    console.log("reordered.");
});

cmds.register("plan workout", async function() {
    console.log("plan workout");
    console.log("------------");
    cmds.displayRoutes("plan workout ");
});

cmds.register("plan workout list", async function() {
    if (data.plan === null) {
        console.error("no selected plan - choose one with `plan choose <id>`");
        return;
    }

    console.log("workouts in plan '%s'", data.plan.name);
    console.log("---------------------");
    console.log("");
    const planWorkouts = data.workouts.filter(w => w.plan === data.plan.id);
    planWorkouts.sort((a, b) => a.order - b.order);
    for (const workout of planWorkouts) {
        console.log("  %d) %s: %s", workout.order, workout.id, workout.name);
    }
});
