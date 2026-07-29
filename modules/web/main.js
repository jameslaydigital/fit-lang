import { data, stack } from "../../storage.js";
import { cmds } from "../../cmds.js";
import { currentPlan } from "../../helpers.js";
import { print, error } from "../../io.js";

cmds.register("web dashboard", async function() {
    let output = `<h1>fitness tracker</h1>`;
    output += "<hr />";
    output += "<ul>";
    output += "</ul>";
    for (const plan of data.plans) {
        output += `<li>${plan.id}: ${plan.name}</li>`;
    }
    output += `<button data-command="web load data; web dashboard" onclick="window.command(this)">load test data</button>`;
    document.body.innerHTML = output;
});

cmds.register("web load data", async function() {
    for (const key of Object.keys(data)) {
        localStorage.setItem(key, data[key]);
    }
});
