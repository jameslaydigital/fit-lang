import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { list, details, chosen, choose, unchoose, check, checkFloat, currentSet, currentExercise } from "../../helpers.js";
import { print, error } from "../../io.js";

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

cmds.register("set choose",   ([id]) => choose("setId", "sets", id));
cmds.register("set chosen",   ()     => chosen("setId"));
cmds.register("set details",  ()     => details("setId", "sets"));
cmds.register("set list",     ()     => list("sets"));
cmds.register("set unchoose", ()     => unchoose("setId", "sets"));

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
    print("set created and selected: %s", set.id);
});

cmds.register("set reps", async function([reps]) {
    checkFloat(() => reps);

    const set = currentSet();
    if (!set) {
        error("no set selected");
        return;
    }
    const repsNum = parseFloat(reps);
    if (isNaN(repsNum) || repsNum < 0) {
        error("invalid reps value");
        return;
    }
    set.reps = repsNum;
    await save();
    print("set %s reps set to %d", set.id, repsNum);
});

cmds.register("set amount", async function([amount, unitOfMeasure]) {
    const set = currentSet();
    if (!set) {
        error("no set selected");
        return;
    }
    const amountNum = checkFloat(() => amount);
    set.amount = amountNum;
    if (unitOfMeasure) {
        set.unitOfMeasure = unitOfMeasure;
    }
    await save();
    print("set %s amount set to %d %s", set.id, amountNum, set.unitOfMeasure);
});

cmds.register("exercise add set", async function([setId]) {
    check(() => setId);

    const exercise = currentExercise();
    if (!exercise) {
        error("no selected exercise - choose one with `exercise choose <id>`");
        return;
    }

    const set = data.sets.find(s => s.id === setId);
    if (!set) {
        error("no set found by id '%s'", setId);
        return;
    }

    set.exercise = exercise.id;
    await save();
    print(
        "set '%s' added to exercise '%s'",
        set.id,
        exercise.name
    );
});

cmds.register("set remove", async function([id]) {
    check(() => id);
    const length = data.sets.length;
    data.sets = data.sets.filter(s => s.id !== id);
    const diff = length - data.sets.length;
    if (diff === 0) {
        print("no sets removed");
        return;
    }

    await save();
    print("removed %d sets", diff);
});
