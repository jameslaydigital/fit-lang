import { print, error } from "./io.js";

class Commands {

    constructor() {
        this.routes = {};
        this.lastRoute = "";
    }

    displayRoutes(prefix) {
        const routes = this.getRoutes(prefix);
        routes.sort();
        for (const route of routes) {
            this.usage(route);
        }
    }

    showCurrentUsage() {
        return this.usage(this.lastRoute);
    }

    usage(route) {
        const handler = this.routes[route];
        const signature = handler.toString().split(/\n/g).shift().match(/\[.*?\]/);
        if (signature && signature.length) {
            const opts = signature[0]
                .replace(/\[/g, "<")
                .replace(/]/g, ">")
                .replace(/, /g, "> <");
            print("  > %s %s", route, opts);
        } else {
            print("  > %s", route);
        }
    }

    getRoutes(prefix) {
        const keys = Object.keys(this.routes);
        if (typeof prefix === "string") {
            return keys.filter(k => k.startsWith(prefix));
        }
        if (prefix instanceof RegExp) {
            return keys.filter(k => prefix.test(k));
        }
        return keys;
    }

    register(cmd, handler) {
        if (typeof this.routes[cmd] === "function") {
            throw new Error(`command ${cmd} already registered!`);
        }
        this.routes[cmd] = handler;
    }

    // returns function or null
    async dispatch(tokens) {

        // grab maximum match before grabbing shorter matches:
        for (let i = tokens.length; i > 0; i--) {
            const normalized_subcmd = tokens.slice(0, i).join(" ");
            if (typeof this.routes[normalized_subcmd] === "function") {
                this.lastRoute = normalized_subcmd;
                const handler = this.routes[normalized_subcmd];
                await handler(tokens.slice(i));
                return;
            }
        }

        // at this point, we didn't find anything.
        // normalize and show usage for subcommands

        const normalized_subcmd = tokens.slice().join(" ").trim();
        if (tokens.length === 0) {
            print("fit - a fitness tracking platform");
            print("─────────────────────────────────");
            print("available commands:");
            cmds.displayRoutes();
            return;
        }

        if (this.getRoutes(normalized_subcmd).length === 0) {
            error("fit error: command '%s' not recognized.", normalized_subcmd);
            return;
        }

        print("%s options:\n───────────────\n", normalized_subcmd);
        this.displayRoutes(normalized_subcmd);

    }

}

export const cmds = new Commands();
