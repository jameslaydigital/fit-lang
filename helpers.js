import { data } from "./storage.js";
import { cmds } from "./cmds.js";

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
