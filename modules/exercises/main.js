import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";

data.exercises = data.exercises ?? [];
data.exercise = data.exercise ?? null;

cmds.register("exercise", async function() {
    console.log("exercise - a single exercise");
    if (data.exercise === null) {
        console.log("no exercise selected.");
    } else {
        console.log("selected exercise: (%s) '%s'", data.exercise.id, data.exercise.name);
    }
    console.log("-------------------------------");
    console.log("options:");
    cmds.displayRoutes("exercise ");
});

cmds.register("exercise choose", async function([id]) {
    if (typeof id !== "string") {
        console.error("cannot choose exercise without exercise id");
        console.log("usage: exercise choose <id>");
        return;
    }

    const exercise = data.exercises.find(e => e.id === id);
    if (exercise) {
        data.exercise = exercise;
        await save();
        console.log("exercise %s chosen", id);
    } else {
        console.log("exercise id not found: %s", id);
    }
});

cmds.register("exercise unchoose", async function() {
    if (!data.exercise) {
        console.log("no exercise selected");
        return;
    }
    const exercise = data.exercise;
    data.exercise = null;
    await save();
    console.log("exercise '%s' unselected", exercise.id);
});

cmds.register("exercise create", async function([name]) {
    if (typeof name !== "string" || name === "") {
        console.error("error: name required");
        console.log("usage: exercise create <name>");
        return;
    }

    data.exercises.push({
        type: "exercise",
        id: Math.random().toString(36).split(".").pop(),
        order: 0,
        name: name,
        workout: null,
    });

    await save();
    console.log("exercise '%s' created", name);
});

cmds.register("exercise remove", async function([name]) {
    if (typeof name !== "string" || name === "") {
        console.error("error: name required");
        console.log("usage: exercise remove <name>");
        return;
    }
    const length = data.exercises.length;
    data.exercises = data.exercises.filter(e => e.name !== name);
    await save();
    const diff = length - data.exercises.length;
    if (diff === 0) {
        console.log("no exercises removed");
    } else {
        console.log("%d exercise(s) removed", diff);
    }
});

cmds.register("exercise rename", async function([id, newName]) {
    if (typeof id !== "string" || id === "") {
        console.error("error: id required");
        console.log("usage: exercise rename <id> <new-name>");
        return;
    }
    if (typeof newName !== "string" || newName === "") {
        console.error("error: new name required");
        console.log("usage: exercise rename <id> <new-name>");
        return;
    }

    const exercise = data.exercises.find(e => e.id === id);
    if (!exercise) {
        console.error("error: exercise '%s' does not exist", id);
        return;
    }

    console.log("exercise '%s' renamed to '%s'", exercise.name, newName);
    exercise.name = newName;
    await save();
});

cmds.register("workout exercise add", async function([exerciseId]) {
    if (!exerciseId) {
        console.error("workout exercise add: missing exercise id");
        console.log("usage:\n\tworkout exercise add <exercise-id>");
        return;
    }

    if (!data.workout) {
        console.error("no selected workout - choose one with `workout choose <id>`");
        return;
    }

    const exercise = data.exercises.find(e => e.id === exerciseId);
    if (!exercise) {
        console.error("no exercise found by id '%s'", exerciseId);
        return;
    }

    const workoutExercises = data.exercises.filter(e => e.workout === data.workout.id);
    exercise.order = workoutExercises.length;
    exercise.workout = data.workout.id;
    await save();
    console.log(
        "exercise '%s' added to workout '%s'",
        exercise.name,
        data.workout.name
    );
});

cmds.register("workout exercise remove", async function([exerciseId]) {
    if (!exerciseId) {
        console.error("workout exercise remove: missing exercise id");
        console.log("usage:\n\tworkout exercise remove <exercise-id>");
        return;
    }

    if (!data.workout) {
        console.error("no selected workout - choose one with `workout choose <id>`");
        return;
    }

    const exercise = data.exercises.find(e => e.id === exerciseId);
    if (!exercise) {
        console.error("no exercise found by id '%s'", exerciseId);
        return;
    }

    if (exercise.workout !== data.workout.id) {
        console.error("exercise '%s' is not in workout '%s'", exercise.name, data.workout.name);
        return;
    }

    exercise.workout = null;
    exercise.order = 0;

    const workoutExercises = data.exercises.filter(e => e.workout === data.workout.id);
    workoutExercises.sort((a, b) => a.order - b.order);
    for (let i = 0; i < workoutExercises.length; i++) {
        workoutExercises[i].order = i;
    }

    await save();
    console.log(
        "exercise '%s' removed from workout '%s'",
        exercise.name,
        data.workout.name
    );
});

cmds.register("workout exercise reorder", async function([exerciseId, newPosition]) {
    if (!exerciseId) {
        console.error("workout exercise reorder: no exercise id specified");
        cmds.usage("workout exercise reorder");
        return;
    }

    const pos = parseInt(newPosition, 10);
    if (isNaN(pos) || pos < 0) {
        console.error("workout exercise reorder: invalid position");
        cmds.usage("workout exercise reorder");
        return;
    }

    const target = data.exercises.find(e => e.id === exerciseId);
    if (!target) {
        console.error("workout exercise reorder: no exercise found by id '%s'", exerciseId);
        return;
    }

    if (!data.workout) {
        console.error("workout exercise reorder: no selected workout");
        return;
    }

    const workoutExercises = data.exercises.filter(e => e.workout === data.workout.id);
    const oldOrder = target.order;

    if (pos > oldOrder) {
        for (const exercise of workoutExercises) {
            if (exercise.order > oldOrder && exercise.order <= pos) {
                exercise.order--;
            }
        }
    } else if (pos < oldOrder) {
        for (const exercise of workoutExercises) {
            if (exercise.order >= pos && exercise.order < oldOrder) {
                exercise.order++;
            }
        }
    }

    target.order = pos;

    workoutExercises.sort((a, b) => a.order - b.order);
    for (let i = 0; i < workoutExercises.length; i++) {
        workoutExercises[i].order = i;
    }

    await save();
    console.log("reordered.");
});

