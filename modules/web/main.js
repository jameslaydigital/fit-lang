import { data, stack, save } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { currentPlan, currentWorkout, currentExercise } from "../../helpers.js";
import { render, print, error } from "../../io.js";

// this is TBD - we'll have more stuff to put here later
cmds.register("web dashboard", async function() {
    console.log("web dashboard: data.plans =", JSON.stringify(data.plans));
    await render(`
        <h1>fitness tracker</h1>
        <hr />
        ${ `<div><button data-command="web load data; web dashboard">load test data</button></div>`, "" }
        <div><button data-command="web show plans">workout plans</button></div>
    `);
});

cmds.register("web show plans", async function() {
    await render(`
        <h1>workout plans</h1>
        <hr />
        ${data.plans.map(plan => {
            const highlight = plan.id === data.planId ? ' style="font-weight: bold;"' : '';
            return `<div${highlight}>
                ${plan.name} (${plan.id})
                <button data-command="plan choose ${plan.id}; web show plans">choose</button>
                <button data-command="web plan edit form ${plan.id}">edit</button>
                <button data-command="plan choose ${plan.id}; web show plan workouts">workouts</button>
            </div>`;
        }).join("")}
        <hr />
        <div><button data-command="web plan create form">create plan</button></div>
        <div><button data-command="web dashboard">back</button></div>
    `);
});

cmds.register("web plan create form", async function() {
    const modalId = "modal-plan-create";
    if (document.getElementById(modalId)) return;

    await render(document.body.innerHTML + `
        <div id="${modalId}" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;">
            <div style="background:white;padding:20px;border-radius:8px;min-width:300px;max-width:400px;">
                <h2 style="margin:0 0 12px 0;">Create Plan</h2>
                <input type="text" id="plan-name-input" placeholder="Plan name" style="width:100%;box-sizing:border-box;padding:8px;margin-bottom:12px;" />
                <div style="display:flex;gap:8px;">
                    <button onclick="var n=document.getElementById('plan-name-input').value.trim();if(n){this.dataset.command='plan create '+JSON.stringify(n)+'; web show plans';window.command(this)}" style="flex:1;">Create</button>
                    <button onclick="document.getElementById('${modalId}').remove()" style="flex:1;">Cancel</button>
                </div>
            </div>
        </div>`
    );
});

cmds.register("web plan edit form", async function([id]) {
    const plan = data.plans.find(p => p.id === id);
    if (!plan) {
        await render(`<p>Plan not found.</p><div><button data-command="web show plans">back</button></div>`);
        return;
    }

    data.planId = plan.id;

    const planWorkouts = data.workouts.filter(w => w.plan === plan.id);
    planWorkouts.sort((a, b) => a.order - b.order);

    const availableWorkouts = data.workouts.filter(w => !w.plan);

    await render(`
        <h1>Edit: ${plan.name}</h1>
        <hr />
        <div style="margin-bottom:12px;">
            <input type="text" id="rename-plan-input" value="${plan.name}" />
            <button onclick="var n=document.getElementById('rename-plan-input').value.trim();if(n){this.dataset.command='plan rename ${plan.id} '+JSON.stringify(n)+'; web plan edit form ${plan.id}';window.command(this)}">rename</button>
        </div>
        <hr />
        <h3>Workouts</h3>
        ${planWorkouts.length === 0 ? `<p>No workouts in this plan.</p>` : planWorkouts.map((w, i) => `
            <div style="margin:4px 0;">
                ${i + 1}. ${w.name} (${w.id})
                ${i > 0 ? `<button data-command="plan workout reorder ${w.id} ${i - 1}; web plan edit form ${plan.id}">up</button>` : ""}
                ${i < planWorkouts.length - 1 ? `<button data-command="plan workout reorder ${w.id} ${i + 1}; web plan edit form ${plan.id}">down</button>` : ""}
                <button data-command="plan workout remove ${w.id}; web plan edit form ${plan.id}">remove</button>
            </div>
        `).join("")}
        <hr />
        <h3>Add Workout</h3>
        ${availableWorkouts.length > 0 ? availableWorkouts.map(w => `
            <div style="margin:4px 0;">
                ${w.name} (${w.id})
                <button data-command="plan add workout ${w.id}; web plan edit form ${plan.id}">add</button>
            </div>
        `).join("") : `<p>No available workouts to add.</p>`}
        <hr />
        <div><button data-command="web show plans">back</button></div>
    `);
});

cmds.register("web show plan workouts", async function() {
    const plan = currentPlan();
    if (!plan) {
        await render(`<p>No plan selected.</p><div><button data-command="web show plans">back to plans</button></div>`);
        return;
    }
    const planWorkouts = data.workouts.filter(w => w.plan === plan.id);
    planWorkouts.sort((a, b) => a.order - b.order);
    await render(`
        <h1>${plan.name}</h1>
        <p>${planWorkouts.length} workout(s)</p>
        <hr />
        ${planWorkouts.map(workout => `
            <div>
                ${workout.order + 1}. ${workout.name} (${workout.id})
                <button data-command="workout choose ${workout.id}; web show workout exercises">details</button>
                <button data-command="workout choose ${workout.id}; web workout edit form">edit</button>
                <button data-command="workout remove ${workout.id}; web show plan workouts">remove</button>
            </div>
        `).join("")}
        <hr />
        <div><button data-command="plan unchoose; web show plans">back</button></div>
    `);
});

cmds.register("web show workout exercises", async function() {
    const workout = currentWorkout();
    if (!workout) {
        await render(`<p>No workout selected.</p><div><button data-command="web show plan workouts">back</button></div>`);
        return;
    }
    const workoutExercises = data.exercises.filter(e => e.workout === workout.id);
    workoutExercises.sort((a, b) => a.order - b.order);

    await render(`
        <h1>${workout.name}</h1>
        <p>${workoutExercises.length} exercise(s)</p>
        <hr />
        ${workoutExercises.map(exercise => `
            <div>
                ${exercise.order + 1}. ${exercise.name} (${exercise.id})
                <button data-command="exercise choose ${exercise.id}; exercise details">details</button>
                <button data-command="exercise choose ${exercise.id}; web exercise edit form">edit</button>
                <button data-command="workout exercise remove ${exercise.id}; web show workout exercises">remove</button>
            </div>
        `).join("")}
        <hr />";
        <div><button data-command="workout unchoose; web show plan workouts">back</button></div>
    `);
});

cmds.register("web show exercise sets", async function() {
    // TODO - don't do this one yet
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
