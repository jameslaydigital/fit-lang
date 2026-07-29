import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { currentPlan } from "../../helpers.js";
import { print, error } from "../../io.js";

function renderPlanList(plans) {
    if (plans.length === 0) {
        return `<li><em>no plans yet</em></li>`;
    }
    return plans.map(p => `<li>${p.id}: ${p.name}</li>`).join("");
}

cmds.register("web dashboard", async function() {
    console.log("web dashboard: data.plans =", JSON.stringify(data.plans));
    let output = `<h1>fitness tracker</h1>`;
    output += "<hr />";
    output += `<ul>${renderPlanList(data.plans)}</ul>`;
    output += `<button data-command="web load data; web dashboard" onclick="window.command(this)">load test data</button>`;
    document.body.innerHTML = output;
});

cmds.register("web load data", async function() {
    data.plans = [
        { type: "plan", id: "dsfeqvx14cv", name: "5x5" },
        { type: "plan", id: "vgll9up735c", name: "test plan" },
    ];
    data.planId = "dsfeqvx14cv";

    data.workouts = [
        { type: "workout", id: "abc", name: "curls", order: 0, plan: "dsfeqvx14cv" },
        { type: "workout", id: "def", name: "deadlifts", order: 1, plan: "dsfeqvx14cv" },
    ];
    data.workoutId = null;

    data.exercises = [
        { type: "exercise", id: "sx1cbug36ll", name: "curls", order: 0, workout: null },
    ];
    data.exerciseId = null;

    data.sets = [
        { id: "ydqjmotqlco", reps: 0, unitOfMeasure: "kg", amount: 0, exercise: null },
    ];
    data.setId = null;

    await save();
});
