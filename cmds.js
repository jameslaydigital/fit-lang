class Commands {

    constructor() {
        this.routes = {};
    }

    register(cmd, handler) {
        if (typeof this.routes[cmd] === "function") {
            throw new Error(`command ${cmd} already registered!`);
        }
        this.routes[cmd] = handler;
    }

    // returns function or null
    dispatch(tokens) {

        // grab maximum match before grabbing shorter matches:
        for (let i = tokens.length; i > 0; i--) {
            const normalized_subcmd = tokens.slice(0, i).join(" ");
            if (typeof this.routes[normalized_subcmd] === "function") {
                const handler = this.routes[normalized_subcmd];
                handler(tokens.slice(i));
                return;
            }
        }
        throw new Error(`invalid command - no handler for '${JSON.stringify(tokens)}'`);
    }

}

export const cmds = new Commands();
