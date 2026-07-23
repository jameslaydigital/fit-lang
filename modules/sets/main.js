import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { currentSet, currentExercise } from "../../helpers.js";

data.sets = data.sets ?? {};
data.setId = data.setId ?? null;

// set is {
//  string id,
//  float reps,
//  float amount,
//  string unitOfMeasure,
//  string exercise, // link to exercise.id
// }
//
// and is used to specify things like
// 5 reps of 10 lbs
// 2 reps of 20 minutes
// 50 reps of 1 bodyweight

cmds.register("set", async function() {
    const set = currentSet();
    console.log("set - actual work logged for an exercise");
    console.log("selected: ", set);
    cmds.displayRoutes("set ");
});

cmds.register("set list", async function() {
    console.log("sets:");
    if (data.sets.length === 0) {
        console.log("no sets. Add one with `set create`");
        return;
    }
    for (const set of data.sets) {
        console.log("\t- %s", JSON.stringify(set));
    }
});

cmds.register("set create", async function() {
    const set = {
        id: Math.random().toString(36).split(".").pop(),
        reps: 0,
        unitOfMeasure: "kg",
        amount: 0,
        exercise: null,
    };
    data.setId = set.id;
    data.sets.push(set);
    await save();
    console.log("set created and selected: %s", set.id);
});

cmds.register("set choose", async function([id]) {
    if (typeof id !== "string") {
        console.error("cannot choose set without set id");
        console.log("usage: set choose <id>");
        return;
    }

    const set = data.sets.find(s => s.id === id);
    if (set) {
        data.setId = set.id;
        await save();
        console.log("set %s chosen", id);
    } else {
        console.log("set id not found: %s", id);
    }
});

cmds.register("set unchoose", async function() {
    if (!data.setId) {
        console.log("no set selected");
        return;
    }
    const set = currentSet();
    data.setId = null;
    await save();
    console.log("set '%s' unselected", set.id);
});

cmds.register("set reps", async function([reps]) {
    const set = currentSet();
    if (!set) {
        console.error("no set selected");
        return;
    }
    const repsNum = parseFloat(reps);
    if (isNaN(repsNum) || repsNum < 0) {
        console.error("invalid reps value");
        return;
    }
    set.reps = repsNum;
    await save();
    console.log("set %s reps set to %d", set.id, repsNum);
});

cmds.register("set amount", async function([amount, unitOfMeasure]) {
    const set = currentSet();
    if (!set) {
        console.error("no set selected");
        return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
        console.error("invalid amount value");
        return;
    }
    set.amount = amountNum;
    if (unitOfMeasure) {
        set.unitOfMeasure = unitOfMeasure;
    }
    await save();
    console.log("set %s amount set to %d %s", set.id, amountNum, set.unitOfMeasure);
});

cmds.register("exercise add set", async function([setId]) {
    if (!setId) {
        console.error("exercise add set: missing set id");
        console.log("usage:\n\texercise add set <set-id>");
        return;
    }

    const exercise = currentExercise();
    if (!exercise) {
        console.error("no selected exercise - choose one with `exercise choose <id>`");
        return;
    }

    const set = data.sets.find(s => s.id === setId);
    if (!set) {
        console.error("no set found by id '%s'", setId);
        return;
    }

    set.exercise = exercise.id;
    await save();
    console.log(
        "set '%s' added to exercise '%s'",
        set.id,
        exercise.name
    );
});

cmds.register("set remove", async function([id]) {
    if (!id) {
        console.error("set remove: missing id");
        console.log("usage:\n\tset remove <set-id>");
        return;
    }
    const length = data.sets.length;
    data.sets = data.sets.filter(s => s.id !== id);
    const diff = length - data.sets.length;
    if (diff === 0) {
        console.log("no sets removed");
        return;
    }

    await save();
    console.log("removed %d sets", diff);
});
