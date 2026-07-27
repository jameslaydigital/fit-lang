import { data, save } from "./storage.js";
import { cmds } from "./cmds.js";

export async function choose(dstProp, srcProp, id) {
    check(() => id);
    const list = data[srcProp].filter(e => e.id.startsWith(id));
    if (list.length > 1) {
        console.error("ambigous record id for '%s': %d", srcProp, id);
        if (list.length > 10) {
            console.log("ids: %s\n...more records...", JSON.stringify(data[srcProp].slice(0, 10), null, 4));
            return;
        }
        console.log("ids: %s", JSON.stringify(data[srcProp].slice(0, 10), null, 4));
        return;
    }

    const item = list.pop() ?? null;
    if (!item) {
        console.error("error: no %s found with id prefix '%s'", srcProp, id);
        return;
    }
    data[dstProp] = item.id;
    await save();
    if (typeof item.name === "string") {
        console.log("%s '%s' (%s) chosen", dstProp, item.id, item.name);
    } else {
        console.log("%s '%s' chosen", dstProp, item.id);
    }
}

export async function list(srcProp) {
    console.log("%s", srcProp);
    console.log("───────────\n");
    for (const e of data[srcProp]) {
        console.log("  → %s: %s", e.id, e.name ?? JSON.stringify({...e, id: undefined}));
    }
    console.log("\n───────────");
    console.log("%d total", data[srcProp].length);
}

export function currentWorkout() {
    if (data.workoutId == null) return null;
    return data.workouts.find(w => w.id === data.workoutId) ?? null;
}

export function currentPlan() {
    if (data.planId == null) return null;
    return data.plans.find(p => p.id === data.planId) ?? null;
}

export function currentExercise() {
    if (data.exerciseId == null) return null;
    return data.exercises.find(e => e.id === data.exerciseId) ?? null;
}

export function currentSet() {
    if (data.setId == null) return null;
    return data.sets.find(s => s.id === data.setId) ?? null;
}

export function check(fn, msg="") {
    const value = fn();
    if (!value) {
        if (!msg) {
            msg = fn.toString().split("=>").pop().trim();
            msg = `must provide parameter: '${msg}'`;
        }
        console.error(msg);
        console.log("usage:");
        cmds.showCurrentUsage();
        process.exit(1);
    }
    return value;
}

export function checkFloat(fn, msg="") {
    const value = fn();
    const num = parseFloat(value, 10);
    if (isNaN(num) || num < 0) {
        if (!msg) {
            msg = fn.toString().split("=>").pop().trim();
            msg = `'${msg}' is not a valid number`;
        }
        console.error(msg);
        cmds.showCurrentUsage();
        process.exit(1);
    }
    return num;
}

export function checkIndex(fn, msg="") {
    const value = fn();
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) {
        if (!msg) {
            msg = fn.toString().split("=>").pop().trim();
            msg = `'${msg}' is not a valid number`;
        }
        console.error(msg);
        cmds.showCurrentUsage();
        process.exit(1);
    }
    return num;

}
