import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { list, details, chosen, choose, unchoose, check, checkIndex, currentExercise, currentWorkout } from "../../helpers.js";
import { print, error } from "../../io.js";

data.exercises = data.exercises ?? [];
data.exerciseId = data.exerciseId ?? null;

cmds.register("exercise choose",   ([id]) => choose("exerciseId", "exercises", id));
cmds.register("exercise chosen",   ()     => chosen("exerciseId"));
cmds.register("exercise details",  ()     => details("exerciseId", "exercises"));
cmds.register("exercise list",     ()     => list("exercises"));
cmds.register("exercise unchoose", ()     => unchoose("exerciseId", "exercises"));

cmds.register("exercise create", async function([name]) {
    check(() => name);
    data.exercises.push({
        type: "exercise",
        id: Math.random().toString(36).split(".").pop(),
        order: 0,
        name: name,
        workout: null,
    });

    await save();
    print("exercise '%s' created", name);
});

cmds.register("exercise remove", async function([name]) {
    check(() => name);
    const length = data.exercises.length;
    data.exercises = data.exercises.filter(e => e.name !== name);
    await save();
    const diff = length - data.exercises.length;
    if (diff === 0) {
        print("no exercises removed");
    } else {
        print("%d exercise(s) removed", diff);
    }
});

cmds.register("exercise rename", async function([id, newName]) {
    check(() => id);
    check(() => newName);

    const exercise = data.exercises.find(e => e.id === id);
    check(() => exercise, "error: exercise not found");

    print("exercise '%s' renamed to '%s'", exercise.name, newName);
    exercise.name = newName;
    await save();
});

cmds.register("workout exercise add", async function([exerciseId]) {

    check(() => exerciseId);

    const workout = currentWorkout();
    if (!workout) {
        error("no selected workout - choose one with `workout choose <id>`");
        return;
    }

    const exercise = data.exercises.find(e => e.id === exerciseId);
    if (!exercise) {
        error("no exercise found by id '%s'", exerciseId);
        return;
    }

    const workoutExercises = data.exercises.filter(e => e.workout === workout.id);
    exercise.order = workoutExercises.length;
    exercise.workout = workout.id;
    await save();
    print(
        "exercise '%s' added to workout '%s'",
        exercise.name,
        workout.name
    );
});

cmds.register("workout exercise remove", async function([exerciseId]) {
    check(() => exerciseId);

    const workout = currentWorkout();
    if (!workout) {
        error("no selected workout - choose one with `workout choose <id>`");
        return;
    }

    const exercise = data.exercises.find(e => e.id === exerciseId);
    if (!exercise) {
        error("no exercise found by id '%s'", exerciseId);
        return;
    }

    if (exercise.workout !== workout.id) {
        error("exercise '%s' is not in workout '%s'", exercise.name, workout.name);
        return;
    }

    exercise.workout = null;
    exercise.order = 0;

    const workoutExercises = data.exercises.filter(e => e.workout === workout.id);
    workoutExercises.sort((a, b) => a.order - b.order);
    for (let i = 0; i < workoutExercises.length; i++) {
        workoutExercises[i].order = i;
    }

    await save();
    print(
        "exercise '%s' removed from workout '%s'",
        exercise.name,
        workout.name
    );
});

cmds.register("workout exercise reorder", async function([exerciseId, newPosition]) {
    check(() => exerciseId);
    const pos = checkIndex(newPosition);
    const target = data.exercises.find(e => e.id === exerciseId);
    if (!target) {
        error("workout exercise reorder: no exercise found by id '%s'", exerciseId);
        return;
    }

    const workout = currentWorkout();
    if (!workout) {
        error("workout exercise reorder: no selected workout");
        return;
    }

    const workoutExercises = data.exercises.filter(e => e.workout === workout.id);
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
    print("reordered.");
});
