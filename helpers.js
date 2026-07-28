import { data, save } from "./storage.js";
import { cmds } from "./cmds.js";
import { print, error, exit } from "./io.js";

export async function chosen(idProp) {
    print("  → %s", data[idProp] ?? "empty");
}

export async function details(dstProp, srcProp) {
    const e = data[srcProp].find(e => e.id === data[dstProp]) ?? null;
    if (!e) {
        print("no %s chosen", srcProp);
        return;
    }
    print("%s: current selection → %s", srcProp, JSON.stringify(e, null, 4));
}

export async function unchoose(dstProp="", srcProp="") {
    if (!data[dstProp]) {
        print("  → %s cleared.", dstProp);
        return;
    }
    const item = data[srcProp].find(e => e.id === data[dstProp]) ?? null;

    data[dstProp] = null;
    await save();
    if (!item) {
        print("  → %s cleared.", dstProp);
    }
    print("%s → '%s' unselected", srcProp, item.id);
}

export async function choose(dstProp, srcProp, id) {
    check(() => id);
    const list = data[srcProp].filter(e => e.id.startsWith(id));
    if (list.length > 1) {
        error("ambigous record id for '%s': %d", srcProp, id);
        if (list.length > 10) {
            print("ids: %s\n...more records...", JSON.stringify(data[srcProp].slice(0, 10), null, 4));
            return;
        }
        print("ids: %s", JSON.stringify(data[srcProp].slice(0, 10), null, 4));
        return;
    }

    const item = list.pop() ?? null;
    if (!item) {
        error("error: no %s found with id prefix '%s'", srcProp, id);
        return;
    }
    data[dstProp] = item.id;
    await save();
    if (typeof item.name === "string") {
        print("%s '%s' (%s) chosen", dstProp, item.id, item.name);
    } else {
        print("%s '%s' chosen", dstProp, item.id);
    }
}

export async function list(srcProp) {
    print("%s", srcProp);
    print("───────────\n");
    for (const e of data[srcProp]) {
        print("  → %s: %s", e.id, e.name ?? JSON.stringify({...e, id: undefined}));
    }
    print("\n───────────");
    print("%d total", data[srcProp].length);
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
        error(msg);
        print("usage:");
        cmds.showCurrentUsage();
        exit(1);
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
        error(msg);
        cmds.showCurrentUsage();
        exit(1);
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
        error(msg);
        cmds.showCurrentUsage();
        exit(1);
    }
    return num;

}
