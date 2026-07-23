import { data } from "./storage.js";

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
