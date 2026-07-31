import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { list, details, chosen, choose, unchoose, check, checkFloat, checkIndex, currentWorkout, currentPlan } from "../../helpers.js";
import { print, error } from "../../io.js";

data.workouts = data.workouts ?? [];
data.workoutId = data.workoutId ?? null;

cmds.register("workout choose",   ([id]) => choose("workoutId", "workouts", id));
cmds.register("workout chosen",   ()     => chosen("workoutId"));
cmds.register("workout details",  ()     => details("workoutId", "workouts"));
cmds.register("workout list",     ()     => list("workouts"));
cmds.register("workout unchoose", ()     => unchoose("workoutId", "workouts"));

cmds.register("workout create", async function([name]) {
    check(() => name);

    data.workouts.push({
        type: "workout",
        id: Math.random().toString(36).split(".").pop(),
        order: 0,
        name: name,
        plan: null,
    });

    await save();
    print("workout '%s' created", name);
});

cmds.register("workout remove", async function([workout_id]) {
    check(() => workout_id);
    const length = data.workouts.length;
    data.workouts = data.workouts.filter(w => w.id !== workout_id);
    await save();
    const diff = length - data.workouts.length;
    if (diff === 0) {
        print("no workouts removed");
    } else {
        print("%d workout(s) removed", diff);
    }
});

cmds.register("workout read", async function([workout_id]) {
    check(() => workout_id);
    const workout = data.workouts.find(w => w.workout_id === workout_id);
    if (!workout) {
        print("no workout found by workout_id '%s'", workout_id);
        return;
    }
    print("%s", JSON.stringify(workout, null, 4));
});

cmds.register("workout rename", async function([id, newName]) {
    check(() => id);
    check(() => newName);
    const workout = data.workouts.find(w => w.id === id);
    if (!workout) {
        error("error: workout '%s' does not exist", id);
        return;
    }
    
    print("workout '%s' renamed to '%s'", workout.name, newName);
    workout.name = newName;
    await save();
});

cmds.register("plan add workout", async function([workoutId]) {
    check(() => workoutId);

    const plan = currentPlan();
    if (!plan) {
        error("no selected plan - choose one with `plan choose <id>`");
        return;
    }

    const workout = data.workouts.find(w => w.id === workoutId);
    if (!workout) {
        error("no workout found by id '%s'", workoutId);
        return;
    }

    const planWorkouts = data.workouts.filter(w => w.plan === plan.id);
    workout.order = planWorkouts.length;
    workout.plan = plan.id;
    await save();
    print(
        "workout '%s' added to plan '%s'",
        workout.name,
        plan.name
    );
});

cmds.register("plan workout remove", async function([workoutId]) {
    check(() => workoutId);

    const plan = currentPlan();
    if (!plan) {
        error("no selected plan - choose one with `plan choose <id>`");
        return;
    }

    const workout = data.workouts.find(w => w.id === workoutId);
    if (!workout) {
        error("no workout found by id '%s'", workoutId);
        return;
    }

    if (workout.plan !== plan.id) {
        error("workout '%s' is not in plan '%s'", workout.name, plan.name);
        return;
    }

    workout.plan = null;
    workout.order = 0;

    const planWorkouts = data.workouts.filter(w => w.plan === plan.id);
    planWorkouts.sort((a, b) => a.order - b.order);
    for (let i = 0; i < planWorkouts.length; i++) {
        planWorkouts[i].order = i;
    }

    await save();
    print(
        "workout '%s' removed from plan '%s'",
        workout.name,
        plan.name
    );
});

cmds.register("plan workout reorder", async function([workoutId, newPosition]) {
    check(() => workoutId);
    const pos = checkIndex(() => newPosition);
    const target = data.workouts.find(w => w.id === workoutId);
    if (!target) {
        error("plan workout reorder: no workout found by id '%s'", workoutId);
        return;
    }

    const plan = currentPlan();
    if (!plan) {
        error("plan workout reorder: no selected plan");
        return;
    }

    const planWorkouts = data.workouts.filter(w => w.plan === plan.id);
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
    print("reordered.");
});

cmds.register("plan workout", async function() {
    print("plan workout");
    print("------------");
    cmds.displayRoutes("plan workout ");
});

cmds.register("plan workout list", async function() {
    const plan = currentPlan();
    if (!plan) {
        error("no selected plan - choose one with `plan choose <id>`");
        return;
    }

    print("workouts in plan '%s'", plan.name);
    print("---------------------");
    print("");
    const planWorkouts = data.workouts.filter(w => w.plan === plan.id);
    planWorkouts.sort((a, b) => a.order - b.order);
    for (const workout of planWorkouts) {
        print("  %d) %s: %s", workout.order, workout.id, workout.name);
    }
});
