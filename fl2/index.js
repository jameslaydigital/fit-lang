// just a traditional high-level stack machine
// no modularity, no worries about stuff like that

let currToken = "";
const stack = [];

stack.pop = (type=null) => {
    const result = Array.prototype.pop.call(stack);
    if (typeof result === "undefined") {
        throw new Error(`token: ${currToken} Stack underflow`);
    }
    const actual = result === null && "null" ||
        ["string", "number", "boolean", "undefined"].includes(typeof result ) && typeof result ||
        result.type && result.type ||
        result.constructor && result.constructor.name ||
        "unknown";

    if (typeof type === "string" && type !== actual) {

        throw new TypeError(`token: ${currToken} → expected a '${type}' but found a '${actual}': ${JSON.stringify(result)} was at top of ${JSON.stringify(stack, null, 4)}`);
    }
    return result;
};

const data = {
    get(id) {
        const result = localStorage.getItem(id);
        if (typeof result === "undefined") {
            throw new ReferenceError(`token: ${currToken} no object found for id ${id}`);
        }
        return JSON.parse(result);
    },

    set(id, value) {
        if (typeof id !== "string") {
            throw new TypeError(`set(id, value) id must be a string.`);
        }

        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        localStorage.setItem(id, value);
    },
};

async function process(input) {
    const tokens = input.split(/\/+/g).toReversed().map(w => decodeURIComponent(w)).filter(Boolean);
    for (const token of tokens) {
        await command(token);
    }
}

function makeID() {
    return Math.random().toString(36).split(".").pop().slice(0,6);
}

async function command(token) {

    // set token for error reporting:
    currToken = token;
    console.log("cmd: %s", token);

    let id, obj, arg, lhs, rhs, i;

    switch (token) {

        case "load":
            obj = data.get(stack.pop());
            stack.push(obj);
            break;

        case "create-plan":
            stack.push({
                type: "plan",
                id: makeID(),
                name: stack.pop("string"),
            });
            break;

        case "create-set":
            stack.push({
                id: makeID(),
                type: "set",
                reps: Number(stack.pop("string")),
                weight: Number(stack.pop("string")),
                unit: String(stack.pop("string")),
                exerciseId: null,
            });
            break;

        case "create-exercise":
            stack.push({
                id: makeID(),
                type: "exercise",
                name: stack.pop("string"),
                workoutId: null,
            });
            break;

        case "create-workout":
            stack.push({
                id: makeID(),
                type: "workout",
                name: stack.pop("string"),
                planId: null,
            });
            break;

        case "plan-add-workout":
            lhs = stack.pop("plan");
            rhs = stack.pop("workout");
            rhs.planId = lhs.id;
            stack.push(rhs);
            stack.push(lhs);
            break;

        case "workout-add-exercise":
            lhs = stack.pop("workout");
            rhs = stack.pop("exercise");
            lhs.workoutId = rhs.id;
            stack.push(rhs);
            stack.push(lhs);
            break;

        case "exercise-add-set":
            lhs = stack.pop("exercise");
            rhs = stack.pop("set");
            lhs.exerciseId = rhs.id;
            stack.push(rhs);
            stack.push(lhs);
            break;

        case "update":
        case "save":
            obj = stack.pop();
            if (obj.id) {
                data.set(obj.id, obj);
                console.log("object saved: ", obj);
            }
            stack.push(obj);
            break;

        case "swap":
            obj = [stack.pop(), stack.pop()];
            stack.push(obj.shift());
            stack.push(obj.shift());
            break;

        case "drop":
            console.log("dropped: ", stack.pop());
            break;

        case "show-plan-list":
            console.log("plans: ");
            i = 0;
            for (const key of Object.keys(localStorage)) {
                obj = data.get(key);
                if (obj.type && obj.type === "plan") {
                    i++;
                    console.log("%s: %s", obj.id, obj.name);
                }
            }
            console.log("%d items", i);
            break;

        case "show-plan-details":
            obj = data.get(stack.pop());
            id = obj.id;
            console.log("plan %s → '%s'", obj.id, obj.name);
            console.log("─────────────────────");
            console.log("");

            for (const key of Object.keys(localStorage)) {
                obj = data.get(key);
                if (obj.type === "workout" && obj.planId === id) {
                    console.log("  • %s → %s (%s)", obj.id, obj.planId, obj.name);
                }
            }
            break;

        default:
            if (token.startsWith("'")) {
                stack.push(token.slice(1));
            } else if (token.startsWith("#")) {
                stack.push(document.getElementById(token.slice(1)));
            } else {
                stack.push(token);
            }
    }
}


// the advantage in serializing these function calls
// is that you can record and play back the calls.
// You can also execute them directly from the URL.
// That could bad because there's no way to prevent duplicate actions from
// refreshing the page, and enables click-jacking attacks where malicious
// payloads are delivered through an innocent-looking URL.  It is therefore
// recommended that read-only access is granted in the context of evaluating a
// window hash, and another, privileged command dispatch method is used when
// mutations are needed. This way, people can use the window hash to see
// "pages" or "views", but interactions with the elments on those views are
// required in order to perform real work.

process([

    "save/create-set/5/50/'lbs",
    "save/create-exercise/'curls",
    "exercise-add-set",
    "swap",                 // set now at top
    "update",               // save the set
    "drop",                 // drop the set, exercise is now top

    "create-workout/'arms",
    "save",                 // save the workout
    "workout-add-exercise", // exercise points to workout
    "swap",                 // swap workout with exercise, exercise now at top
    "update",               // update exercise
    "drop",                 // drop exercise, workout now at top

    "create-plan/'basic",
    "save",                 // save plan basic
    "plan-add-workout",     // add plan workout
    "swap",                 // swap so workout on top
    "save",                 // save workout
    "drop",                 // drop workout, plan on top
    "drop",

    "show-plan-list",
    "show-plan-details/4y0i2c",

].toReversed().join("/"));

console.log(JSON.stringify(stack, null, 4));
